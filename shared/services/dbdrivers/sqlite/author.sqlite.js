
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });
// db.pragma('journal_mode = WAL');

//Prepared Statements
const insertNewEssential = db.prepare("INSERT INTO author (first_name,last_name) VALUES (@firstname, @lastname);");

const selectUniqueConstrainsStmt = db.prepare("SELECT * FROM author WHERE id_ref = @row OR (first_name = @firstname AND last_name = @lastname);")
const selectAuthorStmt = db.prepare("SELECT * FROM author WHERE  first_name = @firstname AND last_name = @lastname;")

//todo: first + last name is not really unique
export function checkUnique(firstname, lastname) {
    const rows = selectUniqueConstrainsStmt.all({row: -1,firstname,lastname});
    //if already exist -> ret false, else ret true
    return rows.length > 0 ? false:true;
}
export function createNewEssens(firstname, lastname) {
  return insertNewEssential.run({
    firstname, lastname
  });
}

function getAuthor(firstname, lastname) {
  return selectAuthorStmt.get({firstname,lastname});
}

export function getAuthorId(firstname, lastname) {
  selectAuthorStmt.pluck();
  const rowId = getAuthor(firstname,lastname);
  selectAuthorStmt.pluck(false);
  return rowId ? rowId : -1;
}
