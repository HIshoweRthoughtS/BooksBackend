import booksRouter from './routes/books.router.js';
import accountsRouter from './routes/accounts.router.js';

//3rd Party
import express from 'express';
const app = express();

import cors from 'cors';
const corsOptions = {
  credentials: false,
  origin: ['http://localhost:3000', 'http://localhost:4200']
};
app.use(cors(corsOptions));

//CORS: Allow cross site requests
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


const port = 3000 || process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Logger
function logger(req, res, next) {
  console.log('[Logger] Request Received: ', req.body);
}
// app.use(logger);
//logger=================================


app.get('/', (req, res) => {
  res.json({message: 'alive'});
});

app.use('/books', booksRouter);
app.use('/account', accountsRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
