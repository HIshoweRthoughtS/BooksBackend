import * as dbHandler from '../dbdrivers/sqlite/index.sqlite.js'
import { Logger } from './logger.service.js';

export function getAllBooks(sort) {
    return dbHandler.getAllBooks();
}

export function getReviewedForAcc(accId) {
    return dbHandler.getReviewedForAcc(accId);
}
export function getTodoForAcc(accId) {
    return dbHandler.getTodoForAcc(accId);
}

export function setTodoPagesFromBody(body) {
    let success = false;
    if (body.last_page) {
        console.log(body);
        success = setBookLastPage(body.todo_id, body.last_page);
    }
    if (null !== body.current_page) {
        success = setTodoCurrentPage(body.todo_id, body.current_page);
    }
    return success;
}
function setBookLastPage(bookId, lastPage) {
    return dbHandler.setBookLastPage(bookId, lastPage);
}
function setTodoCurrentPage(todoId, currentPage) {
    return dbHandler.setTodoCurrentPage(todoId, currentPage);
}

export function createBookFromBody(body) {
    return createBook(body.isbn, body.title, body.author, body.publisher);
}
//todo:maybe start returning codes not just 01.
//return already exists
function createBook(isbn,title,authorObj,publisherObj) {
    let success = false;
    if (!dbHandler.checkBookUnique(isbn)) {
        //ret already exists
        Logger.getLogger().add('Book already exists', 3, 'BookS');
    } else {
        const authorId = dbHandler.getAuthorId(authorObj.firstName, authorObj.lastName);
        const pubId = dbHandler.getPublisherId(publisherObj.title);
        Logger.getLogger().add(`Created! AuthId: ${authorId} || PubId: ${pubId}`, 1, 'BookS');
        success = dbHandler.createBook(isbn,title, {id: authorId, ...authorObj}, {id: pubId,...publisherObj});
    }
    return success;
}

export function addReviewedChildFromBody(accId,body) {
    let success = false;
    if (dbHandler.checkReviewedUnique(accId,body.b_id_ref)) {

        success = dbHandler.createReviewed(accId, body.b_id_ref);
        //todo:[opt] what is this? please make it better
    }
    //if success === false this line should not return a valid value anyway
    const reviewedId = dbHandler.getReviewedId(accId, body.b_id_ref);
    if (reviewedId > 0) {

        if (null !== body.finished_read_date) {
            success = addReadFromBody(accId, body);
        }
        else {
            success = addTodoFromBody(accId, body);
        }
        if (success) {
            addReviewsFromBody(reviewedId, body);
            addQuotesFromBody(reviewedId, body);
        }

    }
    return success;
}

function addTodoFromBody(body) {
    let success = false;
    if (dbHandler.checkUserTodoUniue(accId, body.book.b_id_ref)) {
        success = dbHandler.createTodo(accId, body.book.b_id_ref, body.start_date);
    }
    return success;
}
function addReadFromBody(reviewedId, body) {
    let success = dbHandler.createRead(
        reviewedId,
        body.started_read_date,
        body.finished_read_date,
        body.thoughts,
        body.quicknote
    );
    return success;
}

function addReviewsFromBody(reviewedId, body) {
    const readId = dbHandler.getReaedId(reviewedId, body.started_read_date);
    let sRev = false;
    body.reviews.forEach(review => {
        //todo: log every insert, that fails
        sRev = addReview(readId, body.b_id_ref, review.is_public,review.rating,review.title,review.essay,review.tldr); 
    });
    if (!sRev) {
        console.warn('[BookS] add read - At least one review insert failed');
    }
}
function addReview(readId,bookId,isPublic,rating,title,essay,tldr) {
    return dbHandler.createReview(readId,bookId,isPublic,rating,title,essay,tldr);
}

function addQuotesFromBody(reviewedId, body) {
    const readId = dbHandler.getReaedId(reviewedId, body.started_read_date);
    let sQuote = false;
    body.quotes.forEach(quote => {
        sQuote = addQuote(readId, body.b_id_ref, quote.content,quote.note,quote.chapter,quote.page_from,quote.page_to,quote.line_from,quote.line_to,quote.is_public)
    });
    if (!sQuote) {
        console.warn('[BookS] add read - At least one quote insert failed');
    }
}
function addQuote(readId,bookId,content,note,chapter,pageFrom,pageTo,lineFrom,lineTo,isPublic) {
    return dbHandler.createQuote(readId,bookId,content,note,chapter,pageFrom,pageTo,lineFrom,lineTo,isPublic);
}
