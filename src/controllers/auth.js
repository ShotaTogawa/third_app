const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
// const bcrypt = require("bcryptjs");

// const hashedPassword = password => {
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) throw new Error(err);
//     bcrypt.hash(password, salt, (err, hash) => {
//       if (err) throw new Error(err);
//       return hash;
//     });
//   });
// };

exports.signup = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password
  });

  console.log(user);
  const token = jwt.sign({ _id: user.id }, process.env.JWT_TOKEN, {
    expiresIn: "1h"
  });
  console.log(token);
  res.status(201).send({ user, token });

  //.then(user => {
  //   console.log(user);
  //   bcrypt.genSalt(10, (err, salt) => {
  //     if (err) throw new Error(err);
  //     bcrypt
  //       .hash(user.password, salt, (err, hash) => {
  //         if (err) throw new Error(err);
  //         user.password = hash;
  //         user
  //           .save()
  //           .then(user => res.send(user))
  //           .catch(err => console.log(err));
  //       })
  //       .catch(e => {
  //         console.log(e);
  //       });
  //   });
  // });
};

// exports.signin = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ where: { email, password } });
//   try {
//     if (!user) {
//       return res.status(400).send("Failed login");
//     }
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       res.status(400).send("Failed login");
//     }
//     const token = jwt.sign({ _id: user.id }, process.env.JWT_TOKEN, {
//       expiresIn: "1h"
//     });
//     return { user, token };
//   } catch (e) {
//     res.send(e);
//   }
// };

// exports.requireSignin = expressJwt({
//   secret: process.env.JWT_TOKEN,
//   userProperty: "auth"
// });
