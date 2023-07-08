export const NODESDATA = [
    {
      Node: {
        apiVersion: undefined,
        kind: undefined,
        metadata: [V1ObjectMeta],
        spec: [V1NodeSpec],
        status: [V1NodeStatus]
      },
      CPU: {
        Capacity: 4,
        RequestTotal: 1.2500000000000002,
        LimitTotal: 0.4
      },
      Memory: {
        Capacity: 8241229824n,
        RequestTotal: 702545920n,
        LimitTotal: 283115520n
      }
    }
]


export const PODSDATA = [
    {
        POD: 'coredns-787d4945fb-7r5zr',
        CPU: 0.04005346,
        MEMORY: 0.8099888392857143
    },
    {
        POD: 'etcd-minikube',
        CPU: 0.56822157,
        MEMORY: 1.70078125
    },
    {
        POD: 'kube-apiserver-minikube',
        CPU: 0.458094892,
        MEMORY: 0
    },
    {
        POD: 'kube-controller-manager-minikube',
        CPU: 0.214926345,
        MEMORY: 0
    },
    {
        POD: 'kube-proxy-97fpl',
        CPU: 0,
        MEMORY: 0
    },
    {
        POD: 'kube-scheduler-minikube',
        CPU: 0.05239525,
        MEMORY: 0
    },
    {
        POD: 'metrics-server-6588d95b98-kp6q9',
        CPU: 0.06508894999999999,
        MEMORY: 0.27107421875
    },
    {
        POD: 'storage-provisioner',
        CPU: 0,
        MEMORY: 0
    }
]

export const NAMESPACES = [
    'default',
    'kube-node-lease',
    'kube-public',
    'kube-system',
    'kubernetes-dashboard',
    'kubersee'
]

const data = {
    namespaces: [
        "default",
        "kube-node-lease",
        "kube-public",
        "kube-system",
        "kubernetes-dashboard",
        "kubersee"
    ],
    nodes: [
        {
            node: "minikube",
            cpuCurrentUsage: "1.2500000000000002",
            cpuTotal: "4",
            memoryCurrentUsage: "702545920",
            memoryTotal: "8241238016",
            timestamp: 1688849973907
        }
    ],
    pods: [
        {
            pod: "alertmanager-prometheus-kube-prometheus-alertmanager-0",
            cpuCurrentUsage: "0.001004433",
            memoryCurrentUsage: "37122048",
            timestamp: 1688849973942
        },
        {
            pod: "hello-node-7b87cd5f68-mzh6z",
            cpuCurrentUsage: "0.000157015",
            memoryCurrentUsage: "6475776",
            timestamp: 1688849973944
        },
        {
            pod: "prometheus-grafana-5f9c846f48-lqzc6",
            cpuCurrentUsage: "0.004995819",
            memoryCurrentUsage: "247865344",
            timestamp: 1688849973946
        },
        {
            pod: "prometheus-kube-prometheus-operator-5ccb5bd-ngttv",
            cpuCurrentUsage: "0.001289666",
            memoryCurrentUsage: "25960448",
            timestamp: 1688849973952
        },
        {
            pod: "prometheus-kube-state-metrics-799f44d4db-wvm2t",
            cpuCurrentUsage: "0.001241719",
            memoryCurrentUsage: "12636160",
            timestamp: 1688849973965
        },
        {
            pod: "prometheus-prometheus-kube-prometheus-prometheus-0",
            cpuCurrentUsage: "0.024168207",
            memoryCurrentUsage: "398917632",
            timestamp: 1688849973969
        },
        {
            pod: "prometheus-prometheus-node-exporter-vpss5",
            cpuCurrentUsage: "0.001056165",
            memoryCurrentUsage: "9924608",
            timestamp: 1688849973974
        }
    ]
    }