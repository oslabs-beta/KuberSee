const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

// define the home page route
router.get("/metrics", apiController.getMetrics, (req, res) => {
  // req.io.emit("event", {
  //      namespace: res.locals.namespaces,
  //      topPods: res.locals.topPods,
  //      todNodes: res.locals.topNodes,
  // });
  return res.status(200).json({
    topPods: res.locals.topPods,
    topNodes: res.locals.topNodes,
  });
});

router.get("/metrics/stats", apiController.getStats, (req, res) => {
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
