const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

// define the home page route
router.get("/metrics/:namespace", apiController.getMetrics, (req, res) => {
  return res.status(200).json({
    topPods: res.locals.topPods,
    topNodes: res.locals.topNodes,
  });
});

router.get("/stats", apiController.getStats, (req, res) => {
  return res.status(200).json({
    namespaces: res.locals.namespaces,
    totalNamespaces: res.locals.namespaces.length,
    totalPods: res.locals.totalPods,
    totalNodes: res.locals.totalNodes,
  });
});

router.get("/logs", apiController.getLogs, (req, res) => {
  return res.status(200).json({ [res.locals.logsKey]: res.locals.logs });
});

module.exports = router;
