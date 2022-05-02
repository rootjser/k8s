# k8s

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
