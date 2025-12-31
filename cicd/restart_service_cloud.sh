#!/bin/bash

WORKSPACE=$1
SERVICENAME=$2

STRCOMAND="kubectl --kubeconfig /root/ipos.kubeconfig -n ${WORKSPACE} rollout restart deployment/${SERVICENAME}"
echo "STRCOMAND: " $STRCOMAND
ansible cloud -a "$STRCOMAND" -i /var/lib/jenkins/hostsk8scluster