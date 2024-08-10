import * as bookService from '../shared/services/books.service.js';

import express from 'express';
const router = express.Router();

/**Response Interface
 * 
interface ServerRes<T> {
  info: ResponseCodes,
  detail: T | ServerError
}
interface ServerError {
  summary: string,
  message: string,
  //more soon
}
 */

/* GET books listing. */
//return all books (pagination?)
router.get('/', (req, res) => {
  //req.params -> sorting titiel authhor, etc
  console.log('[GETALLBOOKS] req: ', req.query);
  //how can you tell this was the first function?
  try {
    res.json({info: 'success', detail: bookService.getAllBooks()});
  } catch(err) {
    console.error(`Error while getting Books `, err.message);
    res.json({info:'fail', detail:{summary:'no books', message:'fail in all books'}});
  }
});
router.post('/', (req, res) => {
  const success = bookService.createBookFromBody(req.body);
  if (success) {
    res.json({info:'success', detail: 'Book created'});
  } else {
    //info:fail,detail:already exists so not quite fail
    res.json({info:'fail', detail: {summary: 'Book not created', message: 'Nottin\' yet'}});
  }
});

router.get('/todo', (req, res) => {
  const todoBooks = bookService.getTodoForAcc(req.session.accId);
  res.json({info: 'success', detail: todoBooks});
});
router.post('/todo', (req, res) => {
  const success = bookService.createTodoFromBody(req.session.accId, req.body);
  if (success) {
    res.json({info:'success', detail: 'Todo created for: ' + req.session.loginname});
  }
  else {
    res.json({info:'fail', detail: {summary: 'Not created', message: 'There was an error creating this todo. Maybe exists already. Only on book in todo per user'}});
  }
});
router.put('/todo', (req, res) => {
  const success = bookService.setTodoPagesFromBody(req.body);
  if (success) {
    res.json({info:'success', detail: 'pages changed'});
  }
  else {
    res.json({info:'fail', detail: {summary:'Not Updated', message:'Pech gehabt'}});
  }
});

router.get('/reviewed', (req, res) => {
  const reviewedBooks = bookService.getReviewedForAcc(req.session.accId);
  res.json({info: 'success', detail: {loginname: req.session.loginname, reviewed_books: reviewedBooks}});
});

router.post('/read', (req, res) => {
  const success = bookService.addReadFromBody(req.session.accId, req.body);
  if (success) {
    res.json({info:'success', detail: 'Created Read I think'});
  }
  else {
    res.json({info:'fail', detail:{summary:'Not created', message:'complicated maybe transaction fail'}});
  }
});
// router.post('/read/review', (req, res) => {
//   const success = bookService.addReview()
// });

export default router;
