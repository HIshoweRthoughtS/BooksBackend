//dev
import * as devdb from '../shared/dbdrivers/sqlite/devtools.sqlite.js';

//3rd Party
import express from 'express';
const router = express.Router({mergeParams: false});
//============End of Imports===================

router.get('/deletedb', (req, res) => {
    devdb.deleteAll();
    res.json({summary:'Done'});
});

export default router;
