const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const booksRouter = require('./routes/books.router');
const accountsRouter = require('./routes/accounts.router');

app.get('/', (req, res) => {
  res.json({message: 'alive'});
});

app.use('/books', booksRouter);
app.use('/account', accountsRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
