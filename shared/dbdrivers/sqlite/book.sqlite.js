
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
const shallowBookSelector = 'b.*,a.first_name as a_first, a.last_name as a_last, p.title as p_title';

//Prepared Statements
const removeTodo = db.prepare("DELETE FROM user_todo_book WHERE id_ref = @todoId;");
const insertNewEssential = db.prepare("INSERT INTO book (isbn,join_author,join_publisher,title) VALUES (@isbn,@autorid,@pubid,@title);");
const insertNewTodo = db.prepare("INSERT INTO user_todo_book (join_acc,join_book,order_rank,started_todo_date) VALUES (@account,@book,0,@start);");
//todo:get first impression from frontend
const insertNewReviewed = db.prepare("INSERT INTO reviewed_book (join_book, join_acc, first_impression) VALUES (@bookId, @accId, 'nice');");
const insertNewRead = db.prepare("INSERT INTO book_read (join_reviewed_book,started_read_date,finished_read_date,thoughts,quicknote) VALUES (@reviewedBookId,@startDate,@finishDate,@thoughts,@qn);");

const selectUniqueConstrainsStmt = db.prepare("SELECT * FROM book WHERE id_ref = @row OR isbn = @isbn;");
const selectUniqueUserTodo = db.prepare("SELECT * FROM user_todo_book WHERE join_acc = @accId AND join_book = @bookId");
const selectUniqueReviewed = db.prepare("SELECT * FROM reviewed_book WHERE join_acc = @accId AND join_book = @bookId");
//reads cannot overlap (start-finish, then new read. No start-start-finish-finish)
const selectReadsInRange = db.prepare("SELECT * FROM book_read WHERE join_reviewed_book = @reviewedBookId AND (started_read_date < @startDate AND finished_read_date > @startDate) OR (started_read_date < @finishDate AND finished_read_date > @finishDate);");

//todo: refactor in view
const selectAllBooks = db.prepare("SELECT * FROM book;");
const selectAllBooksShallowJoin = db.prepare(`SELECT ${shallowBookSelector} FROM book as b JOIN author a on a.id_ref = b.join_author JOIN publisher p on p.id_ref = b.join_publisher;`);
const selectTodoForAcc = db.prepare(`SELECT t.*,${shallowBookSelector} FROM user_todo_book as t JOIN book b on b.id_ref = t.join_book JOIN author a on a.id_ref = b.join_author JOIN publisher p on p.id_ref = b.join_publisher WHERE join_acc = ?;`);
const selectReviewdForAcc = db.prepare("SELECT * FROM reviewed_book WHERE join_acc = ?;");
const selectReviewedId = db.prepare("SELECT id_ref FROM reviewed_book WHERE join_book = @bookId AND join_acc = @accId;");


//Book Stuff
//todo: joins to return authors and publishers and etc
export function checkUnique(isbn) {
  const rows = selectUniqueConstrainsStmt.all({row: -1,isbn});
  return rows.length > 0 ? false:true;
}
export function checkUserTodoUniue(accId, bookId) {
  const rows = selectUniqueUserTodo.all({accId,bookId});
  return rows.length > 0 ? false:true;
}
export function checkReviewedUnique(accId, bookId) {
  const rows = selectUniqueReviewed.all({accId,bookId});
  return rows.length > 0 ? false:true;
}
export function checkReadsInRange(reviewedBookId, startDate, finishDate) {
  const rows = selectReadsInRange({reviewedBookId, startDate, finishDate});
  return rows.length > 0 ? false:true;
}

export function createNewEssens(isbn, title, autorid, pubid) {
  return insertNewEssential.run({
    isbn,title,autorid,pubid
  });
}
//todo:
function createNewFull() {}

function getAllBooks() {
  return selectAllBooks.all();
}
export function getAllDispalayInfo() {
  return selectAllBooksShallowJoin.all();
}
export function getReviewedForAcc(acc_id) {
  return selectReviewdForAcc.all(acc_id);
}
export function getTodoForAcc(acc_id) {
  return selectTodoForAcc.all(acc_id);
}
export function getReviewedId(bookId, accId) {
  selectReviewedId.pluck();
  const id = selectReviewedId.get({bookId, accId});
  selectReviewedId.pluck(false);
  return id;
}

export function deleteTodo(todoId) {
  return removeTodo.run({todoId});
}

export function createNewTodo(account, book, start) {
  return insertNewTodo.run({account, book, start});
}
export function createNewReviewed(accId, bookId) {
  return insertNewReviewed.run({accId, bookId});
}
export function createNewRead(reviewedBookId, startDate, finishDate, thoughts, qn) {
  return insertNewRead.run({reviewedBookId, startDate, finishDate, thoughts, qn});
}
