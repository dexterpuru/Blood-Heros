const express = require("express");
var cors = require("cors");
var bodyparser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const User = require("./model/User");
const flash = require("express-flash");

require("dotenv").config();

const app = express();

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => {
    return User.findOne({ email }).email === email;
  },
  (id) => {
    return User.findById(id).id === id;
  }
);

mongoose
  .connect(process.env.MongoDB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Build-in Middlewares
app.use(cors());
app.use(bodyparser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Routes
app.use("/", require("./routes/index"));
app.use("/doctor", require("./routes/doctor"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started on http://localhost:${PORT}`));
