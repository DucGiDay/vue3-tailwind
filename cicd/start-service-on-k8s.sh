#!/bin/bash

# bash cicd/start-service-on-k8s.sh site-dev fabi-sales

WORKSPACE=$1
SERVICENAME=$2
echo "WORKSPACE $WORKSPACE"

kubectl -n ${WORKSPACE} delete secret generic ${WORKSPACE}-${SERVICENAME}
# CREATE SECRET
kubectl -n ${WORKSPACE} create secret generic ${WORKSPACE}-${SERVICENAME} --from-env-file=./.${WORKSPACE}.env 

# VERIFY 
kubectl -n ${WORKSPACE} get secret ${WORKSPACE}-${SERVICENAME} -o yaml

#start 
# kubectl -n ${WORKSPACE} apply -f ../http-service-on-k8s/dev-fabi-sales.yaml