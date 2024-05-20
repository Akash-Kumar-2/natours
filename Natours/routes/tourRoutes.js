const express = require('express');

const tourController = require('./../controllers/tourControllers');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

//for nested routing instead of earlier method use router directly
router.use('/:tourId/reviews', reviewRouter);
// param middleware

// router.param('id', tourController.checkID);
router
  .route('/top-5-cheaps')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'user'),
    tourController.getMonthlyPlan
  );

router
  .route('/tour-within/:distance/center/:latlan/unit/:unit')
  .get(tourController.getToursWithin);

router
  .route('/')
  //adding protection route
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
//   .post(tourController.checkBody, tourController.createTour);
// above we have done chaining of 2 middleware

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

//nesting routes
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

module.exports = router;
