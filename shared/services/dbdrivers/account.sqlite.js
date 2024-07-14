
//3rd Pary
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });
db.pragma('journal_mode = WAL');

//Prepared Statements
const insertAccountStmt = db.prepare("INSERT INTO account (login_name, pw_digest, email) VALUES (@name, @pw, @mail);")

const selectAccountStmt = db.prepare("SELECT rowid, *  FROM account WHERE login_name = '?';");

const updateAccountLoginStmt = db.prepare("UPDATE account SET last_login = CURRENT_TIMESTAMP WHERE login_name = '?'")
const updateAccountLogoutStmt = db.prepare("UPDATE account SET last_logout = CURRENT_TIMESTAMP WHERE login_name = '?'")

const updateAccountEmailStmt = db.prepare("UPDATE account SET email = @mail WHERE login_name = '@name'")

//Pre..stmt wrapper

export function insertNewAccount(login_name, digest, mail) {
    insertAccountStmt.run({
        name: login_name,
        pw: digest,
        mail: mail
    });
}
export function getAccountId(login_name) {
  return selectAccountStmt.get(login_name).pluck();
  //todo:[check] see in console if difference in executed db statements
  return getAccount(login_name).pluck(/*true*/);
}
export function getAccount(login_name) {
  return selectAccountStmt.get(login_name);
}
export function changeLogin(login_name) {
    updateAccountLoginStmt.run(login_name);
}
export function changeLogout(login_name) {
    updateAccountLogoutStmt.run(login_name);
}
export function changeEmail(login_name, email) {
    updateAccountEmailStmt.run({name: login_name, mail: email});
}
