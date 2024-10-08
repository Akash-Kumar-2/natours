const Tour = require('../models/tourModel');
const AppError = require('../utlis/appError');
const catchAsync = require('../utlis/catchAsync');
// const AppError = require('../utlis/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get tour data from collection
  const tours = await Tour.find();
  // 2) build template
  // 3)render that template using tour data from 1)
  //instead of json we do render
  res.status(200).render('overview', {
    title: 'ALL Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) get tour data from collection
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'user review rating'
  });
  if (!tour) {
    return next(new AppError('Tour does not exist', 404));
  }
  // 2) build template
  // 3)render that template using tour data from 1)
  //instead of json we do render
  //instead of json we do render
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};
