import * as dbAccount from '../dbdrivers/sqlite/account.sqlite.js'
import creationMsg from '../enums/user.enumeration.js'

//3rd Party
import bcrypt from 'bcryptjs';
const mySalt = 3;

//todo: maybe use per user salt and store in db

//async
/**
 * neccessaryInfo {
 *  loginname
 *  password
 * }
 * extraInfo {
 *  email
 * }
 */
export function createAccount(neccessaryInfo/*.loginname | .password*/, handleSuccess/*(acc.id)*/, handleFail/*(creationMsg)*/) {

    handleFail = handleFail ? handleFail : console.log;
    //todo:create account object -> check unique
    //every information if an account can be created should be in sqlite.js (or some acc class)
    //so you just create an object with all you know, then you ask dbdriver, if obj can be inserted
    //respons tells you if it is possible, or what field is not unique [password exluded]
    if (!dbAccount.checkUnique(neccessaryInfo.loginname)) {
        handleFail(creationMsg.duplicate_other);
    } else {
        bcrypt.hash(neccessaryInfo.password, mySalt, (err, hash) => {
            if (err) {
                handleFail('An error occured during password encryption. Aborted');
            }
            else {
                try {
                    const tmp = dbAccount.createNewEssens(neccessaryInfo.loginname, hash);
                    // handleSuccess(dbAccount.getAccountId(loginname));
                    handleSuccess(tmp.lastInsertRowid);
                } catch (e) {
                    console.log('[accserv] insert e: ', e);
                    //LAST LINE
                    handleFail(creationMsg.error);
                }
            }
        });
    }
    //end of function
    //NO MORE LINES
}
export function loginAccount(loginname, password, authenticated, fail) {
    fail = fail ? fail : console.log;

    let login = false;
    const account = dbAccount.getAccount(loginname);
    console.log('[AccS] login - acc: ', {...account, pw_digest: null});
    //todo: maybe create seperate select with only relevent detail ..(loginname, 'login'|Selects.login)
    if (account) {
        const digest = account.pw_digest;
        bcrypt.compare(password, digest, (err, res) => {
            if (err) {
                console.log('login - comper er: ', err);
                fail(err);
            } else {
                console.log('login - result: ', res);
                if(res) {
                    login = true;
                    dbAccount.changeLogin(account.a_id_ref);
                    console.log('login - Updated last in');
                    console.log('login - comper suc');
                    authenticated({...account, pw_digest: null});
                } else {
                    fail('name or password incorrect');
                }
            }
        });
    } else {
        //LAST LINE
        fail('name or password incorrect');
    }
    //end of function
    //NO MORE LINES
}


//sync
// const hash = bcrypt.hashSync('my password', 'my salt');
//Store hash password to DB
function pwMatchAcc(loginname, password) {
    const digest = dbAccount.getAccount(loginname).pw_digest;
    return bcrypt.compareSync(password, digest); //true || false
}
