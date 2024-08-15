
//3rd Party
import Database from 'better-sqlite3';
import { Logger } from '../../services/logger.service.js';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });

/**
 * NOT NULL:    first_name, last_name
 * UNIQUE:      first_name + last_name
 */

//Prepared Statements
const insertNewEssential = db.prepare("INSERT INTO author (first_name,last_name) VALUES (@firstname, @lastname);");

const selectUniqueConstrainsStmt = db.prepare("SELECT * FROM author WHERE au_id_ref = @row OR (first_name = @firstname AND last_name = @lastname);");
const selectAuthorStmt = db.prepare("SELECT * FROM author WHERE  first_name = @firstname AND last_name = @lastname;");

//todo: first + last name is not really unique
//checks all unique constraints
export function checkUnique(firstname, lastname) {
    const rows = selectUniqueConstrainsStmt.all({row: -1,firstname,lastname});
    Logger.getLogger().add(`CheckUnique: ${rows}`, 1, 'authorsql');
    //if already exist -> ret false, else ret true
    return rows.length > 0 ? false:true;
}
//creates new row with only not nullable columns (bare minimum)
export function createNewEssens(firstname, lastname) {
  return insertNewEssential.run({
    firstname, lastname
  });
}

function getAuthor(firstname, lastname) {
  const row = selectAuthorStmt.get({firstname,lastname});
  Logger.getLogger().add(`GetAuthor: ${row}`, 1, 'authorsql');
  return row;
}

//todo:[codeofconduct?] should id return -1 or undef for non existence?
//undefined is too ambiguous. there is no error, just no entry.
export function getAuthorId(firstname, lastname) {
  selectAuthorStmt.pluck();
  const rowId = getAuthor(firstname,lastname);
  selectAuthorStmt.pluck(false);
  Logger.getLogger().add(`GetAuthorId: ${rowId}`, 1, 'authorsql');
  return rowId ? rowId : -1;
}
