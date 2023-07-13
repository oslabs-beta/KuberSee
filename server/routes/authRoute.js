const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const sessionController = require("../controllers/sessionController");
const { error } = require("console");

router.post(
  "/signin",
  userController.signin,
  // sessionController.createSession,
  (req, res) => {
    // res.redirect("/");
    res.status(200).json(res.locals.users);
  }
);

router.post("/signup", userController.signup, (req, res) => {
  res.status(200).json(res.locals.users);
});

module.exports = router;
