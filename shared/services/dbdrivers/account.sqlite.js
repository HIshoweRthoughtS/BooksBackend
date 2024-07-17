
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });
// db.pragma('journal_mode = WAL'); //enough if just once in book.sqlite..

//Prepared Statements
const insertAccountStmt = db.prepare("INSERT INTO account (login_name, pw_digest, email) VALUES (@name, @pw, @mail);")

const selectUniqueConstrainsStmt = db.prepare("SELECT * FROM account_no_pw WHERE rowid = @row OR login_name = @name OR email = @mail;")

const selectAccountByNameStmt = db.prepare("SELECT rowid, *  FROM account WHERE login_name = ?;");
const selectAccountByIdStmt = db.prepare("SELECT *  FROM account_no_pw WHERE rowid = ?;");

const updateAccountLoginStmt = db.prepare("UPDATE account SET last_login = CURRENT_TIMESTAMP WHERE rowid = ?")
const updateAccountLogoutStmt = db.prepare("UPDATE account SET last_logout = CURRENT_TIMESTAMP WHERE rowid = ?")

const updateAccountEmailStmt = db.prepare("UPDATE account SET email = @mail WHERE rowid = @name")

//Pre..stmt wrapper
// i like it but no use now
function tryCreateNewAccount(login_name, digest, mail) {
    const retObj = [true,undefined];
    try {
        createNewAccount(login_name, digest, mail);
    } catch (e) {
        retObj[0] = false;
        retObj[1] = e;
        //retObj[1] = creationMsg.dub , etc
        console.log('[accsql] create fail. e: ', typeof e);
    }
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
export function checkUnique(login_name, email) {
    const rows = selectUniqueConstrainsStmt.all({row: -1,name:login_name,mail:email});
    return rows.length > 0 ? false:true;
}
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
    updateAccountEmailStmt.run({name: acc_id, mail: email});
}
