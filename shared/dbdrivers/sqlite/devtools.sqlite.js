
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });

export function deleteAll() {
    db.exec('delete from publishers; delete from authors; delete from book; delete from account;');
}
