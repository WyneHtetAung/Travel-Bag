var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// mongoose connect

mongoose.connect(
  "mongodb+srv://travelbag:travel123bag@travelbag.0x71uaf.mongodb.net/?retryWrites=true&w=majority"
);
var db = mongoose.connection;
db.on("error", console.error.bind("MongoDB connection error at travelbag"));

// mongoose.connect("mongodb://127.0.0.1/travelbag");
// var db = mongoose.connection;
// db.on("error", console.error.bind("MongoDB connection error at travelbag"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// session
app.use(
  session({
    secret: "Travel@1992022",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.agent = req.session.agent;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

app.use(function (req, res, next) {
  res.redirect("/page_not_found");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
