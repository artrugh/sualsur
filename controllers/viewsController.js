const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getLandingPage = catchAsync(async (req, res, next) => {
  const featuresTours = new APIFeatures(Tour.find({}), {
    limit: '3',
    sort: '-ratingsAverage,price',
  })
    .sort()
    .paginate();
  const tours = await featuresTours.query;

  const featuresReviews = new APIFeatures(Review.find({}), {
    limit: '3',
    sort: '-rating',
  })
    .sort()
    .paginate();
  const reviews = await featuresReviews.query;

  res.status(200).render('home', {
    title: ' Exciting tours for adventurous people',
    home: true,
    tours,
    reviews,
  });
});

exports.getAbout = (req, res, next) => {
  res.status(200).render('about', {
    title: ' About',
    about: true,
  });
};

exports.getReviews = catchAsync(async (req, res, next) => {
  const featuresReviews = new APIFeatures(Review.find({}), {
    limit: '13',
  }).paginate();
  const reviews = await featuresReviews.query;

  res.status(200).render('reviews', {
    title: ' Reviews',
    reviews,
  });
});

exports.getUserReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: { _id: req.user.id } });
  res.status(200).render('reviews', {
    title: ' My Reviews',
    reviews,
  });
});

exports.getTours = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('tours', {
    title: ' All Tours',
    tours,
    card: true,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) return next(new AppError('There is no tour with that name.', 404));

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: ` ${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) =>
  res.status(200).render('login', {
    title: ' Login',
  });

exports.getSignupForm = (req, res) =>
  res.status(200).render('signup', {
    title: ' Signup',
  });

exports.getAccount = (req, res) =>
  res.status(200).render('account', {
    title: ' You',
  });

exports.forgottenPassword = (req, res) =>
  res.status(200).render('forgot', {
    title: ' Forgotten Password',
  });

exports.resetPassword = (req, res) =>
  res.status(200).render('reset-password', {
    title: ' Reset Password',
    token: req.params.token,
  });

exports.addReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const featuresTour = new APIFeatures(Tour.findById(id), {
    fields: 'name',
  }).limitFields();

  const tour = await featuresTour.query;

  if (!tour) return next(new AppError('There is no tour with that name.', 404));

  res.status(200).render('new-review', {
    title: ' Add Review',
    tour,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  // get all the bookings from the loggede user
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  // store only the tours
  const tourIDs = bookings.map((el) => el.tour);

  // store the whole tour model comparing it with the user ones
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('tours', {
    title: ' My Tours',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: ' You',
    user: updatedUser,
  });
});
