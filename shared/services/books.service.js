import * as dbBooks from './dbdrivers/sqlite/book.sqlite.js'
import * as dbAuthors from './dbdrivers/sqlite/author.sqlite.js'
import * as dbPubs from './dbdrivers/publisher.sqlite.js'

export function getAllBooks() {
    return dbBooks.selectAllBooks();
}

export function getAllAuthors() {
    return dbBooks.selectAllBooks();
}

export function getAllPublishers() {
    return dbBooks.selectAllBooks();
}

export function getReviewedForAcc(acc_id) {
    return dbBooks.getReviewedForAcc(acc_id);
}
export function getTodoForAcc(acc_id) {
    return dbBooks.getTodoForAcc(acc_id);
}

export function createBookFromBody(body) {
    createBook(body.isbn, body.title, body.author, body.publisher)
}

function createBook(isbn,title,author,publisher) {
    const pubId = getOrCreatePublisher(publisher.name);
    const authId = getOrCreateAuthor(author.firstName, author.lastName);
    if (dbBooks.checkUnique(isbn,title,authId,pubId)) {
        console.log(dbBooks.createNewEssens(isbn,title,authId,pubId));
    }
}

function getOrCreatePublisher(name) {
    if (dbPubs.checkUnique(name)) {
        console.log(dbPubs.createNewEssens(name));
    }
    return dbPubs.getPublisherId(name);
}

function getOrCreateAuthor(firstName,lastName) {
    if (dbAuthors.checkUnique(firstName,lastName)) {
        console.log(dbAuthors.createNewEssens(firstName,lastName));
    }
    return dbAuthors.getAuthorId(firstName,lastName);
}
