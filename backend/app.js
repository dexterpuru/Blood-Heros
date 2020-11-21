const express = require("express");
var cors = require("cors");
var bodyparser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const User = require("./model/User");
const flash = require("express-flash");
const cassandra = require("cassandra-driver");

require("dotenv").config();

const app = express();

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (username) => {
    return User.findOne({ username }).username === username;
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

//const client = new cassandra.Client({
//  contactPoints: ['h1', 'h2'],
//  localDataCenter: 'datacenter1',
//  keyspace: 'ks1'
//});

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
//app.use("/donor", require("./routes/donor"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started on http://localhost:${PORT}`));
