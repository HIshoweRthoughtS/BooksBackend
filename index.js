import booksRouter from './routes/books.router.js';
import accountsRouter from './routes/accounts.router.js';
import devRouter from './routes/dev.router.js';
import noLoginRouter from './routes/no-login.router.js'

import { Logger } from './shared/services/logger.service.js';

import { loggerClosure } from './shared/middleware/logger.middleware.js';
import * as loginMW from './shared/middleware/login.middleware.js';

//3rd Party
import express from 'express';
const app = express();
import session from 'express-session';
app.use(session({
  secret: 'hundiwauwau',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

import cors from 'cors';
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:4200', 'http://localhost:53122']
};
app.use(cors(corsOptions));
//CORS: Allow cross site requests
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

//============End of Imports===================

const port = 3000 || process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(loggerClosure);


app.get('/', (req, res) => {
  res.json({message: 'alive'});
});

app.use('/login', noLoginRouter);

app.use('/books', loginMW.youShallNotPass, booksRouter);
app.use('/account', loginMW.youShallNotPass, accountsRouter);
app.use('/dev', loginMW.youShallNotPass, devRouter);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
