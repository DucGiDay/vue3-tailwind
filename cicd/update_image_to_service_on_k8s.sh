#!/bin/bash

WORKSPACE=$1
IMAGE_NAME=$2
IMAGE_VERSION=$3
REPO_URL=$4


DEPLOYMENTNAME="${IMAGE_NAME}"
if [ $WORKSPACE != "site-product" ]
then
echo "START UPDATE IMAGES $IMAGE_VERSION ON $WORKSPAICE - $DEPLOYMENTNAME"
STRCOMAND="kubectl set image deployment/${DEPLOYMENTNAME} ${DEPLOYMENTNAME}=${REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION} --record -n $WORKSPACE"
echo "STRCOMAND: " $STRCOMAND
ansible masters -a "$STRCOMAND" -i /var/lib/jenkins/hostsk8scluster
fi
if [ $WORKSPACE == "site-product" ]
then
kubectl --kubeconfig=/var/lib/jenkins/cluster1-kubeconfig set image deployment/${DEPLOYMENTNAME} ${DEPLOYMENTNAME}=${REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION} --record -n $WORKSPACE
kubectl --kubeconfig=/var/lib/jenkins/cluster2-kubeconfig set image deployment/${DEPLOYMENTNAME} ${DEPLOYMENTNAME}=${REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION} --record -n $WORKSPACE
fi