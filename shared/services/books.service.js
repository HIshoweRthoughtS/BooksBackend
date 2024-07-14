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
