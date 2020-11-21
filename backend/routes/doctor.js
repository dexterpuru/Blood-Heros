const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../model/User");
const passport = require("passport");
const verify = require("../middleware/users");
const router = express.Router();

// Login Page
router.get(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
  }),
  (req, res) => {
    res.send({ message: "authentication successfull", user: req.user });
  }
);

// Register Page
router.get("/register", verify, (req, res) => {
  if (req.verifyCode !== 200) {
    res.send({ message: "Doctor info can't be verified" });
  } else {
    const { username, password, docId, name, hname, medcouncil } = req.body;

    User.findOne({ username }).then((user) => {
      if (user) {
        res.send({ message: "Username already exists" });
      } else {
        const newUser = new User({
          username,
          password,
          docId,
          name,
          hname,
          medcouncil,
        });

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
  }
});

module.exports = router;
