const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
// define the home page route
router.get('/metrics', apiController.getMetrics, (req, res) => {
    req.io.emit("event", {
         namespace: res.locals.namespaces,
         topPods: res.locals.topPods,
         todNodes: res.locals.topNodes,
    });
    return res.status(200).json({
        namespace: res.locals.namespaces,
        topPods: res.locals.topPods,
        todNodes: res.locals.topNodes,
    });
});


router.get('/logs', apiController.getLogs, (req, res) => {
    return res.status(200).json({[res.locals.logsKey]: res.locals.logs});
});

module.exports = router;