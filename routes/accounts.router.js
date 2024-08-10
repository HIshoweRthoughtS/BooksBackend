import * as accService from '../shared/services/accounts.service.js'

//3rd Party
import express from 'express';
const router = express.Router();
//==================End of imports=====================================
router.get('/', (req, res) => {
    if (req.session && req.session.accId && req.session.loginname) {
        res.json({info: 'success', detail: {loginname: req.session.loginname}});
    }
    else {
        res.json({info:'fail', detail:{summary: 'Not Logged in', message:'No session cookie set'}});
    }
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
