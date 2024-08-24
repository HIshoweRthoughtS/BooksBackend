//:userId/books/todos
//service imports
import * as bookService from '../shared/services/books.service.js';
//model imports
import { FailResponse, SuccessResponse } from '../shared/models/ServerResponse.js';
import { PatchError, PostError } from '../shared/models/ServerError.js';

//3rd party
import express from 'express';
import { Logger } from '../shared/services/logger.service.js';
const router = express.Router({mergeParams: true});
//============End of Imports===================

//todo: redirect '/latest' to latest/top todo. either by start date or rank field (depending on wether it is implemented)
//maybe /top/1, /top/2 etc for latest in order
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

router.get('/:todoId', (req, res) => {
    const read = bookService.getFullRead(req.params.userId, req.params.todoId);
    res.json(new SuccessResponse(read));
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

router.post('/:todoId', (req, res) => {
    let success = bookService.addQuotesFromBody(req.params.todoId, req.body);
    Logger.getLogger().add(success, 2, 'adddets')
    success = success && bookService.addReviewsFromBody(req.params.todoId, req.body);
    Logger.getLogger().add(success, 2, 'adddets')
    if (success) {
        res.json(new SuccessResponse(bookService.getFullRead(req.params.userId, req.params.todoId)));
    }
    else {
        res.json(new FailResponse(new PostError('Failed to create Quote or Review')));
    }
});

router.delete('/:todoId', (req, res) => {
    const success = bookService.setReadFinishDate(req.params.todoId, req.body);
    if (success) {
        const todoBooks = bookService.getTodoForAcc(req.params.userId);
        res.json(new SuccessResponse(todoBooks));
    }
    else {
        res.json(new PostError('Not moved'));
    }
});

router.get('/:todoId/quotes', (req, res) => {
    const quotes = bookService.getQuotesForRead(req.params.todoId);
    res.json(new SuccessResponse(quotes));
});

//END OF FILE
export default router;
