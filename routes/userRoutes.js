const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post(
  '/signup',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  authController.signup
);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotten-password', authController.forgottenPassword);
router.get('/reset-password/:token', authController.redirectResetPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.post('/contact', authController.isLoggedIn, userController.contact);

// protect all routes after this middleware
router.use(authController.protect);

router.patch('/update-password', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/update-me',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/delete-me', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
