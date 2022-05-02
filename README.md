# k8s

## VirtualBox 和 CentOS 下载
### VirtualBox
```code
https://www.oracle.com/virtualization/technologies/vm/downloads/virtualbox-downloads.html
```
### CentOS
```code
https://mirrors.tuna.tsinghua.edu.cn/centos/7.9.2009/isos/x86_64/CentOS-7-x86_64-DVD-2009.iso
```

## 虚拟机开启网络
最小化安装的操作系统是没有配置网络的需要开启
### 方式一：设置获取动态ip地址
#### 1.1 查看网卡信息
```code
ip a 
ip a|head
```
#### 1.2 修改网卡参数ONBOT=no改为yes
ifcfg-enp0s3是上面看到的网卡名
```code
sed -i 's|ONBOOT=no|ONBOOT=yes|g' /etc/sysconfig/network-scripts/ifcfg-enp0s3
```
#### 1.3 重启网卡服务
```code
systemctl restart network
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
