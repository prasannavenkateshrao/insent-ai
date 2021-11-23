/**
 * Required External Modules
 */
const http = require('http');
const express = require("express");
const path = require("path");
/**
 * App Variables
 */

const app = express();
const cors = require('cors');
app.use(cors({
  origin: '*'
}));
const port = process.env.PORT || "8000";

const server = http.Server(app);

/**
 * Routes Definitions
 */
const index = require('./routes/router');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const winston = require('./util/log-util');
app.use(logger('combined', { stream: winston.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', index);
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = err != null ? err : {};

  // for rendering the error page accordingly
  res.status(err.status || 500);
  res.render('error');
});

  /**
 * Server Activation
 */

server.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });

  
