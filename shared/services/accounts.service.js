import * as dbAccount from './dbdrivers/account.sqlite.js'
import creationMsg from '../enums/user.enumeration.js'

//3rd Party
import bcrypt from 'bcryptjs';
const mySalt = 3;

//todo: maybe use per user salt and store in db

//async

export function createAccount(login_name, password, mail, handleSuccess/*(acc.id)*/, handleFail/*(creationMsg)*/) {

    handleFail = handleFail ? handleFail : console.log;
    //todo:create account object -> check unique
    //every information if an account can be created should be in sqlite.js (or some acc class)
    //so you just create an object with all you know, then you ask dbdriver, if obj can be inserted
    //respons tells you if it is possible, or what field is not unique [password exluded]
    if (!dbAccount.checkUnique(login_name, mail)) {
        handleFail(creationMsg.duplicate_other);
    } else {
        bcrypt.hash(password, mySalt, (err, hash) => {
            console.log('[create Account] Bcrypt err: ', err, ' hash: ', hash ? 'hash':'no hash');
            if (err) {
                handleFail('An error occured during password encryption. Aborted');
            }
            else {
                try {
                    const tmp = dbAccount.createNewAccount(login_name, hash, mail);
                    // handleSuccess(dbAccount.getAccountId(login_name));
                    handleSuccess(tmp.lastInsertRowid);
                } catch (e) {
                    console.log('[accserv] insert e: ', e);
                    handleFail(creationMsg.error);
                }
            }
        });
    }
    //end of function
    //NO MORE LINES
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
function pwMatchAcc(login_name, password) {
    const digest = dbAccount.getAccount(login_name).pw_digest;
    return bcrypt.compareSync(password, digest); //true || false
}
