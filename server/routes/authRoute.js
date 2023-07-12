const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signin", userController.signin, (req, res) => {
  res.redirect("/");
  res.status(200).json(res.locals.users);
});

router.post("/signup", userController.signup, (req, res) => {
  res.status(200).json(res.locals.users);
});

module.exports = router;
