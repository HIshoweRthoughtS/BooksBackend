import * as accService from '../shared/services/accounts.service.js'

//3rd Party
import express from 'express';
const router = express.Router();
//==================End of imports=====================================
router.get('/', (req, res) => {
    if (req.session && req.session.accId && req.session.loginName) {
        res.json({info: 'success', detail: {loginname: req.session.loginName}});
    }
    else {
        res.json({info:'fail', detail:{summary: 'Not Logged in', message:'No session cookie set'}});
    }
});
router.post('/', (req, res) => {
    //todo: validate req.body
    //create neccessary and in future extra info objects from input or return validation error
    accService.createAccount(
        {...req.body},
        (id) => res/*.status(200)*/.json({info: 'success', user_id: id}),
        (msg) => res/*.status(500)*/.json({info: 'fail', detail: msg})
    );
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.json({info: 'success', detail:'bye bye'});
    }
    else {
        res.json({info:'fail', detail: 'never logged in to begin with'});
    }
});


export default router;
