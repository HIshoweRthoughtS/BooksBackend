import * as dbBooks from './book.sqlite.js';
import * as dbAuthor from './author.sqlite.js';
import * as dbPublisher from './publisher.sqlite.js';
//todo:[next] fassade for acc,book,author etc. then use transaction, rollback, and commit befor creating book, because it is perfect test

//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });
db.pragma('journal_mode = WAL');

const createBookExtended = db.transaction((isbn,title,author,publisher) => {
    const pubId = publisher.id > 0 ? publisher.id : dbPublisher.createNewEssens(publisher.name).lastInsertRowid;
    const authorId = author.id > 0 ? author.id : dbAuthor.createNewEssens(author.firstName, author.lastName).lastInsertRowid;
    dbBooks.createNewEssens(isbn,title,authorId,pubId);
});

//private execution helper
/*noexport*/function tryInsert(createFunction) {
    let success = false;
    try {
        createFunction();
    } catch (e) {
        console.log('[Idxsql] create - error: ', e);
    }
}

//GETTER (select)
export function getAuthorId(firstName, lastName) {
    return dbAuthor.getAuthorId(firstName,lastName);
}
export function getPublisherId(name) {
    return dbPublisher.getPublisherId(name);
}
//SETTER (update)

//CREATOR (insert)
//create book should start a transaction, since if there is no author or publisher, these will have to be created first.
export function createNewAuthor(firstName,lastName) {
    // return tryInsert(dbAuthor.createNewEssens(firstName,lastName));
    let success = false;
    try {
        dbAuthor.createNewEssens(firstName,lastName);
        success = true
    } catch (e) {
        console.log('[Idxsql] createauthor - error: ', e);
    }
    return success;
}
export function createNewPublisher(title/*, countryOfOrigin, hqLocation*/) {
    let success = false;
    try {
        dbPublisher.createNewEssens(title);
        success = true
    } catch (e) {
        console.log('[Idxsql] createauthor - error: ', e);
    }
    return success;
}
export function createBook(isbn,title,author,publisher) {
    let success = false;
    try {
        createBookExtended(isbn,title,author,publisher);
        success = true;
    } catch (e) {
        console.log('[Idxsql] createbookext - error: ', e);
    }
    return success;
}
