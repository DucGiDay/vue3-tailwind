#!/bin/bash

WORKSPACE=$1
IMAGE_NAME=$2
IMAGE_VERSION=$3
REPO_URL=$4

DEPLOYMENTNAME="${IMAGE_NAME}"

# Patch 1: Rolling update strategy
STRATEGY='{"spec":{"strategy":{"type":"RollingUpdate","rollingUpdate":{"maxSurge":1,"maxUnavailable":0}}}}'

# Patch 2: Grace period + preStop hook
GRACEFUL='{"spec":{"template":{"spec":{"terminationGracePeriodSeconds":60,"containers":[{"name":"'"${DEPLOYMENTNAME}"'","lifecycle":{"preStop":{"exec":{"command":["/bin/sh","-c","sleep 10"]}}}}]}}}}'

if [ $WORKSPACE != "site-product" ]; then
    echo "START UPDATE IMAGES $IMAGE_VERSION ON $WORKSPACE - $DEPLOYMENTNAME"

    ansible masters -a "kubectl patch deployment/${DEPLOYMENTNAME} -p '${STRATEGY}' -n $WORKSPACE" \
        -i /var/lib/jenkins/hostsk8scluster

    ansible masters -a "kubectl patch deployment/${DEPLOYMENTNAME} -p '${GRACEFUL}' -n $WORKSPACE" \
        -i /var/lib/jenkins/hostsk8scluster

    ansible masters -a "kubectl set image deployment/${DEPLOYMENTNAME} \
        ${DEPLOYMENTNAME}=${REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION} --record -n $WORKSPACE" \
        -i /var/lib/jenkins/hostsk8scluster

    ansible masters -a "kubectl rollout status deployment/${DEPLOYMENTNAME} \
        -n $WORKSPACE --timeout=120s" \
        -i /var/lib/jenkins/hostsk8scluster
fi

if [ $WORKSPACE == "site-product" ]; then
    echo "START UPDATE IMAGES $IMAGE_VERSION ON site-product - $DEPLOYMENTNAME"

    for KUBECONFIG in /var/lib/jenkins/cluster1-kubeconfig /var/lib/jenkins/cluster2-kubeconfig; do
        echo "--- Updating cluster: $KUBECONFIG ---"

        kubectl --kubeconfig=$KUBECONFIG \
            patch deployment/${DEPLOYMENTNAME} -p "${STRATEGY}" -n $WORKSPACE

        kubectl --kubeconfig=$KUBECONFIG \
            patch deployment/${DEPLOYMENTNAME} -p "${GRACEFUL}" -n $WORKSPACE

        kubectl --kubeconfig=$KUBECONFIG \
            set image deployment/${DEPLOYMENTNAME} \
            ${DEPLOYMENTNAME}=${REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION} \
            --record -n $WORKSPACE

        kubectl --kubeconfig=$KUBECONFIG \
            rollout status deployment/${DEPLOYMENTNAME} \
            -n $WORKSPACE --timeout=120s
    done

    echo "✅ Deploy hoàn thành cả 2 cluster"
fi