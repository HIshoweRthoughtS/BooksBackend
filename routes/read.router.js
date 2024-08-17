//:userId/books/reads
//service imports
import * as bookService from '../shared/services/books.service.js';
//model imports
import { SuccessResponse } from '../shared/models/ServerResponse.js';
import { PostError } from '../shared/models/ServerError.js';

//3rd party
import express from 'express';
const router = express.Router({mergeParams: true});
//============End of Imports===================

router.get('/', (req, res) => {
    const reviewedBooks = bookService.getReviewedForAcc(req.session.accId);
    res.json(new SuccessResponse({reviewed_books: reviewedBooks}));
});

router.post('/', (req, res) => {
  const success = bookService.addReviewedChildFromBody(req.session.accId, req.body);
  if (success) {
    res.json(new SuccessResponse('Created Read'));
  }
  else {
    res.json(new PostError('complicated maybe transaction fail'));
  }
})

//END OF FILE
export default router;
