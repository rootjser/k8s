
#下载ocker-compose
cp /data/app/docker-compose /usr/local/bin/docker-compose
#修改执行权限
chmod +x /usr/local/bin/docker-compose
#软连接映射到/usr/bin/
ln -sf  /usr/local/bin/docker-compose /usr/bin/docker-compose
#验证
which docker-compose
docker-compose version
#解压harbor安装包
tar xf /data/app/harbor-online-installer-v2.5.0.tgz -C /data/app/
#编辑harbor.yml文件
cd /data/app/harbor
cp harbor.yml.tmpl harbor.yml