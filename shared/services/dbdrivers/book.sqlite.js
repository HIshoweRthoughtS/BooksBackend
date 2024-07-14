
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });
db.pragma('journal_mode = WAL');

//Book Stuff
//todo: joins to return authors and publishers and etc
function selectAllBooks() {
  return db.prepare('select * from book').all();
}

function selectAllAuthors() {
  return db.prepare('select * from author').all();
}

function selectAllPublishers() {
  return db.prepare('select * from publisher').all();
}
