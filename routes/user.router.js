//:userId
//router imports [in order of useage]
import todoRouter from './todo.router.js';
import readRouter from './read.router.js';

//3rd party
import express from 'express';
const router = express.Router({mergeParams: true});
//============End of Imports===================
//this router (and all sub[/nested]-routers will handle ressources specific to a user)

router.use('/books/todos', todoRouter);
router.use('/books/reads', readRouter);
//possible extensions for films, shows and more

//END OF FILE
export default router;
