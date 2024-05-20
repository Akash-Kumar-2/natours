const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utlis/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();
////////////////////////////////////////////////  Middleware  ///////////////////////////////////////////////////////////////////////////////

//set security HTTp headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Api request limiter
const limiter = rateLimit({
  //for max request set according to requirements
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many Requests, try after an hour'
});

app.use('/api', limiter);

//body parser reading data from body into req,body
app.use(express.json({ limit: '10kb' }));
//Data sanitization

//1)against NoSQL query injections
app.use(mongoSanitize());

//2)against XSS
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    //for which hpp is not required
    whitelist: [
      'ratingsQuantity',
      'ratingsAverage',
      'duration',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//serving static files
app.use(express.static(`${__dirname}/public`));
//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers)
  next();
});

//3) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
//error handler
//always put it after all working urls

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // });

  //creating a new error
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // // passing error in next basically skips all the middleware in between and moves directly to our global error handler middleware
  // next(err);

  //using class based logic
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//global error handler middleware
app.use(globalErrorHandler);
module.exports = app;
