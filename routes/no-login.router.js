//login
//service imports
import * as accService from '../shared/services/accounts.service.js'
//model imports
import { SuccessResponse, FailResponse } from '../shared/models/ServerResponse.js';
import { PostError } from '../shared/models/ServerError.js';

//3rd Party
import express from 'express';
const router = express.Router({mergeParams: false});
//==================End of imports=====================================

router.post('/', (req, res) => {
    accService.loginAccount(req.body.loginname, req.body.password,
        (user_info) => {
            req.session.accId = user_info.a_id_ref;
            req.session.loginname = user_info.loginname;
            res.status(201).json(new SuccessResponse(user_info));
        },
        (error) => res.json(new FailResponse(new PostError(error)))
    );
});
router.post('/new', (req, res) => {
    //todo: validate req.body
    //create neccessary and in future extra info objects from input or return validation error
    accService.createAccount(
        {...req.body},
        (id) => res/*.status(200)*/.json(new SuccessResponse({ user_id: id })),
        (msg) => res/*.status(500)*/.json(new FailResponse(new PostError(msg))),
    );
});

export default router;
