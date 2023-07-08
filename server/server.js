const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = 3000;
const mongoose = require('mongoose');
const k8s = require('@kubernetes/client-node');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.resolve(__dirname, '../build')));
app.get('/api', (req, res) => {
    console.log("At /api");

    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const metricsClient = new k8s.Metrics(kc);
    const namespace = "kube-system";
    k8s.topNodes(k8sApi, metricsClient, namespace)
        .then((nodes) => {
            console.log("Nodes", nodes);
        });
    
    k8s.topPods(k8sApi, metricsClient, namespace)
        .then((pods) => {
            const podsColumns = pods.map((pod) => {
                return {
                    "POD": pod.Pod.metadata.name,
                    "CPU": pod.CPU.RequestTotal===0 ? 0: pod.CPU.CurrentUsage/pod.CPU.RequestTotal,
                    "MEMORY(bytes)":  pod.Memory.RequestTotal===0 ? 0 : Number(pod.Memory.CurrentUsage)/Number(pod.Memory.RequestTotal),
                }
            });
            console.log("TOP PODS");
            console.log(podsColumns);
        });
    
    k8sApi.listNamespace()
        .then((res) => {
            for (let i in res.body.items) {
                console.log(res.body.items[i].metadata.name)
            }
        });

    k8sApi.listNamespacedPod('default')
        .then((res) => {
            console.log("this is what we want" , res.body);
        });

    return res.sendStatus(200);
});

app.listen(PORT, () => { console.log('Listening on port 3000... kubersee application') });