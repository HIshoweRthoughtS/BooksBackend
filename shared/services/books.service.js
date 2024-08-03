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
