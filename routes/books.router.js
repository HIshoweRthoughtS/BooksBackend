const express = require('express');
const router = express.Router();

/* GET books listing. */
//return all books
router.get('/', function(req, res, next) {
  try {
    res.json(quotes.getMultiple(req.query.page));
  } catch(err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

//get todos
//get reviewed

module.exports = router;
