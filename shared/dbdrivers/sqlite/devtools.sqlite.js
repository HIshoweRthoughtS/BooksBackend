
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });

export function deleteAll() {
    console.log(db.exec('delete from book; delete from publisher; delete from author; delete from account;'));
}
