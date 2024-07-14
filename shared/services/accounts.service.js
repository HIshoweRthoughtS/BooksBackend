import * as dbAccount from './dbdrivers/account.sqlite.js'
import creationMsg from '../enums/user.enumeration.js'

//3rd Party
import bcrypt from 'bcryptjs';
const mySalt = 'bababubululualal'

//todo: maybe use per user salt and store in db

//async

export function createAccount(login_name, password, mail, handleSuccess/*(acc.id)*/, handleFail/*(creationMsg)*/ = console.log) {
    if (accountExists(login_name)) {
        handleFail(creationMsg.duplicate/** creationMsg.duplicate*/);
    }

    bcrypt.hash(password, mySalt, (err, hash) => {
        console.log('[create Account] Bcrypt err: ', err, ' hash: ', hash);
        if (err) {
            handleFail(creationMsg.error);
        }
        else {
            try {
                dbAccount.insertNewAccount(login_name, hash, mail);
            } catch (e) {
                handleFail(creationMsg.error);
            }
            handleSuccess(dbAccount.getAccountId(login_name));
        }
    });
}

function pwMatchAccContinue(login_name, password, authenticated, fail) {
    const digest = dbAccount.getAccount(login_name).pw_digest;
    bcrypt.compare(password, digest, (err, res) => {
    if(res) {
        authenticated(login_name);
    } else {
        fail(err);
    }
  });
}


//sync
// const hash = bcrypt.hashSync('my password', 'my salt');
//Store hash password to DB

function accountExists(login_name) {
    if (dbAccount.getAccountId(login_name) >=0) {
        return true;
    }
    return false;
}

function pwMatchAcc(login_name, password) {
    const digest = dbAccount.getAccount(login_name).pw_digest;
    return bcrypt.compareSync(password, digest); //true || false
}
