import * as dbBooks from './book.sqlite.js';
import * as dbAuthor from './author.sqlite.js';
import * as dbPublisher from './publisher.sqlite.js';
//todo:[next] fassade for acc,book,author etc. then use transaction, rollback, and commit befor creating book, because it is perfect test

//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });
db.pragma('journal_mode = WAL');

const createBookExtended = db.transaction((isbn,title,author,publisher) => {
    const pubId = publisher.id > 0 ? publisher.id : dbPublisher.createNewEssens(publisher.title).lastInsertRowid;
    const authorId = author.id > 0 ? author.id : dbAuthor.createNewEssens(author.firstName, author.lastName).lastInsertRowid;
    dbBooks.createNewEssens(isbn,title,authorId,pubId);
});

const moveTodo2Reviewed = db.transaction((todoId, reviewedBookId, startDate, finishDate, thoughts, quicknote) => {
    const createRet = dbBooks.createNewRead(reviewedBookId, startDate, finishDate, thoughts, quicknote);
    const removeRet = dbBooks.deleteTodo(todoId);
    console.log(`Remove: ${removeRet}\nCreate: ${createRet}`);
});

//private execution helper
/*noexport*/function tryDryExecute(execFunc, ...args) {
    let success = false;
    try {
        execFunc.apply(null, args);
        success = true;
    } catch (e) {
        console.log('[Idxsql] create - error: ', e);
    }
    return success;
}

//GETTER (select) no account =====================
export function checkBookUnique(isbn) {
    return dbBooks.checkUnique(isbn);
}
export function getAuthorId(firstName, lastName) {
    return dbAuthor.getAuthorId(firstName,lastName);
}
export function getPublisherId(name) {
    return dbPublisher.getPublisherId(name);
}
export function getAllBooks() {
    return dbBooks.getAllDispalayInfo();
}
//GETTER (select) account =================
export function checkUserTodoUniue(accId, bookId) {
    return dbBooks.checkUserTodoUniue(accId, bookId);
}
export function checkReviewedUnique(accId, bookId) {
    return dbBooks.checkReviewedUnique(accId, bookId);
}
export function checkReadsInRange(reviewedBookId, startDate, finishDate) {
    return dbBooks.checkReadsInRange(reviewedBookId,startDate,finishDate);
}
export function getReviewedForAcc(accId) {
    return dbBooks.getReviewedForAcc(accId);
}
export function getTodoForAcc(accId) {
    return dbBooks.getTodoForAcc(accId);
}
export function getReviewedId(accId, bookId) {
    return dbBooks.getReviewedId(bookId, accId);
}
export function getReaedId(reviewedBook, startDate) {
    return dbBooks.getReaedId(reviewedBook, startDate);
}

//SETTER (update)
export function setTodoLastPage(todoId, lastPage) {
    return tryDryExecute(dbBooks.setTodoLastPage, todoId, lastPage);
}
export function setTodoCurrentPage(todoId, currentPage) {
    return tryDryExecute(dbBooks.setTodoCurrentPage, todoId, currentPage);
}

//CREATOR (insert) ==================================
//create book should start a transaction, since if there is no author or publisher, these will have to be created first.
export function createNewAuthor(firstName,lastName) {
    return tryDryExecute(dbAuthor.createNewEssens,firstName,lastName);
}
export function createNewPublisher(title/*, countryOfOrigin, hqLocation*/) {
    return tryDryExecute(dbPublisher.createNewEssens, title);
}
export function createBook(isbn,title,author,publisher) {
    createBookExtended(isbn,title,author,publisher);
    // return tryDryExecute(createBookExtended, isbn,title,author,publisher)
    // let success = false;
    // try {
    //     createBookExtended(isbn,title,author,publisher);
    //     success = true;
    // } catch (e) {
    //     console.log('[Idxsql] createbookext - error: ', e);
    // }
    // return success;
}

export function createTodo(accId, bookId, startDate) {
    return tryDryExecute(dbBooks.createNewTodo,accId, bookId, startDate);
}
export function createReviewed(accId, bookId) {
    return tryDryExecute(dbBooks.createNewReviewed, accId, bookId);
}
export function createRead(reviewedBookId, startDate, finishDate, thoughts, quicknote) {
    return tryDryExecute(dbBooks.createNewRead, reviewedBookId, startDate, finishDate, thoughts, quicknote);
}
export function createReview(readId,bookId,isPublic,rating,title,essay,tldr) {
    return tryDryExecute(dbBooks.createNewReview, readId,bookId,isPublic,rating,title,essay,tldr);
}
export function createQuote(readId,bookId,content,note,chapter,pageFrom,pageTo,lineFrom,lineTo,isPublic) {
    return tryDryExecute(dbBooks.createNewQuote, readId,bookId,content,note,chapter,pageFrom,pageTo,lineFrom,lineTo,isPublic);
}

export function moveTodoReviewed(todoId, reviewedBookId, startDate, finishDate, thoughts, quicknote) {
    moveTodo2Reviewed(todoId, reviewedBookId, startDate, finishDate, thoughts, quicknote);
}
