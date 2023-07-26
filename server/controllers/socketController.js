const socketController = {};
const k8s = require("@kubernetes/client-node");

socketController.getMetricsMiddleware = async function (data) {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const metricsClient = new k8s.Metrics(kc);

    const namespace = data.namespace; // Assuming data.namespace is sent from the client
    const locals = {};
    locals.topNodes = [];
    locals.topPods = [];
    const currentTime = new Date();

    await k8s.topNodes(k8sApi, metricsClient, namespace).then((nodes) => {
      nodes.map((node) => {
        locals.topNodes.push({
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
        let cpuPercentage = (pod.CPU.CurrentUsage / pod.CPU.LimitTotal) * 100;
        if (
          cpuPercentage === Infinity ||
          typeof cpuPercentage === "undefined"
        ) {
          cpuPercentage = 0;
        }

        locals.topPods.push({
          pod: pod.Pod.metadata.name,
          cpuCurrentUsage: pod.CPU.CurrentUsage,
          memoryCurrentUsage: pod.Memory.CurrentUsage.toString(),
          timestamp: currentTime,
        });
      });
    });

    return {
      topNodes: locals.topNodes,
      topPods: locals.topPods,
    }; // Call next to proceed to the next middleware or the event handler
  } catch (error) {
    console.error("Error fetching logs:", error);
    // Emit an error event or handle it in the event handler if needed
    return {
      topNodes: [],
      topPods: [],
    };
  }
};

socketController.getStatsMiddleware = async () => {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    const namespaces = [];

    const totalPods = await k8sApi
      .listPodForAllNamespaces()
      .then((data) => data.body.items.length);

    const totalNodes = await k8sApi
      .listNode()
      .then((data) => data.body.items.length);

    await k8sApi.listNamespace().then((data) => {
      for (let i in data.body.items) {
        namespaces.push(data.body.items[i].metadata.name);
      }
    });

    return {
      namespaces,
      totalNodes,
      totalPods,
    };
  } catch (error) {
    console.error("Error fetching logs:", error);
    return {
      namespaces: [],
      totalNodes: 0,
      totalPods: 0,
    };
  }
};

socketController.getLogs = async (body) => {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    const namespace = body.namespace;
    const podName = body.podname;
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
    // console.log("new Array", newArray);
    return newArray;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
};

module.exports = socketController;
