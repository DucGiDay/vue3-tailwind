#!/bin/bash

WORKSPACE=$1
IMAGE_NAME=$2
IMAGE_VERSION=$3
REPO_URL=$4

DEPLOYMENTNAME="${IMAGE_NAME}"

# FIX: Patch strategy trước khi update image
# maxSurge=1: tạo pod mới trước
# maxUnavailable=0: KHÔNG xóa pod cũ cho đến khi pod mới sẵn sàng
STRATEGY_PATCH='{"spec":{"strategy":{"rollingUpdate":{"maxSurge":1,"maxUnavailable":0}}}}'

if [ $WORKSPACE != "site-product" ]; then
    echo "START UPDATE IMAGES $IMAGE_VERSION ON $WORKSPACE - $DEPLOYMENTNAME"

    PATCH_CMD="kubectl patch deployment/${DEPLOYMENTNAME} -p '${STRATEGY_PATCH}' -n $WORKSPACE"
    UPDATE_CMD="kubectl set image deployment/${DEPLOYMENTNAME} ${DEPLOYMENTNAME}=${REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION} -n $WORKSPACE"
    STATUS_CMD="kubectl rollout status deployment/${DEPLOYMENTNAME} -n $WORKSPACE --timeout=120s"

    echo "Patching strategy..."
    ansible masters -a "$PATCH_CMD" -i /var/lib/jenkins/hostsk8scluster

    echo "Updating image..."
    ansible masters -a "$UPDATE_CMD" -i /var/lib/jenkins/hostsk8scluster

    echo "Waiting rollout..."
    ansible masters -a "$STATUS_CMD" -i /var/lib/jenkins/hostsk8scluster
fi

if [ $WORKSPACE == "site-product" ]; then
    echo "START UPDATE IMAGES $IMAGE_VERSION ON site-product - $DEPLOYMENTNAME"

    # Cluster 1
    kubectl --kubeconfig=/var/lib/jenkins/cluster1-kubeconfig \
        patch deployment/${DEPLOYMENTNAME} -p "${STRATEGY_PATCH}" -n $WORKSPACE

    kubectl --kubeconfig=/var/lib/jenkins/cluster1-kubeconfig \
        set image deployment/${DEPLOYMENTNAME} \
        ${DEPLOYMENTNAME}=${REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION} -n $WORKSPACE

    kubectl --kubeconfig=/var/lib/jenkins/cluster1-kubeconfig \
        rollout status deployment/${DEPLOYMENTNAME} -n $WORKSPACE --timeout=120s

    # Cluster 2
    kubectl --kubeconfig=/var/lib/jenkins/cluster2-kubeconfig \
        patch deployment/${DEPLOYMENTNAME} -p "${STRATEGY_PATCH}" -n $WORKSPACE

    kubectl --kubeconfig=/var/lib/jenkins/cluster2-kubeconfig \
        set image deployment/${DEPLOYMENTNAME} \
        ${DEPLOYMENTNAME}=${REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION} -n $WORKSPACE

    kubectl --kubeconfig=/var/lib/jenkins/cluster2-kubeconfig \
        rollout status deployment/${DEPLOYMENTNAME} -n $WORKSPACE --timeout=120s

    echo "Deploy hoàn thành cả 2 cluster"
fi