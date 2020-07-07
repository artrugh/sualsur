const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');

// render engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1 MIDDLEWARES

// CORS-enabled for all origins
app.use(cors())
// non simple request(PATCH-DELETE)
app.options('*', cors());

// allow api in the front-end app
// app.use(
//   cors({
//     origin: ['http://frontend-domain.com'],
//     credentials: true,
//   })
// );

// serving static files (html)
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// set security HTTP headers
app.use(helmet());

// development loggin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try it again in an hour!',
});
app.use('/api', limiter);

// body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// data sanitazation against NoSQL query INJECTION
app.use(mongoSanitize());

// data sanitazation against XSS
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3 ROUTERS
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// should be the last route
app.all('*', (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
);

app.use(globalErrorHandler);

module.exports = app;
