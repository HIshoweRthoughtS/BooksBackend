import * as dbBooks from './dbdrivers/book.sqlite.js'

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
