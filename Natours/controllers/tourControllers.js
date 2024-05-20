const Tour = require('./../models/tourModel');
// const APIFeatures = require('./../utlis/apiFeatures');
const catchAsync = require('./../utlis/catchAsync');
const AppError = require('./../utlis/appError');
const factory = require('./../controllers/handleFactory');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // try {
//   // for creating a copy instead of referencing
//   //queries
//   // //building a query

//   // //1A)Filtering && building
//   // const queryObj = { ...req.query };
//   // const excludeFields = ['page', 'sort', 'limit', 'fields'];
//   // excludeFields.forEach(ele => delete queryObj[ele]);

//   // //to later on use excludedfields for quering we use query to first store query

//   // //1B) Advance Filtering
//   // let queryStr = JSON.stringify(queryObj);
//   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//   // let query = Tour.find(JSON.parse(queryStr));

//   // //2) Sorting
//   // if (req.query.sort) {
//   //   const sortBy = req.query.sort.split(',').join(' ');
//   //   query = query.sort(sortBy);
//   // } else {
//   //   query = query.sort('-createdAt');
//   // }

//   // //3)Limiting Fields

//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(',').join(' ');
//   //   query = query.select(fields);
//   // } else {
//   //   query = query.select('-__v');
//   // }

//   // // 4) pagination
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.page * 1 || 2;
//   // const skip = (page - 1) * limit;
//   // query = query.skip(skip).limit(limit);

//   // if (req.query.page) {
//   //   const numTours = await Tour.countDocuments();
//   //   if (skip >= numTours) throw new Error('This page does not exist');
//   // }

//   // Executing query
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   res.status(200).json({
//     status: 'success',
//     result: tours.length,
//     data: {
//       tours
//     }
//   });
//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: err
//   //   });
//   // }
// });

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// exports.getTour = catchAsync(async (req, res, next) => {
//   // try {

//   //Populating reviews
//   const tours = await Tour.findById(req.params.id).populate('reviews');

//   if (!tours) {
//     return next(new AppError('Tour not found', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tours
//     }
//   });
//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: 'Invalid Data Handling'
//   //   });
//   // }
// });
// moved function to catchAsync.js
// const catchAsync = fn => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// // };

exports.createTour = factory.createone(Tour);

// exports.createTour = catchAsync(async (req, res, next) => {
//   // try {
//   //   const newTour = await Tour.create(req.body);
//   //   res.status(201).json({
//   //     status: 'success',
//   //     data: {
//   //       tour: newTour
//   //     }
//   //   });
//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: err
//   //   });
//   // }

//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour
//     }
//   });
// });
exports.updateTour = factory.updateOne(Tour);
// exports.updateTour = catchAsync(async (req, res, next) => {
//   // try {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     //runValidators basically checks all the tour fields with their validators once we try to update it
//     runValidators: true
//   });
//   if (!tour) {
//     return next(new AppError('Tour not found', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour
//     }
//   });
//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: 'Invalid Data Handling'
//   //   });
// });

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   // try {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('Tour not found', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: 'Invalid Data Handling'
//   //   });
//   // }
// });
// Aggregation Pipeline
exports.getTourStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty',
        numTour: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: {
        avgPrice: 1
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'Invalid Data Handling'
  //   });
  // }
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'Invalid Data Handling'
  //   });
  // }
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlan, unit } = req.params;
  const [lat, lan] = latlan.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lan) {
    return next(new AppError('Please provide latiude and longitude ', 400));
  }

  // creating geospacial query to find documents from my location
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lan, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      data: tours
    }
  });
});
