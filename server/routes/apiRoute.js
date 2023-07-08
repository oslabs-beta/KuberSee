const express = require('express');
const k8s = require('@kubernetes/client-node');
const router = express.Router();

// define the home page route
router.get('/metrics', async (req, res) => {
    console.log("/API/METRICS");

    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const metricsClient = new k8s.Metrics(kc);
    const namespace = "default";
    
    let topNodes = [];
    let topPods = [];
    let namespaces = [];
    
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
        .then((res) => {
            for (let i in res.body.items) {
                namespaces.push(res.body.items[i].metadata.name);
            }
        });
    
    // console.log({
    //     namespaces,
    //     topNodes,
    //     topPods,
    // });

    return res.status(200).json({
        // namespaces: namespaces,
        // nodes: topNodes,
        pods: topPods,    
    });
});



module.exports = router;