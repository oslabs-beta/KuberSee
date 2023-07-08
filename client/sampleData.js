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

export default fakeCPUData;

// export const NODESDATA = [
//     {
//         Node: {
//             apiVersion: undefined,
//             kind: undefined,
//             metadata: [V1ObjectMeta],
//             spec: [V1NodeSpec],
//             status: [V1NodeStatus]
//         },
//         CPU: {
//             Capacity: 4,
//             RequestTotal: 1.2500000000000002,
//             LimitTotal: 0.4
//         },
//         Memory: {
//             Capacity: 8241229824n,
//             RequestTotal: 702545920n,
//             LimitTotal: 283115520n
//         }
//     }
// ]


// export const PODSDATA = [
//     {
//         POD: 'coredns-787d4945fb-7r5zr',
//         CPU: 4.005346, // this value is a percentage
//         Date:
//             MEMORY: 0.8099888392857143
//     },
//     {
//         POD: 'etcd-minikube',
//         CPU: 0.56822157,
//         MEMORY: 1.70078125
//     },
//     {
//         POD: 'kube-apiserver-minikube',
//         CPU: 0.458094892,
//         MEMORY: 0
//     },
//     {
//         POD: 'kube-controller-manager-minikube',
//         CPU: 0.214926345,
//         MEMORY: 0
//     },
//     {
//         POD: 'kube-proxy-97fpl',
//         CPU: 0,
//         MEMORY: 0
//     },
//     {
//         POD: 'kube-scheduler-minikube',
//         CPU: 0.05239525,
//         MEMORY: 0
//     },
//     {
//         POD: 'metrics-server-6588d95b98-kp6q9',
//         CPU: 0.06508894999999999,
//         MEMORY: 0.27107421875
//     },
//     {
//         POD: 'storage-provisioner',
//         CPU: 0,
//         MEMORY: 0
//     }
// ]

// export const NAMESPACES = [
//     'default',
//     'kube-node-lease',
//     'kube-public',
//     'kube-system',
//     'kubernetes-dashboard',
//     'kubersee'
// ]