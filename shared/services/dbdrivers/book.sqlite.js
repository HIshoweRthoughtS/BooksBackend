
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });
db.pragma('journal_mode = WAL');

//Prepared Statements
const selectReviewdForAcc = db.prepare("SELECT * FROM reviewed_book WHERE join_acc = ?;");
const selectTodoForAcc = db.prepare("SELECT * FROM user_todo_book WHERE join_acc = ?;");


//Book Stuff
//todo: joins to return authors and publishers and etc

export function getReviewedForAcc(acc_id) {
  console.log('[bsql]select reviewed - acc: ', typeof acc_id);

  return selectReviewdForAcc.all(parseInt(acc_id));
}
export function getTodoForAcc(acc_id) {
  console.log('[bsql]select todo - acc: ', typeof acc_id);

  return selectTodoForAcc.all(parseInt(acc_id));
}
