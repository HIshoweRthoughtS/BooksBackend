
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });

export function deleteAll() {
    console.log(db.exec(`
        delete from marker;
        delete from review;
        delete from quote;
        delete from book_read;
        delete from reviewed_book;
        delete from todo_reminder
        delete from user_todo_book;
        delete from book;
        delete from marker_colors;
        delete from publisher;
        delete from author;
        delete from account;
        `));
}
