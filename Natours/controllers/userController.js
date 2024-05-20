const catchAsync = require('./../utlis/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utlis/appError');
const factory = require('./../controllers/handleFactory');

const filterObj = (Obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(Obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = Obj[el];
  });

  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(User);

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).json({
//     status: 'success',
//     result: users.length,
//     data: {
//       users
//     }
//   });
// });

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'Password cannot be changed through this route, use /updateMyPassword route.',
        400
      )
    );
  }

  //2) filter out unwanted field names that are not allowed to be updated.
  const filteredBody = filterObj(req.body, 'name', 'email');
  //3) update data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined. Please use /signup route for this '
  });
};

exports.getUser = factory.getOne(User);
// do not update password using this route
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
