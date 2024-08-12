
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });

/**
 * NOT NULL:    title,  country_of_origin, hq_location
 * UNIQUE:      title
 */

//Prepared Statements
const insertNewEssential = db.prepare("INSERT INTO publisher (title, country_of_origin, hq_location) VALUES (@name, 'N/A', 'N/A');");

const selectUniqueConstrainsStmt = db.prepare("SELECT * FROM publisher WHERE pub_id_ref = @row OR title = @name;");
const selectPublisherStmt = db.prepare("SELECT * FROM publisher WHERE title = @name;");

//checks all unique constraints
export function checkUnique(name) {
    const rows = selectUniqueConstrainsStmt.all({row: -1,name:name});
    console.log('[pubsql] checkUniq - rows: ', rows);
    return rows.length > 0 ? false:true;
}
//creates new row with only not nullable columns (bare minimum)
export function createNewEssens(name) {
  return insertNewEssential.run({
    name
  });
}
function getPublisher(name) {
  const row = selectPublisherStmt.get({name});
  console.log('[pubsql] getauthor - row: ', row);
  return row;
}
export function getPublisherId(name) {
    selectPublisherStmt.pluck();
    const rowId = getPublisher(name);
    selectPublisherStmt.pluck(false);
  console.log('[pubsql] getid - id: ', rowId);
    return rowId ? rowId : -1;
}
