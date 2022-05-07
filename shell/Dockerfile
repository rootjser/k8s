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