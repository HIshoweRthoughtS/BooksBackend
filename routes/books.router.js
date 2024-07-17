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

router.get('/reviewed', (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  if (!req.session.accId || !req.session.loginName) {
    res.json({info: 'fail', detail: 'you are not logged in!'}); //.status(401)
  } else {
    const reviewedBooks = bookService.getReviewedForAcc(req.session.accId);
    res.json({info: 'success', detail: {login_name: req.session.login_name, reviewed_books: reviewedBooks}});
  }
});

//get todos
//get reviewed
export default router;
