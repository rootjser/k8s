# 关闭防火墙
systemctl stop firewalld && systemctl disable firewalld
# 重启docker
systemctl restart docker