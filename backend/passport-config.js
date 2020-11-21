const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./model/User");

module.exports = function initializePassport(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email }, async (err, user) => {
        if (err) return done(err);

        if (!user) return done(null, false, { message: "Email Incorrect" });

        if (!(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: "Password Incorrect" });
        }

        return done(null, user);
      });
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, User.findById(id));
  });
};

/*import { findEmail } from "../DB/tempDB";

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      findEmail(email).then((user) => {
        if (!user) {
          return done(null, false, { message: "Email not registered" });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
      //.catch(err=>console.log(err))
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    findEmail();
  });
};
*/
