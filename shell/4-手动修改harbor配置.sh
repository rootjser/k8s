cd harbor
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

#2)赋予执行权限
cp /data/app/harborstartall.sh /data/app/harbor/startall.sh
chmod +x  /data/app/harbor/startall.sh
#3)把启动脚本加到系统启动之后最后一个执行的文件
echo "/bin/bash /data/app/harbor/startall.sh" >>/etc/rc