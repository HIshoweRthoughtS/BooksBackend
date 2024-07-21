
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });

/**
 * BOOK
 * NOT NULL:  isbn, join_author, join_publisher, title
 * UNIQUE:    isbn
 * 
 * TODO
 * NOT NULL:  join_acc, join_book
 * UNIQUE:    join_acc + join_book
 * 
 * REVIEWED
 * NOT NULL:  join_book, join_acc, first_impression, last_updated (default), 
 * UNIQUE:    join_book + join_acc
 */

//Prepared Statements
const insertNewEssential = db.prepare("INSERT INTO book (isbn,join_author,join_publisher,title) VALUES (@isbn,@autorid,@pubid,@title);");

const selectUniqueConstrainsStmt = db.prepare("SELECT * FROM book WHERE id_ref = @row OR isbn = @isbn;")

const selectReviewdForAcc = db.prepare("SELECT * FROM reviewed_book WHERE join_acc = ?;");
const selectTodoForAcc = db.prepare("SELECT * FROM user_todo_book WHERE join_acc = ?;");


//Book Stuff
//todo: joins to return authors and publishers and etc
export function checkUnique(isbn) {
  const rows = selectUniqueConstrainsStmt.all({row: -1,isbn});
  return rows.length > 0 ? false:true;
}
export function createNewEssens(isbn, title, autorid, pubid) {
  return insertNewEssential.run({
    isbn,title,autorid,pubid
  });
}
//todo:
function createNewFull() {}

export function getReviewedForAcc(acc_id) {
  console.log('[bsql]select reviewed - acc: ', typeof acc_id);

  return selectReviewdForAcc.all(parseInt(acc_id));
}
export function getTodoForAcc(acc_id) {
  console.log('[bsql]select todo - acc: ', typeof acc_id);

  return selectTodoForAcc.all(parseInt(acc_id));
}
