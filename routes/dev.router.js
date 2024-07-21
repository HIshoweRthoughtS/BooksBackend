import * as devdb from '../shared/dbdrivers/sqlite/devtools.sqlite.js';

//3rd Party
import express from 'express';
const router = express.Router();

router.get('deletedb', (res, req) => {
    devdb.deleteAll();
});

export default router;
