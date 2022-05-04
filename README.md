# k8s
<a style="text-decoration: underline;" href="https://github.com/rootjser/k8s/blob/main/README.md#virtualbox-%E5%92%8C-centos-%E4%B8%8B%E8%BD%BD" target="_blank"><h3>VirtualBox和Centos</h3></a>

<a style="text-decoration: underline;" href="https://github.com/rootjser/k8s/blob/main/README.md#docker-1" target="_blank"><h3>Docker</h3></a>

<a style="text-decoration: underline;" href="https://github.com/rootjser/k8s/blob/main/README.md#k8s%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA-1" target="_blank"><h3>k8s环境搭建</h3></a>

<a style="text-decoration: underline;" href="https://github.com/rootjser/k8s/blob/main/README.md#harbor-1" target="_blank"><h3>Harbor</h3></a>

<a style="text-decoration: underline;" href="https://github.com/rootjser/k8s/blob/main/README.md#gitlab-1" target="_blank"><h3>Gitlab</h3></a>

<a style="text-decoration: underline;" href="https://github.com/rootjser/k8s/blob/main/README.md#jenkins-1" target="_blank"><h3>Jenkins</h3></a>

<a style="text-decoration: underline;" href="https://github.com/rootjser/k8s/blob/main/README.md#dockerfile-1" target="_blank"><h3>Dockerfile</h3></a>

<a style="text-decoration: underline;" href="https://github.com/rootjser/k8s/blob/main/README.md#pipeline-%E6%B5%81%E6%B0%B4%E7%BA%BF%E8%84%9A%E6%9C%AC-1" target="_blank"><h3>pipeline-流水线脚本</h3></a>

<a style="text-decoration: underline;" href="https://github.com/rootjser/k8s/blob/main/README.md#k8s%E9%83%A8%E7%BD%B2-1" target="_blank"><h3>k8s部署</h3></a>

<a style="text-decoration: underline;" href="https://github.com/rootjser/k8s/blob/main/README.md#linux%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4-1" target="_blank"><h3>linux常用命令</h3></a>

## VirtualBox 和 CentOS 下载
> VirtualBox
```code
https://www.oracle.com/virtualization/technologies/vm/downloads/virtualbox-downloads.html
```
> CentOS
```code
https://mirrors.tuna.tsinghua.edu.cn/centos/7.9.2009/isos/x86_64/CentOS-7-x86_64-DVD-2009.iso
```

## 虚拟机开启网络
最小化安装的操作系统是没有配置网络的需要开启
### 方式一：设置获取动态ip地址
> 1.1 查看网卡信息
```code
ip a 
ip a|head
```
> 1.2 修改网卡参数ONBOT=no改为yes
ifcfg-enp0s3是上面看到的网卡名
```code
sed -i 's|ONBOOT=no|ONBOOT=yes|g' /etc/sysconfig/network-scripts/ifcfg-enp0s3
```
> 1.3 重启网卡服务
```code
systemctl restart network
```
> 1.4 设置DNS
```code
# vi /etc/resolv.conf
nameserver 114.114.114.114
nameserver 114.114.114.115
```
### 方式二：手动设置静态ip地址
```code
[root@localhost ~]# vi /etc/sysconfig/network-scripts/ifcfg-enp0s3
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static #改成静态模式
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=enp0s3
UUID=dcbf623d-ea0d-41e3-8062-f147336c0f04
DEVICE=enp0s3
ONBOOT=yes #开启网卡
IPADDR=192.168.1.8 #静态IP
GATEWAY=192.168.1.1 #网关IP
NETMASK=255.255.255.0 #子网掩码
DNS1=114.114.114.114 #首先DNS地址
```
### Centos7软件的镜像设置清华源
> 设置yum源
```code
sed -e 's|^mirrorlist=|#mirrorlist=|g' \
         -e 's|^#baseurl=http://mirror.centos.org|baseurl=https://mirrors.tuna.tsinghua.edu.cn|g' \
         -i.bak \
         /etc/yum.repos.d/CentOS-*.repo
```
> 更新缓存
```code
yum makecache
```
## Docker
> 安装docker引擎
```code
#配置主机名：
hostnamectl set-hostname zy-nph-skg-dev-k8s-master01  && bash

#关闭防火墙
systemctl stop firewalld && systemctl disable firewalld

# 以下1-4非必须，一般可跳过
#1、安装 iptables
yum install iptables-services -y

#2、禁用 iptables
service iptables stop && systemctl disable iptables

#3、关闭 selinux
setenforce 0
sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config

#4、安装基础软件包
yum install -y wget net-tools nfs-utils lrzsz gcc gcc-c++ make cmake libxml2-devel openssl-devel curl curl-devel unzip sudo ntp libaio-devel wget vim ncurses-devel autoconf automake zlib-devel python-devel epel-release openssh-server socat ipvsadm conntrack yum-utils

#配置 docker-ce 国内 yum 源（阿里云）
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

#安装 docker 依赖包
yum install -y yum-utils device-mapper-persistent-data lvm2

#安装 docker-ce
yum install docker-ce docker-ce-cli containerd.io

#设置开机启动
systemctl enable docker

#启动Docker服务
systemctl start docker
```
> 配置镜像加速器
```code
cat > /etc/docker/daemon.json <<EOF
{
"registry-mirrors":[
"https://registry.docker-cn.com",
"https://docker.mirrors.ustc.edu.cn",
"https://dockerhub.azk8s.cn",
"http://hub-mirror.c.163.com"
],
"exec-opts": ["native.cgroupdriver=systemd"],
"data-root": "/data/docker",
"insecure-registries":[
"172.31.24.40",
"skg.harbor.bjshxg.com",
"172.31.170.19",
"fat.harbor.bjshxg.com"]
}
EOF

#重启docker服务
systemctl daemon-reload
systemctl restart docker
systemctl status docker
```
> 常用docker命令
```code
docker pull [image] 拉取镜像
docker images 查看所有镜像
docker ps 查看正在运行的容器
docker ps -a 查看所有容器，包括停止的容器
docker containre rm  [containerID] 移除容器
docker container start [containerID] 启动容器
docker container stop [containerID] 停止容器
docker container restart [containerID] 重启容器
docker container update --restart=always [containerID] 更新容器增加restart
docker container exec -it [containerID] /bin/bash  进入容器且启动shell
docker exec -it --user root [containerID] bash  用root进入容器shell
docker container cp [containID]:[/path/to/file]  /path/to/file 从正在运行的 Docker 容器里面，将文件拷贝到本机，两路径可交换
docker run -d --restart always -p 10240:8080 -p 10241:50000 -v /var/jenkins_home:/var/jenkins_home -v /etc/localtime:/etc/localtime --name myjenkins jenkins/jenkins 运行jenkins容器，如果没有回下载镜像再安装容器，-d 后台运行  -p 端口映射 -v 目录挂载 --name 设置容器名称
```
## k8s环境搭建
> 准备两台虚拟机
```code
机器A：192.168.1.200
6G内存 20G硬盘  规划安装 Docker、 Kuboard Spray 、Kuboard 、Gitlab 、Harbor 、Jenkins
机器B:192.168.1.201
6G内存 20G硬盘  不要装Docker，规划k8s的master和etcd节点、worker节点
```
> 机器A和B配置上基本网络环境
步骤安装上述,注意检查DNS /etc/resolv.conf 有没有乱码dns，要去掉
> 只机器A安装Docker环境
步骤安装上述
### Kuboard Spray 用于集群安装
文档 https://kuboard.cn/install/install-k8s.html#%E5%AE%89%E8%A3%85-kuboard-spray
> 镜像安装
```code
docker run -d \
  --privileged \
  --restart=unless-stopped \
  --name=kuboard-spray \
  -p 30000:80/tcp \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v ~/kuboard-spray-data:/data \
 eipwork/kuboard-spray:latest-amd64
```
> 登录
```code
在浏览器打开地址 http://这台机器的IP:30000， 输入用户名 admin，默认密码 Kuboard123，即可登录 Kuboard-Spray 界面。如果端口访问不了，看防火墙关闭。
```
> 填写B服务器信息，勾选master、worker、etcd，写etcd名字
![image](https://user-images.githubusercontent.com/82021554/166192008-bea2ba67-5535-4732-b382-2f453e70dbc6.png)

> 填写私有Harbor仓库地址
![image](https://user-images.githubusercontent.com/82021554/166404089-24ab0162-c4ae-4830-be8b-e49f38ec4e32.png)

### Kuboard 用于集群管理
文档
> 镜像安装
```code
docker run -d \
  --restart=unless-stopped \
  --name=kuboard \
  -p 30100:80/tcp \
  -p 30101:10081/tcp \
  -e KUBOARD_ENDPOINT="http://192.168.1.200:30100" \
  -e KUBOARD_AGENT_SERVER_TCP_PORT="30101" \
  -v /root/kuboard-data:/data \
  eipwork/kuboard:v3
```
> 登录
```code
在浏览器打开地址 http://这台机器的IP:30100， 输入用户名 admin，默认密码 Kuboard123，即可登录 Kuboard 界面。如果端口访问不了，看防火墙关闭。
```
> 填写B集群信息
到B机器拷贝kube信息 
```code
cat ~/.kube/config
```
![image](https://user-images.githubusercontent.com/82021554/166196775-4f7ad420-b633-42bc-bbc8-ba38a18b9790.png)

![image](https://user-images.githubusercontent.com/82021554/166196664-debcb7c4-c481-416c-9bd6-baf780a66093.png)

## Harbor
Harbor是由VMWare在Docker Registry的基础之上进行了二次封装，开源的企业级的 Docker Registry 管理项目，加进去了很多额外程序，而且提供了一个非常漂亮的web界面。
Docker Compose可直接下载 
> 安装Docker Compose
Docker Compose安装帮助文档：https://docs.docker.com/compose/install/
Docker Compose可直接下载 https://github.com/docker/compose/releases/download/1.28.5/docker-compose-linux-x86_64 用ft传
```code
#下载ocker-compose
curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

#查看下载好的包
ls /usr/local/bin/

#修改执行权限
chmod +x /usr/local/bin/docker-compose

#软连接映射到/usr/bin/
ln -sf  /usr/local/bin/docker-compose /usr/bin/docker-compose

#验证
which docker-compose
docker-compose version
```
> 安装 Harbor
```code
#下载harbor安装包
wget https://github.com/goharbor/harbor/releases/download/v2.5.0/harbor-online-installer-v2.5.0.tgz

#解压harbor安装包
mkdir -p /data/app/
tar xf harbor-online-installer-v2.5.0.tgz -C /data/app/

#编辑harbor.yml文件
cd /data/app/harbor
cp harbor.yml.tmpl harbor.yml

vi harbor.yml
port: 30200    # 端口可改为30200
hostname:   192.168.1.200   #主机IP/或者域名
harbor_admin_password: Harbor12345   #harbor UI界面admin登陆密码
data_volume: /data/app/harbor-data  #harbor 持久化数据

#关闭https（把以下的行都注释掉12-18行）
# https related config
#https:
# # https port for harbor, default is 443
# port: 443
# # The path of cert and key files for nginx
# certificate: /your/certificate/path
# private_key: /your/private/key/p

# 安装脚本
运行 ./install.sh
```
![image](https://user-images.githubusercontent.com/82021554/166200641-8d89e70f-3fa5-41a5-903b-c30d1db34068.png)
![image](https://user-images.githubusercontent.com/82021554/166201360-c3dcdf7e-4d02-4a58-8ccc-d59a0d773c0c.png)

> 设置Harbor开启启动
```code
# 编写启动脚本
vi /data/app/harbor/startall.sh

#!/bin/bash
cd /data/app/harbor
docker-compose stop && docker-compose start

# 赋予执行权限
chmod +x  /data/app/harbor/startall.sh

# 把启动脚本加到系统启动之后最后一个执行的文件
echo "/bin/bash /data/app/harbor/startall.sh" >>/etc/rc.d/rc.local
chmod +x /etc/rc.d/rc.local
```

## Gitlab
参考地址 https://docs.gitlab.com/ee/install/docker.html#install-gitlab-using-docker-engine
> 镜像安装
```code
docker run --detach \
  --publish 30300:80 --publish 30301:443 --publish 30302:22 \
  --name gitlab \
  --restart always \
  --volume $GITLAB_HOME/config:/etc/gitlab \
  --volume $GITLAB_HOME/logs:/var/log/gitlab \
  --volume $GITLAB_HOME/data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest
```

> 获取root初始密码，这里获取的密码如果不能登录gitlab，直接用第三步重置root密码
注意：The password file will be automatically deleted in the first reconfigure run after 24 hours.
```code
docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password
```

> web界面首次修改root密码
```code
右上角 -> Edit profile -> password
```

> reset password
```code
docker exec -it gitlab bash
gitlab-rake "gitlab:password:reset"
```

> 修改gitllab显示的clone地址，不然是一串数字乱码
```code
docker exec -it -u root gitlab bash
vi /opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml
修改地址 host: 192.168.1.200
        port: 30300
gitlab-ctl restart
```
![image](https://user-images.githubusercontent.com/82021554/166206421-9b6443f2-124f-49f0-ac77-fb2b940fd19a.png)

## 配置Kubectl
> 现在宿主机安装Kubectl，后续Jenkins直接用，注意v1.23.6使用k8s版本对应
```code
wget https://dl.k8s.io/v1.23.6/kubernetes-client-linux-amd64.tar.gz
tar -xzvf kubernetes-client-linux-amd64.tar.gz
cp kubernetes/client/bin/kube* /usr/local/bin/
chmod a+x /usr/local/bin/kube*
```
> 拷贝~/.kube/config文件

从k8s集群拷贝config文件到Jenkins宿主机，/root/.kube目录没有就新建目录，把config文件改好放进去，用于kubectl连接集群，要用notepad++修改server地址为 https://192.168.1.201:6443

![image](https://user-images.githubusercontent.com/82021554/166621954-41fd9b75-9f9d-459a-b2dc-766e5beb5356.png)

> 在宿主机使用 kubectl cluster-info 

打印出域名就成功了

![image](https://user-images.githubusercontent.com/82021554/166622088-3c98b76d-1912-4ab9-9037-4d653eaf8153.png)

## Jenkins
参考 http://www.360doc.com/content/20/1008/15/61746833_939429398.shtml
> 1、安装
```code
参考地址 https://www.cnblogs.com/fuzongle/p/12834080.html
```
```code
mkdir -p /var/jenkins_home/k8s && chmod 777 /var/jenkins_home && chmod 777 /var/run/docker.sock
docker run -d --restart always -p 30400:8080 -p 30401:50000 -v /var/jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v /usr/bin/docker:/usr/bin/docker -v /etc/localtime:/etc/localtime -v /usr/local/bin/kubectl:/usr/bin/kubectl --name jenkins docker.io/jenkins/jenkins
```
> 2、安装镜像加速
```code
修改文件 vi /var/jenkins_home/hudson.model.UpdateCenter.xml
将url改为 https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
```
> 3、获取默认admin初始密码
访问网站 http://192.168.1.200:30400/，云平台注意打开防火墙端口30400
```code
cat /var/jenkins_home/secrets/initialAdminPassword
```
> 4、点击安装推荐的插件按钮即可
```code
推荐额外需要安装的插件名称：
1.AnsiColor  终端字体显示颜色插件
2.Role-based Authorization Strategy  用户角色权限管理插件
3.Permissive Script Security  允许管理员检查安全提示脚本
4.参数化构建插件：
Extended Choice Parameter
Active Choices
Extensible Choice Parameter
Dynamic Extended Choice Parameter
Maven Artifact ChoiceListProvider (Nexus)
Persistent Parameter
Text File Operations
Editable Choice
5.groovy插件：
Groovy
Groovy Postbuild
6.git插件：
Git Pipeline for Blue Ocean
GitHub Pipeline for Blue Ocean
Git Parameter
GitLab
Docker API
7.rebuild插件
Rebuilder
8.代码质量扫描插件
SonarQube Scanner
```

## Dockerfile
> 前端打包后只需要nginx
```code
# nginx 基础镜像
FROM nginx
# root 用户
# USER root
# copy 打包文件到nginx 的www目录
COPY ./build/ /usr/share/nginx/html
# 声明端口
# EXPOSE 80
# 启动nginx
# ENTRYPOINT ["/docker-entrypoint.sh"]
# CMD ["nginx" "-g" "daemon off;"]
```

## Pipeline 流水线脚本
> 服务器配置Node 16.x环境（可跳过）
```code
# 方式一
curl -sL https://rpm.nodesource.com/setup_16.x | bash - yum install nodejs -y

# 方式二
yum install -y wget
cd /usr/local
wget https://npm.taobao.org/mirrors/node/v16.15.0/node-v16.15.0-linux-x64.tar.gz
tar -zxf node-v16.15.0-linux-x64.tar.gz
ln -s node-v16.15.0-linux-x64 node
vi /etc/profile
最后写入
export NODE_HOME=/usr/local/node/
export PATH=$NODE_HOME/bin:$PATH

# 退出执行
source /etc/profile
# 查看node与npm版本
node -v
```
> Jenkins配置Node环境
参考 https://www.cnblogs.com/fsong/p/14412692.html
```code
1、系统管理——管理插件——可选插件，搜索NodeJS，选择NodeJS Plugin安装
2、系统管理 —— 全局工具配置 —— NodeJS - 新增安装 - Install from nodejs.org mirror，选择安装nodejs，选择当前版本 14.16.0，命名node。并选中 自动安装
   镜像地址填 https://npm.taobao.org/mirrors/node/
3、创建一个 "构建一个自由风格的软件项目"
   在项目的配置页面中: 在构建环境中勾选 Provide Node & npm bin/ folder to PATH ,选中对应的 nodejs 版本
   在项目的配置页面中: 在构建中，点击 执行shell 并填入 node -v, 然后 执行编译
4、系统管理 => 系统配置 => 节点管理,添加这个环境变量
   PATH=$PATH:/var/jenkins_home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/node/bin
```
![image](https://user-images.githubusercontent.com/82021554/166232453-eefdd5a6-ab25-422e-bfd8-fe3af0e0586c.png)
![image](https://user-images.githubusercontent.com/82021554/166230907-71903989-5370-46fb-ba3d-89542670318c.png)


> 增加gitlabroot凭据
Dashboard > 凭据 > 系统 > 全局凭据 (unrestricted)

![image](https://user-images.githubusercontent.com/82021554/166216941-2a4cb17e-49c7-44f2-be2a-de7950a8b114.png)

> 如果Harbor和Jenkins在同服务器，则跳过；如果Harbor和Jenkins在不同服务器，则Jenkins服务器增加harbor的http支持，因为docker默认用https登录等
```code
cat > /etc/docker/daemon.json <<EOF
拷贝
{
"insecure-registries":[
"192.168.1.200:30200"
]
}
EOF

#重启docker服务
systemctl daemon-reload
systemctl restart docker
systemctl status docker
```
> 创建deployment.yaml脚本

在kuboard中部署一个docker nginx服务，拷贝deployment.yaml文件，隐藏status字段，修改里面的项目名，镜像名等变量，用于下面pipeline脚本的kubectl部署
![image](https://user-images.githubusercontent.com/82021554/166627986-4cea58b6-1ad0-42cb-a9ad-f07eb3e8d17a.png)
![image](https://user-images.githubusercontent.com/82021554/166628680-f404a15b-dfc4-4400-90fe-4df11045978b.png)
把appName替换里面的项目名webtest，把Tag替换版本号
放到/var/jenkins_home/k8s目录
```code
---
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations: {}
  labels:
    k8s.kuboard.cn/layer: svc
    k8s.kuboard.cn/name: appName
  name: appName
  namespace: kuboard
  resourceVersion: '65790'
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      k8s.kuboard.cn/layer: svc
      k8s.kuboard.cn/name: appName
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        k8s.kuboard.cn/layer: svc
        k8s.kuboard.cn/name: appName
    spec:
      containers:
        - image: 'my-registry.com/library/appName:TAG'
          imagePullPolicy: IfNotPresent
          name: appName
          resources: {}
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30

---
apiVersion: v1
kind: Service
metadata:
  annotations: {}
  labels:
    k8s.kuboard.cn/layer: svc
    k8s.kuboard.cn/name: appName
  name: appName
  namespace: kuboard
  resourceVersion: '21037'
spec:
  clusterIP: 10.233.37.128
  clusterIPs:
    - 10.233.37.128
  externalTrafficPolicy: Cluster
  internalTrafficPolicy: Cluster
  ipFamilies:
    - IPv4
  ipFamilyPolicy: SingleStack
  ports:
    - name: 8nzxma
      nodePort: 31001
      port: 80
      protocol: TCP
      targetPort: 80
  selector:
    k8s.kuboard.cn/layer: svc
    k8s.kuboard.cn/name: appName
  sessionAffinity: None
  type: NodePort

```

> 创建Dockerfile

把deployment.yaml和Dockerfile都放到/var/jenkins_home/k8s目录，pipeline后面好用
```code
# nginx 基础镜像
FROM nginx
# root 用户
# USER root
# copy 打包文件到nginx 的www目录
COPY ./build/ /usr/share/nginx/html
# 声明端口
# EXPOSE 80
# 启动nginx
# ENTRYPOINT ["/docker-entrypoint.sh"]
# CMD ["nginx" "-g" "daemon off;"]
```
> 添加777权限
```code
chmod 777 /var/jenkins_home/k8s/deployment.yaml 
chmod 777 /var/jenkins_home/k8s/Dockerfile
```
> 新建流水线任务pipeline脚本
```code

pipeline {
    agent any
	
	environment {
        // 全局变量
        imageTag = sh returnStdout: true, script: "date +%Y%m%d%H%M%S"
        app = 'webtest'
    }
	
    stages {
        stage('拉取代码') {
            steps {
                git branch: 'main',credentialsId: 'gitlabroot', url: "http://192.168.1.200:30300/root/${app}.git"
            }
        }
        stage('编译代码') {
            steps {
                script{
                    sh '''
                        node -v
                        npm install --registry https://registry.npm.taobao.org
    				    npm run build
				    '''
                }
            }
        }
        stage('打包docker') {
            steps {
                script{
                    sh '''
                        docker build -t 127.0.0.1:30200/library/${app}:${imageTag} .
                        
				    '''
                }
            }
        }
        stage('上传镜像') {
            steps {
                script{
                    sh '''
                        docker login --username=admin --password=Harbor12345 127.0.0.1:30200
                        docker push 127.0.0.1:30200/library/${app}:${imageTag}
                        sleep 1
                        docker rmi 127.0.0.1:30200/library/${app}:${imageTag}
				    '''
                }
            }
        }
    }
}



```

## k8s部署
> 创建工作负载
![image](https://user-images.githubusercontent.com/82021554/166404650-c7bbb846-155b-4eb8-a354-ce8093c8c89d.png)
![image](https://user-images.githubusercontent.com/82021554/166404672-dd270058-8721-47fa-b41d-2f30f522e340.png)
![image](https://user-images.githubusercontent.com/82021554/166404686-b3770374-c85a-43ca-afdd-e5f924a7c8d2.png)






## linux常用命令
更多命令大全参考:https://www.runoob.com/linux/linux-command-manual.html
```code
> 查看操作系统信息
cat /etc/redhat-release
> 查看cpu个数
cat /proc/cpuinfo| grep "processor"| wc -l
> 查看内存
free -m
> 查看磁盘空间
df -h
> 查看端口
netstat -lnpt 
> 查看进程
ps  -ef 
> echo用于字符串的输出
显示命令执行结果
echo `date`
注意： 这里使用的是反引号 `, 而不是单引号 '。
>
输出字符串或变量不换行
echo -n  "hello world"
> read 命令从标准输入中读取一行,并把输入行的每个字段的值指定给 shell 变量
#!/bin/sh
read name
echo "$name It is a test"
```
### curl的使用说明
1.curl 是常用的命令行工具，用来请求 Web 服务器。它的名字就是客户端（client）的 URL 工具的意思。
参考博客：https://www.ruanyifeng.com/blog/2019/09/curl-reference.html
官方手册：https://curl.se/docs/manpage.html
```code
1.-s参数将不输出错误和进度信息。
curl -s http://172.31.24.30:8888/chfs/shared/java/app.info.txt
1.>将内容重定向到app.info文件
curl -s http://172.31.24.30:8888/chfs/shared/java/app.info.txt >app.info
1.>>将内容追加到app.info文件
curl -s http://172.31.24.30:8888/chfs/shared/java/app.info.txt >>app.info
```
### jq工具的使用说明
1.简介
jq 是一款命令行下处理 JSON 数据的工具。其可以接受标准输入，命令管道或者文件中的 JSON 数据，经过一系列的过滤器(filters)和表达式的转后形成我们需要的数据结构并将结果输出到标准输出中。jq 的这种特性使我们可以很容易地在 Shell 脚本中调用它。
参考博客：https://www.linuxidc.com/Linux/2017-10/148037.htm
官方手册：https://stedolan.github.io/jq/tutorial/
1.centos7系统下载jq
```code
1.添加epel源
wget http://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
rpm -ivh epel-release-latest-7.noarch.rpm
yum repolist
yum -y install jq
1.-r参数返回标准输出
curl -s http://172.31.24.30:8888/chfs/shared/java/app.info.txt | /usr/bin/jq  -r ".info.kkcloud_snowflake[0].git"
```
### sed命令的使用说明
1.简介
Sed表示流编辑器(Stream Editor)的缩写。这是一个简单但功能强大的工具，分析文本，并无缝地转换它。 SED是在1973-1974年由贝尔实验室的李E. McMahon开发。如今，它运行在所有主要的操作系统。
参考博客：https://www.yiibai.com/sed
```code
1.-n参数读取指定的行
sed  -n  '2p'  app.info   #读取第二行
1.-i参数和s命令与g命令一起使用全局替换字符串
sed -i  "s|parameter01|$app|g" start.sh   # 变量$app全局替换parameter01
```
### wget命令的使用说明
1.简介
是Linux系统用于从Web下载文件的命令行工具，支持 HTTP、HTTPS及FTP协议下载文件，而且wget还提供了很多选项，例如下载多个文件、后台下载，使用代理等等，使用非常方便。
参考博客:https://juejin.cn/post/7026184288198459406
```code
1.-q参数,安静模式 (无信息输出)。
wget  -q  http://172.31.24.31:8888/script/newdockerfile.sh
1.-O参数将下载的文件重命名,并有覆盖作用
wget  -q  http://172.31.24.31:8888/script/newdockerfile.sh  -O  dockerfile.sh
```
### shell脚本if判断语句
1.例子
```code
if [ $deploy_name == "kkcloud_snowflake" ];then
echo 'idy'
else
echo 'not kksnow'
fi
```
