import * as dbHandler from '../dbdrivers/sqlite/index.sqlite.js'
import { Logger } from './logger.service.js';

export function getAllBooks(sort) {
    return dbHandler.getAllBooks();
}

export function setPagesAndChapterFromBody(bookId, body) {
    Logger.getLogger().add(`LastPage: ${body.last_page}`, 2, 'BookDetails');
    let success = dbHandler.setBookLastPage(bookId,body.last_page);
    if (success && body.last_chapter) {
        success = dbHandler.setBookLastChapter(bookId, body.last_chapter);
    }
    return success;
}

export function getReviewedForAcc(accId) {
    return dbHandler.getReviewedForAcc(accId);
}
export function getTodoForAcc(accId) {
    return dbHandler.getTodoForAcc(accId);
}

export function setTodoPagesFromBody(readId, body) {
    let success = false;
    if (!!body.current_page) {
        success = setTodoCurrentPage(readId, body.current_page);
    }
    return success;
}
function setBookLastPage(bookId, lastPage) {
    return dbHandler.setBookLastPage(bookId, lastPage);
}
function setTodoCurrentPage(readId, currentPage) {
    return dbHandler.setTodoCurrentPage(readId, currentPage);
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
    if (dbHandler.checkReviewedUnique(accId,body.bookId)) {

        success = dbHandler.createReviewed(accId, body.bookId);
        //todo:[opt] what is this? please make it better
    }
    //if success === false this line should not return a valid value anyway
    const reviewedId = dbHandler.getReviewedId(accId, body.bookId);
    if (reviewedId > 0) {

        if (!!body.finished_read_date) {
            success = addReadFromBody(accId, body);
            if (success) {
                addReviewsFromBody(reviewedId, body);
                addQuotesFromBody(reviewedId, body);
            }
        }
        else {
            success = addTodoFromBody(reviewedId, body);
        }

    }
    return success;
}

function addTodoFromBody(revId, body) {
    let success = false;
    if (dbHandler.checkUserTodoUniue(revId)) {
        success = dbHandler.createTodo(revId, body.start_date);
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
