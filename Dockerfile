## 选node作为基础镜像
FROM node:latest
MAINTAINER "antgan@163.com"
##换源安装vuecli
RUN \
npm config set registry https://registry.npm.taobao.org \
&& npm install -g @vue/cli
## 指定工作目录
WORKDIR /data/node/dryan-vue
ADD . /data/go/dryan