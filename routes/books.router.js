const express = require('express');
const bookService = require('../shared/services/books.service');
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

module.exports = router;
