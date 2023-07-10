const fakeCPUData = [
    {
        podName: 'coredns-787d4945fb-7r5zr',
        cpuPercent: 4.005346, // this value is a percentage
        Date: "2023-07-08T19:12:12.568Z"

    },
    {
        podName: 'coredns-787d4945fb-7r5zr',
        cpuPercent: 1.005346, // this value is a percentage
        Date: "2023-07-08T19:13:38.987Z"

    },
    {
        podName: 'coredns-787d4945fb-7r5zr',
        cpuPercent: 20, // this value is a percentage
        Date: "2023-07-08T20:26:42.649Z"

    },
    {
        podName: 'coredns-787d4945fb-7r5zr',
        cpuPercent: 2, // this value is a percentage
        Date: "2023-07-08T20:27:03.940Z"

    },
    {
        podName: 'coredns-787d4945fb-7r5zr',
        cpuPercent: 50, // this value is a percentage
        Date: "2023-07-08T20:27:23.919Z"

    },
    {
        podName: 'pod2-787d4945fb-7r5zr',
        cpuPercent: 5.005346, // this value is a percentage
        Date: "2023-07-08T19:12:12.568Z"

    },
    {
        podName: 'pod2-787d4945fb-7r5zr',
        cpuPercent: 2.005346, // this value is a percentage
        Date: "2023-07-08T19:13:38.987Z"

    },
    {
        podName: 'pod2-787d4945fb-7r5zr',
        cpuPercent: 10, // this value is a percentage
        Date: "2023-07-08T20:26:42.649Z"

    },
    {
        podName: 'pod2-787d4945fb-7r5zr',
        cpuPercent: 5, // this value is a percentage
        Date: "2023-07-08T20:27:03.940Z"

    },
    {
        podName: 'pod2-787d4945fb-7r5zr',
        cpuPercent: 40, // this value is a percentage
        Date: "2023-07-08T20:27:23.919Z"

    }
    
]


const testCPUData = [
    {
        'coredns-787d4945fb-7r5zr': [{
            cpuPercent: 4.005346, // this value is a percentage
            Date: "2023-07-08T19:12:12.568Z"
        }, {
            cpuPercent: 1.005346, // this value is a percentage
            Date: "2023-07-08T19:13:38.987Z"

        },
        {
            cpuPercent: 20, // this value is a percentage
            Date: "2023-07-08T20:26:42.649Z"

        },
        {
            cpuPercent: 2, // this value is a percentage
            Date: "2023-07-08T20:27:03.940Z"

        },
        {
            cpuPercent: 50, // this value is a percentage
            Date: "2023-07-08T20:27:23.919Z"

        }],
    },

]

const NAMESPACES = [
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

export default fakeCPUData;