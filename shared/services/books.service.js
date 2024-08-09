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
    if (dbHandler.checkUserTodoUniue(accId, body.book.id_ref)) {
        success = dbHandler.createTodo(accId, body.book.id_ref, body.start_date);
    }
    return success;
}
export function addReadFromBody(accId, body) {
    let success = false;
    if (dbHandler.checkReviewedUnique(accId,body.book_id_ref)) {
        const created = dbHandler.createReviewed(accId, body.book_id_ref);
        //todo:[opt] what is this? please make it better
        if (!created) {
            return created;
        }
    }
    const reviewedId = dbHandler.getReviewedId(accId, body.book_id_ref);
    if (null != body.remove_todo_id) {
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
    else {
        success = dbHandler.createRead(
            reviewedId,
            body.started_read_date,
            body.finished_read_date,
            body.thoughts,
            body.quicknote
        );
    }
    return success;
}
