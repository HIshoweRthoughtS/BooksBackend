//Buchentsafter
//router imports [in order of useage]
import noLoginRouter from './routes/no-login.router.js';
import accountsRouter from './routes/accounts.router.js';
import devRouter from './routes/dev.router.js';

import generalRouter /*o7*/ from './routes/no-user.router.js'
import userRouter from './routes/user.router.js';

//middleware imports
import { initLogger } from './shared/middleware/logger.middleware.js';
import * as loginMW from './shared/middleware/login.middleware.js';

//model imports
import { SuccessResponse } from './shared/models/ServerResponse.js';

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

//set up and start logging service. Also register to res.finish event
app.use(initLogger);


app.get('/', (_, res) => {
  res.json(new SuccessResponse('alive'));
});

app.get('/ip', (req, res) => {
  res.json(new SuccessResponse({ip: req.ip}));
});

//set up and more misc in theese routers
//###############################
app.use('/login', noLoginRouter);
app.use('/account', loginMW.youShallNotPass, accountsRouter);

app.use('/dev', loginMW.youShallNotPass, devRouter);
//###############################

//business logic in this router
//###############################
app.use('/general', generalRouter /*o7*/);
app.use('/:userId', userRouter);
//###############################

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
