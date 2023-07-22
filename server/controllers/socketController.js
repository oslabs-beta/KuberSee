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
      error: true,
    };
  }
};

socketController.getStatsMiddleware = async () => {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    const locals = {};
    locals.namespaces = [];

    const totalPods = await k8sApi
      .listPodForAllNamespaces()
      .then((data) => data.body.items.length);

    const totalNodes = await k8sApi
      .listNode()
      .then((data) => data.body.items.length);

    await k8sApi.listNamespace().then((data) => {
      for (let i in data.body.items) {
        locals.namespaces.push(data.body.items[i].metadata.name);
      }
    });

    return {
      namespaces: locals.namespaces,
      totalNodes,
      totalPods,
    };
  } catch (error) {
    console.error("Error fetching logs:", error);
  }
};

module.exports = socketController;
