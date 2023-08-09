/** Express app for bookstore. */


const express = require("express");
const ExpressError = require("./expressError");
const bookRoutes = require("./routes/books");
const Ajv = require('ajv');
const bookSchema = require('./schema/bookSchema.json');

const app = express();
const ajv = new Ajv();

// This function is used in routes for validation
function validateBook(book) {
  const valid = ajv.validate(bookSchema, book);
  if (!valid) return ajv.errors;
  return null;
}

// Middleware to parse JSON
app.use(express.json());

// Use the book routes
app.use("/books", bookRoutes);

// 404 handler
app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

// General error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = {
  app,
  validateBook  
};
