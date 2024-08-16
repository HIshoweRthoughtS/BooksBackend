//general
//router imports [in order of useage]
//middleware imports
//service imports
import * as bookService from '../shared/services/books.service.js';
//model imports
import { SuccessResponse, FailResponse } from '../shared/models/ServerResponse.js';
import { GetError, PostError, PatchError } from '../shared/models/ServerError.js';

//3rd party
import express from 'express';
const router = express.Router({mergeParams: false});
//============End of Imports===================
//this router (and all sub[/nested]-routers will handle ressources not specific to one user
//all ressources handled here will be available for any and all authenticated users

//return all books (pagination?)
//todo:books.router is no free to be used
router.get('/books', (_, res) => {
    //req.params -> sorting titiel authhor, etc
    
    //how can you tell this was the first function?
    try {
        res.json(new SuccessResponse(bookService.getAllBooks()));
    } catch(err) {
        res.json(new FailResponse(new GetError('Could not get Books')));
    }
});

router.post('/books', (req, res) => {
    const success = bookService.createBookFromBody(req.body);
    if (success) {
        res.status(201).json(new SuccessResponse('Book created'));//{info:'success', detail: 'Book created'});
    } else {
        //info:fail,detail:already exists so not quite fail
        res.json(new FailResponse(new PostError('Not created','Nottin\' yet')));
    }
});

router.patch('/books/:id', (req, res) => {
    const bookId = req.params[id];
    const success = bookService.setBookLastPage(bookId, req.body.last_page);
    if (success) {
        res.json(new SuccessResponse('patched'))
    }
    else {
        res.json(new FailResponse(new PatchError('Not Patched')))
    }
});

//END OF FILE
export default router;
