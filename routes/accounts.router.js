import * as accService from '../shared/services/accounts.service.js'

//3rd Party
import express from 'express';
const router = express.Router();
//==================End of imports=====================================

router.post('/', (req, res) => {
    accService.createAccount(
        req.body.name, req.body.password, req.body.email,
        (id) => res/*.status(200)*/.json({info: 'success', user_id: id}).send(),
        (msg) => res/*.status(500)*/.json({info: 'fail', detail: msg})
    )
});


export default router;
