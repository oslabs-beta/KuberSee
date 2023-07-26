const apiController = {};
const k8s = require("@kubernetes/client-node");
const { cp } = require("fs");

//configure kubernetes api
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

apiController.getLogs = async (req, res, next) => {
  try {
    const namespace = req.params.namespace;
    const podName = req.params.podname;
    const containerName = "";
    const tailLines = 100; // Number of lines to fetch

    const logsResponse = await k8sApi.readNamespacedPodLog(
      podName,
      namespace,
      containerName,
      undefined,
      undefined,
      undefined,
      tailLines
    );
    const data = logsResponse.body;
    const logs = data.split("\n");
    //write logic to parse res.locals.log
    const newArray = [];
    logs.forEach((el, i) => {
      const splitLog = el.split(/\]/);
      if (splitLog[1] && splitLog[1].length) {
        splitLog[1] = splitLog[1].trim();
      }
      const log = {
        id: i,
        header: splitLog[0],
        message: splitLog[1],
      };
      newArray.push(log);
    });
    res.locals.logs = newArray;
    // console.log("new Array", newArray);
    return next();
  } catch (error) {
    console.error("Error fetching logs:", error);
    return res.status(500).send("Error fetching logs");
  }
};

module.exports = apiController;
