/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//uncaught error handling should be done before execution of our code
process.on('uncaughtException', err => {
  console.log('Uncaught exception Shutting Down..');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });

// use app file after env is config
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Database connected'));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

//unhandled Promise Rejection
process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection Shutting Down..');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Set up server to listen on port 3000
