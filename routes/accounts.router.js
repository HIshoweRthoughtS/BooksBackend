//account
//model imports
import { SuccessResponse } from '../shared/models/ServerResponse.js';
import { GetError } from '../shared/models/ServerError.js';

//3rd Party
import express from 'express';
const router = express.Router({mergeParams: false});
//==================End of imports=====================================

router.get('/', (req, res) => {
    if (req.session && req.session.accId && req.session.loginname) {
        res.json(new SuccessResponse({a_id_ref: req.session.accId, loginname: req.session.loginname, }));
    }
    else {
        res.json(new GetError('No session cookie set'));
    }
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.json(new SuccessResponse('bye bye'));
    }
    else {
        res.json(new GetError('never logged in to begin with'));
    }
});


export default router;
