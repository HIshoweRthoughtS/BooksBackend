
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });
// db.pragma('journal_mode = WAL'); //enough if just once in book.sqlite..

/**
 * NOT NULL:    loginname, pw_digest
 * UNIQUE:      loginname, email
 */

//Prepared Statements
const insertNewEssential = db.prepare("INSERT INTO account (loginname, pw_digest) VALUES (@loginname, @pw);");
const insertAccountStmt = db.prepare("INSERT INTO account (loginname, pw_digest, email) VALUES (@name, @pw, @mail);")

const updateAccountLoginStmt = db.prepare("UPDATE account SET last_login = CURRENT_TIMESTAMP WHERE id_ref = ?")
const updateAccountLogoutStmt = db.prepare("UPDATE account SET last_logout = CURRENT_TIMESTAMP WHERE id_ref = ?")

const updateAccountEmailStmt = db.prepare("UPDATE account SET email = @mail WHERE id_ref = @id")

//todo: fix back
const selectUniqueConstrainsStmt = db.prepare("SELECT * FROM account_no_pw WHERE id_ref = @row OR loginname = @loginname;")

const selectAccountByNameStmt = db.prepare("SELECT * FROM account WHERE loginname = ?;");
const selectAccountByIdStmt = db.prepare("SELECT * FROM account_no_pw WHERE id_ref = ?;");

//Pre..stmt wrapper
// i like it but no use now
export function checkUnique(loginname) {
    const rows = selectUniqueConstrainsStmt.all({row: -1,loginname});
    return rows.length > 0 ? false:true;
}
export function createNewEssens(loginname,pw) {
  return insertNewEssential.run({
    loginname, pw
  });
}
//throwerror
export function createNewAccount(loginname, digest, mail) {
    return insertAccountStmt.run({
        name: loginname,
        pw: digest,
        mail: mail
    });
}
//todo: should be more dynamic. i can ask for all unique fields, and when given
//an account object function returns all constrain errors
export function getAccountId(loginname) {
    selectAccountByNameStmt.pluck();
    const row = getAccount(loginname);
    selectAccountByNameStmt.pluck(false);
    return row ? row : -1;
}
export function getAccount(loginname) {
    return selectAccountByNameStmt.get(loginname);
}
export function getAccountById(acc_id) {
    return selectAccountByIdStmt.get(acc_id);
}
//throwerror
export function changeLogin(acc_id) {
    console.log(updateAccountLoginStmt.run(acc_id));
}
//throwerror
export function changeLogout(acc_id) {
    updateAccountLogoutStmt.run(acc_id);
}
//throwerror
export function changeEmail(acc_id, email) {
    updateAccountEmailStmt.run({id: acc_id, mail: email});
}
