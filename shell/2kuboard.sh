docker run -d \
  --privileged \
  --restart=unless-stopped \
  --name=kuboard-spray \
  -p 30000:80/tcp \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v ~/kuboard-spray-data:/data \
 eipwork/kuboard-spray:latest-amd64



 docker run -d \
  --restart=unless-stopped \
  --name=kuboard \
  -p 30100:80/tcp \
  -p 30101:10081/tcp \
  -e KUBOARD_ENDPOINT="http://192.168.1.150:30100" \
  -e KUBOARD_AGENT_SERVER_TCP_PORT="30101" \
  -v /root/kuboard-data:/data \
  eipwork/kuboard:v3

输入用户名 admin，默认密码 Kuboard123


  docker run --detach \
  --publish 30300:80 --publish 30301:443 --publish 30302:22 \
  --name gitlab \
  --restart always \
  --volume $GITLAB_HOME/config:/etc/gitlab \
  --volume $GITLAB_HOME/logs:/var/log/gitlab \
  --volume $GITLAB_HOME/data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest

  docker exec -it -u root gitlab bash
vi /opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml
  修改地址 host: 192.168.1.150
          port: 30300
  gitlab-ctl restart

  docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password