import * as bookService from '../shared/services/books.service.js';

import express from 'express';
const router = express.Router();

/* GET books listing. */
//return all books (pagination?)
router.get('/', function(req, res, next) {
  try {
    res.json(bookService.getAllBooks());
  } catch(err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

//get todos
//get reviewed
export default router;
