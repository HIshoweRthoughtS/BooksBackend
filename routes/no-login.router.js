import * as accService from '../shared/services/accounts.service.js'

//3rd Party
import express from 'express';
const router = express.Router();
//==================End of imports=====================================

router.post('/', (req, res) => {
    accService.loginAccount(req.body.loginname, req.body.password,
        (user_info) => {
            req.session.accId = user_info.a_id_ref;
            req.session.loginname = user_info.loginname;
            res.status(200).json({info: 'success', detail: user_info});
        },
        (error) => res.json({info: 'fail', detail: error}) 
    );
});
router.post('/new', (req, res) => {
    //todo: validate req.body
    //create neccessary and in future extra info objects from input or return validation error
    accService.createAccount(
        {...req.body},
        (id) => res/*.status(200)*/.json({info: 'success', user_id: id}),
        (msg) => res/*.status(500)*/.json({info: 'fail', detail: msg})
    );
});

export default router;
