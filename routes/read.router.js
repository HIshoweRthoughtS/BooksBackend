//:userId/books/reads
//service imports
import * as bookService from '../shared/services/books.service.js';

//3rd party
import express from 'express';
const router = express.Router({mergeParams: true});
//============End of Imports===================

router.get('/', (req, res) => {
    const reviewedBooks = bookService.getReviewedForAcc(req.session.accId);
    res.json({info: 'success', detail: {loginname: req.session.loginname, reviewed_books: reviewedBooks}});
});

router.post('/', (req, res) => {
  const success = bookService.addReviewedChildFromBody(req.session.accId, req.body);
  if (success) {
    res.json({info:'success', detail: 'Created Read I think'});
  }
  else {
    res.json({info:'fail', detail:{summary:'Not created', message:'complicated maybe transaction fail'}});
  }
})

//END OF FILE
export default router;
