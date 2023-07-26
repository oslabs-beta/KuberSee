const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

router.get("/logs/:namespace/:podname", apiController.getLogs, (req, res) => {
  return res.status(200).json(res.locals.logs);
});

module.exports = router;
