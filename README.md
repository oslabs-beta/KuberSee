# KuberSee
Kubernetes Visualizer
How to Get Started: 
Install Docker Desktop on your device (Enable Kubernetes Extension). 
Minikube: Follow the installation guide for your device and install the appropriate minikube for your operating system. https://minikube.sigs.k8s.io/docs/start/ 
Start your minikube: `minikube start`
Enable metrics: `minikube addons enable metrics-server`
Create a pod: 
`kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080`
When you are done with the session, stop your minikube: `minikube stop`
