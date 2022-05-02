# k8s

## VirtualBox 和 CentOS 下载
```code
https://www.oracle.com/virtualization/technologies/vm/downloads/virtualbox-downloads.html
https://mirrors.tuna.tsinghua.edu.cn/centos/7.9.2009/isos/x86_64/CentOS-7-x86_64-DVD-2009.iso
```

## 虚拟机开启网络
最小化安装的操作系统是没有配置网络的需要开启
### 设置自动获取ip地址
```code
ip a 
ip a|head
```
### 修改网卡参数ONBOT=no改为yes
ifcfg-enp0s3是上面看到的网卡名
```code
sed -i 's|ONBOOT=no|ONBOOT=yes|g' /etc/sysconfig/network-scripts/ifcfg-enp0s3
```
### 重启网卡服务
```code
systemctl restart network
```
