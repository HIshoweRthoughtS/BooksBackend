//:userId/books/todos
//service imports
import * as bookService from '../shared/services/books.service.js';
//model imports
import { SuccessResponse } from '../shared/models/ServerResponse.js';
import { PatchError, PostError } from '../shared/models/ServerError.js';

//3rd party
import express from 'express';
const router = express.Router({mergeParams: true});
//============End of Imports===================

router.get('/', (req, res) => {
    const todoBooks = bookService.getTodoForAcc(req.params.userId);
    res.json(new SuccessResponse(todoBooks));
});
router.post('/', (req, res) => {
    const success = bookService.addReviewedChildFromBody(req.params.userId, req.body);
    if (success) {
        res.json(new SuccessResponse(`Todo created. Session name: ${req.session.loginname}`));
    }
    else {
        res.json(new PostError('There was an error creating this todo. Maybe exists already. Only on book in todo per '));
    }
});
router.patch('/:todoId', (req, res) => {
    const success = bookService.setTodoPagesFromBody(req.params.todoId, req.body);
    if (success) {
        res.json(new SuccessResponse('pages (and chapter) changed'));
    }
    else {
        res.json(new PatchError('Pech gehabt'));
    }
});

//END OF FILE
export default router;
