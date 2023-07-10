const apiController = {};
const k8s = require('@kubernetes/client-node');


apiController.getMetrics = async (req, res, next)=> {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const metricsClient = new k8s.Metrics(kc);
    const namespace = "default";
    
    res.locals.topNodes = [];
    res.locals.topPods = [];
    res.locals.namespaces = [];
    const currentTime = Date.now();
    await k8s.topNodes(k8sApi, metricsClient, namespace)
        .then((nodes) => {
            nodes.map((node) => {
                console.log(node);
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
    
    await k8s.topPods(k8sApi, metricsClient, namespace)
        .then((pods) => {
            pods.map((pod) => {
                console.log(pod);
                res.locals.topPods.push({
                    pod: pod.Pod.metadata.name,
                    cpuCurrentUsage: pod.CPU.CurrentUsage.toString(),
                    memoryCurrentUsage: pod.Memory.CurrentUsage.toString(),
                    timestamp: currentTime,
                });
            });
        });
    
    await k8sApi.listNamespace()
        .then((data) => {
            for (let i in data.body.items) {
                res.locals.namespaces.push(data.body.items[i].metadata.name);
            }
        });
    
    return next();
}


apiController.getLogs = async (req, res, next) => {
    try {
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();
        
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
        const namespace = "kube-system";
        const podName = 'kube-controller-manager-minikube';
        const containerName = "";
        const tailLines = 100; // Number of lines to fetch
  
        const logsResponse = await k8sApi.readNamespacedPodLog(podName, namespace, containerName, undefined, undefined, undefined, tailLines);
        const data = logsResponse.body;
  
        res.locals.logs = data.split('\n');
        res.locals.logsKey = `${namespace}=${podName}`;
        return next();
    } catch (error) {
      console.error("Error fetching logs:", error);
      return res.status(500).send("Error fetching logs");
    }
}

module.exports = apiController;