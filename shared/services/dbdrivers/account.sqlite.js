
//3rd Pary
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });
// db.pragma('journal_mode = WAL'); //enough if just once in book.sqlite..

//Prepared Statements
const insertAccountStmt = db.prepare("INSERT INTO account (login_name, pw_digest, email) VALUES (@name, @pw, @mail);")

const selectAccountStmt = db.prepare("SELECT rowid, *  FROM account WHERE login_name = ?;");
const selectUniqueConstrainsStmt = db.prepare("SELECT rowid,* FROM account WHERE rowid = @row OR login_name = @name OR email = @mail;")

const updateAccountLoginStmt = db.prepare("UPDATE account SET last_login = CURRENT_TIMESTAMP WHERE login_name = ?")
const updateAccountLogoutStmt = db.prepare("UPDATE account SET last_logout = CURRENT_TIMESTAMP WHERE login_name = ?")

const updateAccountEmailStmt = db.prepare("UPDATE account SET email = @mail WHERE login_name = @name")

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
    selectAccountStmt.pluck();
    const row = getAccount(login_name);
    selectAccountStmt.pluck(false);
    return row ? row : -1;
}
export function getAccount(login_name) {
    return selectAccountStmt.get(login_name);
}
//throwerror
export function changeLogin(login_name) {
    updateAccountLoginStmt.run(login_name);
}
//throwerror
export function changeLogout(login_name) {
    updateAccountLogoutStmt.run(login_name);
}
//throwerror
export function changeEmail(login_name, email) {
    updateAccountEmailStmt.run({name: login_name, mail: email});
}
