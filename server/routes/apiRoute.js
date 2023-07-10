const express = require('express');
const stream = require('stream');
const k8s = require('@kubernetes/client-node');
const router = express.Router();

// define the home page route
router.get('/metrics', async (req, res) => {
    console.log("/API/METRICS");

    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const metricsClient = new k8s.Metrics(kc);
    const namespace = "kube-system";
    
    const topNodes = [];
    const topPods = [];
    const namespaces = [];
    
    await k8s.topNodes(k8sApi, metricsClient, namespace)
        .then((nodes) => {
            nodes.map((node) => {
                console.log(node);
                topNodes.push({
                    node: node.Node.metadata.name,
                    cpuCurrentUsage: node.CPU.RequestTotal.toString(),
                    cpuTotal: node.CPU.Capacity.toString(),
                    memoryCurrentUsage: node.Memory.RequestTotal.toString(),
                    memoryTotal: node.Memory.Capacity.toString(),
                    timestamp: Date.now(),
                });
            });
        });
    
    await k8s.topPods(k8sApi, metricsClient, namespace)
        .then((pods) => {
            pods.map((pod) => {
                console.log(pod);
                topPods.push({
                    pod: pod.Pod.metadata.name,
                    cpuCurrentUsage: pod.CPU.CurrentUsage.toString(),
                    memoryCurrentUsage: pod.Memory.CurrentUsage.toString(),
                    timestamp: Date.now(),
                });
            });
        });
    
    await k8sApi.listNamespace()
        .then((data) => {
            for (let i in data.body.items) {
                namespaces.push(data.body.items[i].metadata.name);
            }
        });

    return res.status(200).json({
        namespaces: namespaces,
        nodes: topNodes,
        pods: topPods,    
    });
});

router.get('/logs', async (req, res) => {
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
  
        const logs = data.split('\n')
      return res.status(200).json({logs});
    } catch (error) {
      console.error("Error fetching logs:", error);
      return res.status(500).send("Error fetching logs");
    }
  });

// router.get('/logs', async (req, res) => {
//     const kc = new k8s.KubeConfig();
//     kc.loadFromDefault();
//     const namespace = "kube-system";

//     const log = new k8s.Log(kc);
//     const logs = [];
//     const logStream = new stream.PassThrough();

//     await logStream.on('data', (chunk) => {
//         // use write rather than console.log to prevent double line feed
//         // process.stdout.write(chunk);
//         const log = chunk.toString();
//         console.log(log)
//         logs.push({log: chunk.toString()});
//     });
    
//     await log.log(namespace, 'kube-controller-manager-minikube', '', logStream, {follow: true, tailLines: 50, pretty: false, timestamps: false})
//     .catch(err => {
//             console.log(err);
//             process.exit(1);
//     })
//     .then(req => {
//         // disconnects after 5 seconds
//         if (req) {
//             setTimeout(function() {
//                 req.abort();
//             }, 5000);
//         }
//     });
//     console.log(logs);
//     return res.status(200).json({Logs: logs});
// });

module.exports = router;