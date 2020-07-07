const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getLandingPage);
router.get('/about', authController.isLoggedIn, viewsController.getAbout);
router.get('/reviews', authController.isLoggedIn, viewsController.getReviews);
router.get('/tours', authController.isLoggedIn, viewsController.getTours);
router.get('/tours/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get(
  '/my-reviews',
  authController.protect,
  viewsController.getUserReviews
);
router.get(
  '/new-review/:id',
  authController.protect,
  viewsController.addReview
);
router.get(
  '/forgotten-password',
  authController.isLoggedIn,
  viewsController.forgottenPassword
);

router.get(
  '/reset-password/:token',
  authController.isLoggedIn,
  viewsController.resetPassword
);
router.get(
  '/my-tours',
  bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyTours
);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
