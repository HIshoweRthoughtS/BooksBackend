import * as accService from '../shared/services/accounts.service.js'

//3rd Party
import express from 'express';
const router = express.Router();
//==================End of imports=====================================

router.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

router.options('/', (_, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});

router.post('/', (req, res) => {
    console.log('[account post] req.params: ', req.params);
    accService.createAccount(
        req.params.body.name, req.params.body.password, req.params.body.email,
        (id) => res.json({info: 'success', user_id: id}),
        (msg) => res.json({info: 'fail', detail: msg})
    )
});


export default router;
