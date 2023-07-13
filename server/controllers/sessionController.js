const express = require("express");
const sessionController = {};

sessionController.createSession = (req, res, next) => {
  session = req.session;
  session.userid = req.body.username;
  console.log(req.session);
  return next();
};

module.exports = sessionController;
