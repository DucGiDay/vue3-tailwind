#!/bin/bash
WORKSPACE=$1
IMAGE_NAME=$2
IMAGE_VERSION=$3
REPO_URL=$4
set -e
if [ "$WORKSPACE" = "site-product" ]; then
echo "START BUILD PRO IMAGES $IMAGE_VERSION"
sed -i 's/RUN_ON_MY_WORKSPACE/site-product/g' ./Dockerfile
elif [ "$WORKSPACE" = "site-staging" ]; then
echo "START BUILD STAGING IMAGES $IMAGE_VERSION"
sed -i 's/RUN_ON_MY_WORKSPACE/site-staging/g' ./Dockerfile
else
echo "START BUILD DEV IMAGES $IMAGE_VERSION"
sed -i 's/RUN_ON_MY_WORKSPACE/site-dev/g' ./Dockerfile
fi
sudo docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} --build-arg WORKSPACE=${WORKSPACE} .
sudo docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}
sudo docker push ${REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}
if [ $WORKSPACE == "site-product" ]
then
sudo docker tag ${IMAGE_NAME}:${IMAGE_VERSION} dockerhub.ipos.vn:5000/${IMAGE_NAME}:${IMAGE_VERSION}
sudo docker push dockerhub.ipos.vn:5000/${IMAGE_NAME}:${IMAGE_VERSION}
fi