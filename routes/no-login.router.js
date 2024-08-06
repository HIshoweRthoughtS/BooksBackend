import * as accService from '../shared/services/accounts.service.js'

//3rd Party
import express from 'express';
const router = express.Router();
//==================End of imports=====================================

router.post('/', (req, res) => {
    accService.loginAccount(req.body.loginname, req.body.password,
        (user_info) => {
            req.session.accId = user_info.id_ref;
            req.session.loginName = user_info.loginname;
            console.log(req.session);
            console.log(req.session.id);
            res.status(200).json({info: 'success', detail: user_info});
        },
        (error) => res.json({info: 'fail', detail: error}) 
    );
});

export default router;
