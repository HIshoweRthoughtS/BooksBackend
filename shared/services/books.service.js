import * as dbHandler from '../dbdrivers/sqlite/index.sqlite.js'

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
        success = setTodoLastPage(body.todo_id, body.last_page);
    }
    if (null !== body.current_page) {
        success = setTodoCurrentPage(body.todo_id, body.current_page);
    }
    return success;
}
function setTodoLastPage(todoId, lastPage) {
    return dbHandler.setTodoLastPage(todoId, lastPage);
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
        console.log('[BookS] createbook - already exists!');
    } else {
        const authorId = dbHandler.getAuthorId(authorObj.firstName, authorObj.lastName);
        const pubId = dbHandler.getPublisherId(publisherObj.title);
        console.log('[BookS] createbook - autorid: ', authorId, ' pubid: ', pubId);
        success = dbHandler.createBook(isbn,title, {id: authorId, ...authorObj}, {id: pubId,...publisherObj});
    }
    return success;
}

export function createTodoFromBody(accId, body) {
    let success = false;
    if (dbHandler.checkUserTodoUniue(accId, body.book.b_id_ref)) {
        success = dbHandler.createTodo(accId, body.book.b_id_ref, body.start_date);
    }
    return success;
}
export function addReadFromBody(accId, body) {
    let success = false;
    if (dbHandler.checkReviewedUnique(accId,body.b_id_ref)) {
        const created = dbHandler.createReviewed(accId, body.b_id_ref);
        //todo:[opt] what is this? please make it better
        if (!created) {
            return created;
        }
    }
    const reviewedId = dbHandler.getReviewedId(accId, body.b_id_ref);
    if (reviewedId > 0 && null != body.remove_todo_id) {
        success = true;
        //transaction remove todo and create read
        dbHandler.moveTodoReviewed(
            body.remove_todo_id,
            reviewedId,
            body.started_read_date,
            body.finished_read_date,
            body.thoughts,
            body.quicknote
        );
    }
    else if (reviewedId > 0) {
        success = dbHandler.createRead(
            reviewedId,
            body.started_read_date,
            body.finished_read_date,
            body.thoughts,
            body.quicknote
        );
    }
    if (success) {
        addReviewsFromBody(reviewedId, body);
        addQuotesFromBody(reviewedId, body);
    }
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
