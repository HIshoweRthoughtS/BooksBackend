import * as bookService from '../shared/services/books.service.js';

import express from 'express';
const router = express.Router();

/* GET books listing. */
//return all books (pagination?)
router.get('/', function(req, res, next) {
  try {
    res.json(bookService.getAllBooks());
  } catch(err) {
    console.error(`Error while getting Books `, err.message);
    next(err);
  }
});
router.post('/', (req, res) => {
  const success = bookService.createBookFromBody(req.body);
  if (success) {
    res.json({info:'success', detail: 'Book created'});
  } else {
    res.json({info:'fail', detail: 'Book not created'});
  }
});

router.get('/reviewed', (req, res) => {
  const reviewedBooks = bookService.getReviewedForAcc(req.session.accId);
  res.json({info: 'success', detail: {login_name: req.session.login_name, reviewed_books: reviewedBooks}});
});

router.get('/todo', (req, res) => {
  const todoBooks = bookService.getTodoForAcc(req.session.accId);
  res.json({info: 'success', detail: {login_name: req.session.login_name, todo_books: todoBooks}});
});

export default router;
