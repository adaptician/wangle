# Local Setup with Kubernetes

This assumes that you are using Docker Desktop with Kubernetes enabled.

## Setup database

### Create namespace
`kubectl create namespace wangle`

### Switch to namespace context
`kubectl config set-context --current --namespace=wangle`

All commands will now apply to the `wangle` namespace.

### Apply network policy
This will create the network inside K8's through which your resources can communicate.

`kubectl apply -f .\kubernetes\networkpolicy.yaml`

### Create a stateful set for the database and expose on localhost
The stateful set will create the container resource for SQL Server, as well as a Persisted Claim and Volume to preserve the data.
A LoadBalancer service will also be created to make the database accessible via localhost.

`kubectl apply -f .\kubernetes\mssqldb-manifest.yaml`

At this point you can work locally against a database running in your Docker Desktop Kubernetes cluster.

## Setup Migrator 

It may or may not be useful to have a migrator running in the cluster (this is being listed so that developers working with Kubernetes and the boilerplate can practice and learn to understand the tools better.)

### Build the migrator Docker image
`docker build -t wangle.migrator -f .\src\Wangle.Migrator\Dockerfile .`

### Create a deployment to easily run the migrator through k8s
Note: if not scaled down, the migrator will continue to run periodically.
Use it / don't use it as you prefer.

`kubectl apply -f .\kubernetes\migrator-deployment.yaml`

### Scale down migrator to stop it running continuously
`kubectl scale deployment wangle-migrator --replicas=0`

### Scale up migrator to apply changes to the database
If you want to test coded changes, remember to re-build the image and apply the deployment first.

`kubectl scale deployment wangle-migrator --replicas=1`

At this point you can build a migrator image, deploy to the Kubernetes cluster, and scale the migrator to run it as it suits you.

This can be useful when starting from scratch with a clean database, and you just want to run the migrator code as is.

## Switch project context
In order to switch contexts to a different project, `localhost` needs to be freed up. Any services that exist in the cluster are likely bound to localhost, and will block other applications from using it.

### Delete services to free up localhost
`kubectl delete svc --all`

The above command will delete all services in your current namespace, but will leave the other cluster resources intact. When you want to come back to this project, you can provision the services, and they will re-acttach to the existing resources.

While this can be useful for day-to-day context-switching, don't leave too many resources lying around in the cluster long-term, as they will consume hardware resources even if they are not in use.

If you are in a different namespace (eg. you switched and forgot to clear the services bound to localhost), you can do the following:

#### Declare the target namespace in the command
`kubectl delete svc --all --namespace=wangle` OR `kubectl delete svc --all -n=wangle`

# Quickfire section

kubectl config set-context --current --namespace=wangle

kubectl apply -f .\kubernetes\networkpolicy.yaml

kubectl apply -f .\kubernetes\mssqldb-manifest.yaml

docker build -t wangle.migrator -f .\src\Wangle.Migrator\Dockerfile .
kubectl apply -f .\kubernetes\migrator-deployment.yaml

kubectl scale deployment wangle-migrator --replicas=0