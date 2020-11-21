const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../model/User");
const passport = require("passport");

const router = express.Router();

// Login Page
router.get(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.send({ message: "authentication successfull", user: req.user });
  }
);

// Register Page
router.get("/register", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      res.send({ message: "Email already exists" });
    } else {
      const newUser = new User({ email, password });

      // Hashing Pass
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              res.send({ message: "New User Created", data: user });
            })
            .catch((err) => console.log(err));
        })
      );
    }
  });
});

module.exports = router;
