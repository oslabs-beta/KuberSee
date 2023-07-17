const apiController = {};
const k8s = require("@kubernetes/client-node");
const { cp } = require("fs");

// io.on('connection', (socket) => {
//   console.log('a user connected');

//   socket.on('latest', (event) => {
//     console.log('Latest event: ' + event);
//   });

//   socket.on('event', (event) => {
//     console.log('Received an event: ' + event);
//     io.emit('event', event);
//   });

//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

apiController.getMetrics = async (req, res, next) => {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  const metricsClient = new k8s.Metrics(kc);

  const { namespace = "default" } = req.body;

  res.locals.topNodes = [];
  res.locals.topPods = [];

  const currentTime = new Date();
  await k8s.topNodes(k8sApi, metricsClient, namespace).then((nodes) => {
    nodes.map((node) => {
      // console.log(node);
      res.locals.topNodes.push({
        node: node.Node.metadata.name,
        cpuCurrentUsage: node.CPU.RequestTotal.toString(),
        cpuTotal: node.CPU.Capacity.toString(),
        memoryCurrentUsage: node.Memory.RequestTotal.toString(),
        memoryTotal: node.Memory.Capacity.toString(),
        timestamp: currentTime,
      });
    });
  });

  await k8s.topPods(k8sApi, metricsClient, namespace).then((pods) => {
    pods.map((pod) => {
      // console.log(pod);

      let cpuPercentage = (pod.CPU.CurrentUsage / pod.CPU.LimitTotal) * 100;
      // console.log(pod.CPU.LimitTotal);
      if (cpuPercentage === Infinity || typeof cpuPercentage === "undefined") {
        cpuPercentage = 0;
      }
      // console.log(pod.Memory);

      res.locals.topPods.push({
        pod: pod.Pod.metadata.name,
        cpuCurrentUsage: pod.CPU.CurrentUsage,
        memoryCurrentUsage: pod.Memory.CurrentUsage.toString(),
        timestamp: currentTime,
      });
    });
  });

  return next();
};

apiController.getStats = async (req, res, next) => {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

  res.locals.namespaces = [];

  await k8sApi
    .listPodForAllNamespaces()
    .then((data) => (res.locals.totalPods = data.body.items.length));

  await k8sApi
    .listNode()
    .then((data) => (res.locals.totalNodes = data.body.items.length));

  await k8sApi.listNamespace().then((data) => {
    for (let i in data.body.items) {
      res.locals.namespaces.push(data.body.items[i].metadata.name);
    }
  });

  return next();
};

apiController.getLogs = async (req, res, next) => {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const namespace = "kube-system";
    const podName = "kube-controller-manager-minikube";
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
    res.locals.logsKey = `${namespace}=${podName}`;
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
    console.log("new Array", newArray);
    return next();
  } catch (error) {
    console.error("Error fetching logs:", error);
    return res.status(500).send("Error fetching logs");
  }
};

module.exports = apiController;
