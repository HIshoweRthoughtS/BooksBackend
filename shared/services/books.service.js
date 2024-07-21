import * as dbHandler from '../dbdrivers/sqlite/index.sqlite.js'

export function getReviewedForAcc(acc_id) {
    return dbBooks.getReviewedForAcc(acc_id);
}
export function getTodoForAcc(acc_id) {
    return dbBooks.getTodoForAcc(acc_id);
}

export function createBookFromBody(body) {
    return createBook(body.isbn, body.title, body.author, body.publisher);
}

function createBook(isbn,title,authorObj,publisherObj) {
    let success = false;
    const authorId = dbHandler.getAuthorId(authorObj.firstName, authorObj.lastName);
    const pubId = dbHandler.getPublisherId(publisherObj.name);
    console.log('[BookS] createbook - autorid: ', authorId, ' pubid: ', pubId);
    success = dbHandler.createBook(isbn,title, {id: authorId, ...authorObj}, {id: pubId,...publisherObj});
    return success;
}
