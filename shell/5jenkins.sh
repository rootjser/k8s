#!/bin/bash
docker build -t myimages/jenkins:v1 -f jenkinsDockerfile .
mkdir -p /var/jenkins_home/k8s && chmod 777 /var/run/docker.sock && chmod 777 /var/jenkins_home 
docker run --name jenkins --restart always -p 30400:8080  -v /var/jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker -d myimages/jenkins:v1
docker exec -it jenkins chmod 777 /usr/bin/kubectl
cp deployment.yaml /var/jenkins_home/k8s/deployment.yaml