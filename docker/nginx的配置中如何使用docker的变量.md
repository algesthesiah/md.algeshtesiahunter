# 目录

```js
|-- docker-compose.yml
|-- Dockerfile
|-- nginx.conf
|-- nginx.conf.template
```

### 原理

主要是利用 `docker-compose.yml` 在启动的时候这条命令动态替换模板`/bin/sh -c "envsubst '$${LOCAL_IP}'< /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"`将外部变量注入nginx

### docker-compose.yml

``` js
version: "3.7"

services:
  beauty-nginx:
   container_name: nginx
   image: registry.cn-shenzhen.aliyuncs.com/algesthesiahunter/beauty-nginx:v1
   ports:
       - "80:80"
       - "443:443"
   environment:
       - LOCAL_IP=172.16.4.111
   command: /bin/sh -c "envsubst '$${LOCAL_IP}'< /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
```

### Dockerfile

``` js
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf.template /etc/nginx/nginx.conf.template
```

### nginx.conf

``` js
//这里正常书写 例如
proxy_pass  http://127.0.0.1:8210;

```

### nginx.conf.template

``` js
proxy_pass  http://${LOCAL_IP}:8210;

```
