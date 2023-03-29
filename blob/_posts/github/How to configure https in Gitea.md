---
title: 如何配置 HTTPS 加密与 Gitea 的连接
date: 2023-03-29
tags:
  - git
  - github
  - gitea
author: shixind
lang: zh-CN
---

有过服务器搭建经验的都知道，要配置网站支持 https 访问，需要准备好 SSL/TLS 证书。目前市面上有很多 SSL/TLS 证书颁发机构，但是大部分都是收费的，所以本次教程使用**自签名证书**，教大家如何设置 https。


## 本地生成 SSL/TLS 证书

Gitea 内置提供了生成自签名证书的命令：
```sh
$ gitea cert --help
=== Output
NAME:
   gitea cert - Generate self-signed certificate

USAGE:
   gitea cert [command options] [arguments...]

DESCRIPTION:
   Generate a self-signed X.509 certificate for a TLS server.
Outputs to 'cert.pem' and 'key.pem' and will overwrite existing files.

OPTIONS:
   --host value                   Comma-separated hostnames and IPs to generate a certificate for
   --ecdsa-curve value            ECDSA curve to use to generate a key. Valid values are P224, P256, P384, P521
   --rsa-bits value               Size of RSA key to generate. Ignored if --ecdsa-curve is set (default: 2048)
   --start-date value             Creation date formatted as Jan 1 15:04:05 2011
   --duration value               Duration that certificate is valid for (default: 8760h0m0s)
   --ca                           whether this cert should be its own Certificate Authority
   --custom-path value, -C value  Custom path file path (default: "/data/gitea")
   --config value, -c value       Custom configuration file path (default: "/data/gitea/conf/app.ini")
   --version, -v                  print the version
   --work-path value, -w value    Set the gitea working path (default: "/app/gitea")


DEFAULT CONFIGURATION:
     CustomPath:  /data/gitea (GITEA_CUSTOM)
     CustomConf:  /data/gitea/conf/app.ini
     AppPath:     /usr/local/bin/gitea
     AppWorkPath: /app/gitea
```

进入 Gitea 服务器，执行以下命令生成自签名证书（替换 `gitea.example.com` 为自己的域名/IP）：
```sh
gitea cert --host gitea.example.com
=== Output
2023/03/29 11:23:57 Written cert.pem
2023/03/29 11:23:57 Written key.pem
```
命令执行成功后，会在当前目录下产生 `cert.pem` 和 `key.pem` 文件。

- `cert.pem`：证书文件
- `key.pem`：密钥文件


也可以使用[OpenSSL 生成自签名证书]()，或者自购的 SSL/TLS 证书。



## 修改 Gitea 配置

准备好 SSL/TLS 证书后，需要修改 `app.ini` 配置文件：

```ini /data/gitea/conf/app.ini
[server]
PROTOCOL  = https
ROOT_URL  = https://gitea.example.com:18080/
CERT_FILE = /path/to/cert.pem
KEY_FILE  = /path/to/key.pem
```

- `PROTOCOL`: 使用的协议类型，可选 `http` 或 `https`
- `CERT_FILE`: 启用HTTPS的证书文件
- `KEY_FILE`: 启用HTTPS的密钥文件

修改 `ROOT_URL` 的访问地址修改为 `https`。

> 注意：记得赋予 Gitea 对 `cert.pem` 和 `key.pem` 这两个证书文件的可读权限。


修改成功后，需要重启 Gitea 服务：
```sh
# 切换 git 用户
su git
# 重启 gitea 服务
gitea manager restart
```

重启后，访问HTTPS网址： `https://gitea.example.com:18080/`。

> 注：因浏览器安全性问题，SSL/TLS 证书认证失败的 https 网站会被浏览器提示不安全。



## 设置 HTTP 重定向（未测试）

Gitea 服务器只能侦听一个端口；如果要将 HTTP 请求重定向到 HTTPS 端口，需要启用 HTTP 重定向服务：

```ini /data/gitea/conf/app.ini
[server]
REDIRECT_OTHER_PORT = true
; 重定向到服务的 HTTPS 监听端口（自定义，与 HTTP_PORT 不冲突即可）
PORT_TO_REDIRECT = 3080
```

如果您使用的是 Docker，请确保容器映射此端口。

