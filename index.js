import booksRouter from './routes/books.router.js';
import accountsRouter from './routes/accounts.router.js';

import express from 'express';
const app = express();



const port = 3000 || process.env.PORT;


app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.json({message: 'alive'});
});

app.use('/books', booksRouter);
app.use('/account', accountsRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
