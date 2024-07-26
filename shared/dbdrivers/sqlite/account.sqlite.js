
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });
// db.pragma('journal_mode = WAL'); //enough if just once in book.sqlite..

/**
 * NOT NULL:    login_name, pw_digest
 * UNIQUE:      login_name, email
 */

//Prepared Statements
const insertNewEssential = db.prepare("INSERT INTO account (loginname, pw_digest) VALUES (@loginname, @pw);");
const insertAccountStmt = db.prepare("INSERT INTO account (loginname, pw_digest, email) VALUES (@name, @pw, @mail);")

const updateAccountLoginStmt = db.prepare("UPDATE account SET last_login = CURRENT_TIMESTAMP WHERE id_ref = ?")
const updateAccountLogoutStmt = db.prepare("UPDATE account SET last_logout = CURRENT_TIMESTAMP WHERE id_ref = ?")

const updateAccountEmailStmt = db.prepare("UPDATE account SET email = @mail WHERE id_ref = @id")

const selectUniqueConstrainsStmt = db.prepare("SELECT * FROM account_no_pw WHERE id_ref = @row OR loginname = @loginname OR email = @email;")

const selectAccountByNameStmt = db.prepare("SELECT * FROM account WHERE loginname = ?;");
const selectAccountByIdStmt = db.prepare("SELECT * FROM account_no_pw WHERE id_ref = ?;");

//Pre..stmt wrapper
// i like it but no use now
export function checkUnique(loginname, email) {
    const rows = selectUniqueConstrainsStmt.all({row: -1,loginname, email});
    return rows.length > 0 ? false:true;
}
export function createNewEssens(loginname,pw) {
  return insertNewEssential.run({
    loginname, pw
  });
}
//throwerror
export function createNewAccount(login_name, digest, mail) {
    return insertAccountStmt.run({
        name: login_name,
        pw: digest,
        mail: mail
    });
}
//todo: should be more dynamic. i can ask for all unique fields, and when given
//an account object function returns all constrain errors
export function getAccountId(login_name) {
    selectAccountByNameStmt.pluck();
    const row = getAccount(login_name);
    selectAccountByNameStmt.pluck(false);
    return row ? row : -1;
}
export function getAccount(login_name) {
    return selectAccountByNameStmt.get(login_name);
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
