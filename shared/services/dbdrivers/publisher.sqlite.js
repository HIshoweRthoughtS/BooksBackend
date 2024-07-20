
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });
// db.pragma('journal_mode = WAL');

//Prepared Statements
const insertNewEssential = db.prepare("INSERT INTO publisher (title, country_of_origin, hq_location) VALUES (@name, 'N/A', 'N/A');");

const selectUniqueConstrainsStmt = db.prepare("SELECT * FROM publisher WHERE id_ref = @row OR title = @name;")
const selectPublisherStmt = db.prepare("SELECT * FROM publisher WHERE title = @name;")

export function checkUnique(name) {
    const rows = selectUniqueConstrainsStmt.all({row: -1,name:name});
    return rows.length > 0 ? false:true;
}
export function createNewEssens(name) {
  return insertNewEssential.run({
    name
  });
}
function getPublisher(name) {
    return selectPublisherStmt.get({name});
}
export function getPublisherId(name) {
    selectPublisherStmt.pluck();
    const rowId = getPublisher(name);
    selectPublisherStmt.pluck(false);
    return rowId ? rowId : -1;
}
