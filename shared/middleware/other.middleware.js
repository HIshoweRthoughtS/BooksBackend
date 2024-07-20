
import creationMsg from '../enums/user.enumeration.js'
 

function userCreationHandler(msg) {
    switch (msg) {
        case creationMsg.success:
            //send user id or full user object
            break;
        case creationMsg.duplicate:
            //send unproccessable with already exists msg
            break;
        case creationMsg.error:
            //send try again later
            break;
    }
}
