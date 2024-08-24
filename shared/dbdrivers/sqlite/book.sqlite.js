
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
const insertNewEssential = db.prepare("INSERT INTO book (isbn,join_author,join_publisher,title) VALUES (@isbn,@autorid,@pubid,@title);");
const insertNewReviewed = db.prepare("INSERT INTO reviewed_book (join_book,join_acc,first_impression) VALUES (@bookId, @accId, 'nice');");
const insertNewTodo = db.prepare("INSERT INTO book_read (join_reviewed_book,started_read_date) VALUES (@reviewedBookId,@startDate);");
const insertNewRead = db.prepare("INSERT INTO book_read (join_reviewed_book,started_read_date,current_page,finished_read_date,thoughts,quicknote) VALUES (@reviewedBookId,@startDate,-1,@finishDate,@thoughts,@qn);");
const insertNewReview = db.prepare("INSERT INTO review (join_read,join_book,is_public,rating,title,essay,tldr) VALUES (@readId,@bookId,@isPublic,@rating,@title,@essay,@tldr);");
const insertNewQuote = db.prepare("INSERT INTO quote (join_read,join_book,content,note,chapter,page_from,page_to,line_from,line_to) VALUES (@readId,@bookId,@content,@note,@chapter,@pageFrom,@pageTo,@lineFrom,@lineTo);");

const updateBookLastPage = db.prepare("UPDATE book SET pages = @lastPage WHERE b_id_ref = @bookId;");
const updateBookLastChapter = db.prepare("UPDATE book SET chapter = @lastChapter WHERE b_id_ref = @bookId;");
const updateTodoCurrentPage = db.prepare("UPDATE book_read SET current_page = @currentPage WHERE re_id_ref = @readId;");
const updateReadFinish = db.prepare("UPDATE book_read SET finished_read_date = @finishDate, current_page = NULL WHERE re_id_ref = @readId;");

const selectUniqueConstrainsStmt = db.prepare("SELECT * FROM book WHERE b_id_ref = @row OR isbn = @isbn;");
// const selectUniqueUserTodo = db.prepare("SELECT * FROM book_read br JOIN reviewed_book rv ON rv.rv_id_ref = br.join_reviewed_book WHERE rv.join_acc = @accId AND join_book = @bookId AND (br.finished_read_date IS NULL OR br.current_page > -1);");
const selectUniqueUserTodo = db.prepare("SELECT * FROM book_read WHERE join_reviewed_book = ? AND (finished_read_date IS NULL OR current_page > -1);");
const selectUniqueReviewed = db.prepare("SELECT * FROM reviewed_book WHERE join_acc = @accId AND join_book = @bookId");
//reads cannot overlap (start-finish, then new read. No start-start-finish-finish)
const selectReadsInRange = db.prepare("SELECT * FROM book_read WHERE join_reviewed_book = @reviewedBookId AND (started_read_date < @startDate AND finished_read_date > @startDate) OR (started_read_date < @finishDate AND finished_read_date > @finishDate);");

//todo: refactor in view
const selectAllBooks = db.prepare("SELECT * from ext_full_book;");
const selectBookById = db.prepare("SELECT * from ext_full_book WHERE b_b_id_ref = ?;");
const selectBookByIsbn = db.prepare("SELECT * from ext_full_book WHERE b_isbn = ?;");

const selectTodoByUser = db.prepare("SELECT * FROM todo_overview WHERE a_a_id_ref = ?;");
const selectReviewsByUser = db.prepare("SELECT * FROM ext_full_reviewed_book WHERE a_a_id_ref = ?;");
const selectReviewByUserAndBook = db.prepare("SELECT * FROM ext_full_reviewed_book WHERE a_a_id_ref = @accId AND b_b_id_ref = @bookId;");
const selectReadsByUserAndBook = db.prepare("SELECT * FROM ext_full_book_read WHERE a_a_id_ref = @accId AND b_b_id_ref = @bookId;");

const selectFullReadById = db.prepare('SELECT * FROM ext_full_book_read WHERE a_a_id_ref = @accId AND re_id_ref = @readId;');
const selectQuotesForRead = db.prepare('SELECT * FROM full_quote WHERE join_read = ?;');


//Book Stuff
//todo: joins to return authors and publishers and etc
//returns true, if a book with this isbn does NOT exist
export function checkUnique(isbn) {
  const rows = selectUniqueConstrainsStmt.all({row: -1,isbn});
  return rows.length > 0 ? false:true;
}
export function checkUserTodoUniue(revId) {
  const rows = selectUniqueUserTodo.all(revId);
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
export function getBookId(isbn) {
    selectBookByIsbn.pluck();
    const ret = selectBookByIsbn.get(isbn);
    selectBookByIsbn.pluck(false);
    return ret;
}
export function getAllDispalayInfo() {
  return selectAllBooks.all();
}
export function getReviewedId(bookId, accId) {
  selectReviewByUserAndBook.pluck();
  const id = selectReviewByUserAndBook.get({bookId, accId});
  selectReviewByUserAndBook.pluck(false);
  return id;
}
export function getReviewedForAcc(acc_id) {
  return selectReviewsByUser.all(acc_id);
}
export function getReaedId(reviewedBook, startDate) {
    selectFullReadById.pluck();
    const id = selectFullReadById.get({reviewedBook, startDate});
    selectFullReadById.pluck(false);
    return id;
}
export function getTodoForAcc(acc_id) {
  return selectTodoByUser.all(acc_id);
}
export function getThisReadPlz(accId, readId) {
    return selectFullReadById.get({accId, readId});
}
export function getQuotesForRead(readId) {
    return selectQuotesForRead.all(readId);
}

export function setBookLastPage(bookId, lastPage) {
  return updateBookLastPage.run({bookId, lastPage})
}
export function setBookLastChapter(bookId, lastChapter) {
    return updateBookLastChapter.run({bookId, lastChapter});
}

export function setTodoCurrentPage(readId, currentPage) {
  return updateTodoCurrentPage.run({readId, currentPage});
}

export function setReadFinishDate(readId, finishDate) {
    return updateReadFinish.run({finishDate, readId});
}

export function createNewTodo(reviewedBookId,startDate) {
  return insertNewTodo.run({reviewedBookId,startDate});
}
export function createNewReviewed(accId, bookId) {
  return insertNewReviewed.run({accId, bookId});
}
export function createNewRead(reviewedBookId, startDate, finishDate, thoughts, qn) {
  return insertNewRead.run({reviewedBookId, startDate, finishDate, thoughts, qn});
}
export function createNewReview(readId,bookId,isPublic,rating,title,essay,tldr) {
  return insertNewReview.run({readId,bookId,isPublic,rating,title,essay,tldr});
}
export function createNewQuote(readId,bookId,content,note,chapter,pageFrom,pageTo,lineFrom,lineTo) {
  return insertNewQuote.run({readId,bookId,content,note,chapter,pageFrom,pageTo,lineFrom,lineTo});
}
