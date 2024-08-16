//:userId/books/todos
//service imports
import * as bookService from '../shared/services/books.service.js';

//3rd party
import express from 'express';
const router = express.Router({mergeParams: true});
//============End of Imports===================

router.get('/', (req, res) => {
    const todoBooks = bookService.getTodoForAcc(req.session.accId);
    res.json({info: 'success', detail: todoBooks});
});
router.post('/', (req, res) => {
    const success = bookService.addReviewedChildFromBody(req.session.accId, req.body);
    if (success) {
        res.json({info:'success', detail: 'Todo created for: ' + req.session.loginname});
    }
    else {
        res.json({info:'fail', detail: {summary: 'Not created', message: 'There was an error creating this todo. Maybe exists already. Only on book in todo per user'}});
    }
});
router.put('/', (req, res) => {
    const success = bookService.setTodoPagesFromBody(req.body);
    if (success) {
        res.json({info:'success', detail: 'pages changed'});
    }
    else {
        res.json({info:'fail', detail: {summary:'Not Updated', message:'Pech gehabt'}});
    }
});

//END OF FILE
export default router;
