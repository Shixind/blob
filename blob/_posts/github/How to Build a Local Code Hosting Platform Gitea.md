---
title: 如何搭建本地代码托管平台 Gitea
date: 2023-03-20
tags:
  - git
  - github
  - gitea
author: shixind
lang: zh-CN
---

Gitea 是一个开源社区驱动的轻量级代码托管解决方案，后端采用 Go 编写，采用 MIT 许可证.

官网地址：[https://gitea.io/zh-cn/](https://gitea.io/zh-cn/)


## 系统要求
- 最低的系统硬件要求为一个廉价的树莓派
- 如果用于团队项目，建议使用 2 核 CPU 及 1GB 内存


## 安装

Gitea 提供了多种安装方式：

  - [从二进制安装](#从二进制安装)
  - [使用 Docker 安装](#使用-docker-安装)
  - [使用包管理器安装](#使用包管理器安装)
  - [从源代码安装](#从源代码安装)

更多安装方式参见：[https://docs.gitea.io/zh-cn/install-with-docker-rootless/](https://docs.gitea.io/zh-cn/install-with-docker-rootless/)


### 从二进制安装

进入[官网下载页面](https://dl.gitea.com/gitea/)，选择对应平台的二进制文件。

- **对于 Linux**: linux-amd64 适用于 64-bit 的 Intel/AMD 平台。更多架构包含 arm64 (Raspberry PI 4)，386 (32-bit)，arm-5 以及 arm-6。
- **对于 Windows**: windows-4.0-amd64 适用于 64-bit 的 Intel/AMD 平台，386 适用于 32-bit 的 Intel/AMD 平台。（提示：gogit-windows 版本内建了 gogit 可能缓解在旧的 Windows 平台上 Go 程序调用 git 子程序时面临的 性能问题）
- **对于 macOS**: darwin-arm64 适用于 Apple Silicon 架构，darwin-amd64 适用于 Intel 架构.
- **对于 FreeBSD**: freebsd12-amd64 适用于 64-bit 的 Intel/AMD 平台。

这里以 unbutu:20.04 系统举例：


1. 安装 SSH 和 Git

```sh
apt-get update
apt install -y openssh-server wget gpg git
```
> 注：Git 必须版本 >= 2.0.


2. 创建用户（推荐使用名称 `git`）
```sh
adduser --system \
--shell /bin/bash \
--gecos 'Git Version Control' \
--group \
--disabled-password \
--home /home/git \
git
```


3. 创建并配置 `Gitea` 的工作路径
```sh
mkdir -p /var/lib/gitea/{custom,data,log}
chown -R git:git /var/lib/gitea/
chmod -R 750 /var/lib/gitea/
mkdir /etc/gitea
chown root:git /etc/gitea
chmod 770 /etc/gitea
export GITEA_WORK_DIR=/var/lib/gitea/
```

> 注意： 为了让 Web 安装程序可以写入配置文件，我们临时为 /etc/gitea 路径授予了组外用户 git 写入权限。建议在安装结束后将配置文件的权限设置为只读。
> 
> ```sh
> chmod 750 /etc/gitea
> chmod 640 /etc/gitea/app.ini
> ```


4. 下载二进制文件

```sh
wget -O gitea https://dl.gitea.com/gitea/1.18.5/gitea-1.18.5-linux-amd64
chmod +x gitea
mv gitea /usr/local/bin/gitea
```

下载完成后验证一下 GPG 签名：
```sh
wget https://dl.gitea.com/gitea/1.18.5/gitea-1.18.5-linux-amd64.asc
gpg --keyserver keys.openpgp.org --recv 7C9E68152594688862D62AF62D9AE806EC1592E2
gpg --verify gitea-1.18.5-linux-amd64.asc /usr/local/bin/gitea
```

- 校验正确时的信息为 Good signature from "Teabot <teabot@gitea.io>"。 
- 校验错误时的信息为 This key is not certified with a trusted signature!。


5. 运行 Gitea

完成以上步骤后，可以通过两种方式运行 Gitea：

- **创建服务自动启动 Gitea（推荐）**

  在终端中执行以下命令：
  ```sh
  vim /etc/systemd/system/gitea.service
  ```

  将以下代码拷贝到 `gitea.service` 文件内：

  > 根据自身情况修改修改 user，home 目录以及其他必须的初始化参数，如果使用自定义端口，则需修改 PORT 参数，反之如果使用默认端口则需删除 -p 标记。

  ```ini
  [Unit]
  Description=Gitea (Git with a cup of tea)
  After=syslog.target
  After=network.target
  ###
  # Don't forget to add the database service dependencies
  ###
  #
  #Wants=mysql.service
  #After=mysql.service
  #
  #Wants=mariadb.service
  #After=mariadb.service
  #
  Wants=postgresql.service
  After=postgresql.service
  #
  #Wants=memcached.service
  #After=memcached.service
  #
  #Wants=redis.service
  #After=redis.service
  #
  ###
  # If using socket activation for main http/s
  ###
  #
  #After=gitea.main.socket
  #Requires=gitea.main.socket
  #
  ###
  # (You can also provide gitea an http fallback and/or ssh socket too)
  #
  # An example of /etc/systemd/system/gitea.main.socket
  ###
  ##
  ## [Unit]
  ## Description=Gitea Web Socket
  ## PartOf=gitea.service
  ##
  ## [Socket]
  ## Service=gitea.service
  ## ListenStream=<some_port>
  ## NoDelay=true
  ##
  ## [Install]
  ## WantedBy=sockets.target
  ##
  ###

  [Service]
  # Uncomment the next line if you have repos with lots of files and get a HTTP 500 error because of that
  # LimitNOFILE=524288:524288
  RestartSec=2s
  Type=simple
  User=git
  Group=git
  WorkingDirectory=/var/lib/gitea/
  # If using Unix socket: tells systemd to create the /run/gitea folder, which will contain the gitea.sock file
  # (manually creating /run/gitea doesn't work, because it would not persist across reboots)
  #RuntimeDirectory=gitea
  ExecStart=/usr/local/bin/gitea web --config /etc/gitea/app.ini
  Restart=always
  Environment=USER=git HOME=/home/git GITEA_WORK_DIR=/var/lib/gitea
  # If you install Git to directory prefix other than default PATH (which happens
  # for example if you install other versions of Git side-to-side with
  # distribution version), uncomment below line and add that prefix to PATH
  # Don't forget to place git-lfs binary on the PATH below if you want to enable
  # Git LFS support
  #Environment=PATH=/path/to/git/bin:/bin:/sbin:/usr/bin:/usr/sbin
  # If you want to bind Gitea to a port below 1024, uncomment
  # the two values below, or use socket activation to pass Gitea its ports as above
  ###
  #CapabilityBoundingSet=CAP_NET_BIND_SERVICE
  #AmbientCapabilities=CAP_NET_BIND_SERVICE
  ###
  # In some cases, when using CapabilityBoundingSet and AmbientCapabilities option, you may want to
  # set the following value to false to allow capabilities to be applied on gitea process. The following
  # value if set to true sandboxes gitea service and prevent any processes from running with privileges
  # in the host user namespace.
  ###
  #PrivateUsers=false
  ###

  [Install]
  WantedBy=multi-user.target
  ```

  激活 gitea 并将它作为系统自启动服务：

  ```sh
  systemctl enable gitea
  systemctl start gitea
  ```

- **通过命令行终端运行**
  ```sh
  su git
  /usr/local/bin/gitea web -c /etc/gitea/app.ini
  ```

<br><br>

### 使用 Docker 安装

Gitea 在其 Docker Hub 组织内提供自动更新的 [Docker 镜像](https://hub.docker.com/r/gitea/gitea)。可以始终使用最新的稳定标签或使用其他服务来更新 Docker 镜像。

```sh
docker run \
--hostname gitea.local.com \
--publish 443:443 --publish 80:3000 --public 22:22 \
--name gitea \
--restart always \
--volume ./data:/data \
--volume /etc/timezone:/etc/timezone:ro \
--volume /etc/localtime:/etc/localtime:ro \
gitea/gitea:latest
```


或者使用 `Docker Compose`，将以下内容写入 `docker-compose.yml` 文件：
```yml
version: "3.9"

networks:
  gitea:
    external: false

services:
  server:
    image: gitea/gitea:1.18.5
    restart: always
    container_name: gitea
    hostname: 'gitea.local.com'
    networks:
      - gitea
    volumes:
      - ./data:/data
    ports:
      - "443:443"
      - "80:3000"
      - "22:22"
```
然后进入 `docker-compose.yml` 所在目录，运行 `docker-compose up -d` 启动 Gitea。

<br><br>

### 使用包管理器安装

#### Alpine Linux
Gitea 已经包含在 Alpine Linux 的社区存储库中，版本与 Gitea 官方保持同步。
```sh
apk add gitea
```


#### Arch Linux
Gitea 已经在滚动发布发行版的官方社区存储库中，版本与 Gitea 官方保持同步。
```sh
pacman -S gitea
```


#### Arch Linux ARM
官方支持 aarch64， armv7h 和 armv6h 架构。
```sh
pacman -S gitea
```


#### Canonical Snap
目前 Gitea 已在 Snap Store 中发布，名称为 gitea。
```sh
snap install gitea
```


#### Windows
目前你可以通过 [Chocolatey](https://chocolatey.org/) 来安装 Gitea。
```sh
choco install gitea
```
你也可以[从二进制安装](#从二进制安装)。


#### MacOS
macOS 平台下当前我们仅支持通过 `brew` 来安装。如果你没有安装 [Homebrew](http://brew.sh/)，你也可以查看[从二进制安装](#从二进制安装)。在你安装了 `brew` 之后， 你可以执行以下命令：
```sh
brew tap gitea/tap https://gitea.com/gitea/homebrew-gitea
brew install gitea
```

<br><br>

### 从源代码安装

这里以 unbutu:20.04 系统举例：

#### 先决条件

首先你需要 [安装Golang]()，其次你需要[安装Node.js]()；Node.js 和 npm 将用于构建 Gitea 前端。

- 安装 Go:
  > 版本要求：go 1.19 或以上版本

  ```sh
  wget https://golang.google.cn/dl/go1.20.2.linux-amd64.tar.gz
  rm -rf /usr/local/go && tar -C /usr/local -xzf go1.20.2.linux-amd64.tar.gz
  export PATH=$PATH:/usr/local/go/bin
  ```
  执行 `go version` 命令检查安装是否成功。
  


- 安装 Nodejs:
  > 版本要求：node 16 或以上版本，并且安装 npm

  ```sh
  apt install -y gcc-10-aarch64-linux-gnu
  cp /usr/aarch64-linux-gnu/lib/* /lib/
  wget https://nodejs.org/download/release/v16.19.1/node-v16.19.1-linux-arm64.tar.gz
  mkdir -p /usr/local/lib && tar -C /usr/local/lib -xzf node-v16.19.1-linux-arm64.tar.gz
  mv /usr/local/lib/node-v16.19.1-linux-arm64 /usr/local/lib/nodejs
  echo "export PATH=/usr/local/lib/nodejs/bin:$PATH" >> ~/.profile
  . ~/.profile
  ```
  执行 `node -v` 命令检查安装是否成功。
  

- 安装编译依赖：
  ```sh
  apt update
  apt install -y git make
  ```


#### 下载源码

获取Gitea的源码，最方便的方式是使用 git 命令。执行以下命令：
```sh
git clone https://github.com/go-gitea/gitea
cd gitea
```

如果你想编译最新稳定分支，你可以执行以下命令签出源码：
```sh
git branch -a
git checkout v1.18.5
```

你也可以直接使用标签版本如 v1.18.5。你可以执行以下命令列出可用的版本并选择某个版本签出：
```sh
git tag -l
git checkout v1.18.5
```

#### 编译

按照您的编译需求，以下 tags 可以使用：
- `bindata`: 这个编译选项将会把运行Gitea所需的所有外部资源都打包到可执行文件中，这样部署将非常简单因为除了可执行程序将不再需要任何其他文件。
- `sqlite sqlite_unlock_notify`: 这个编译选项将启用SQLite3数据库的支持，建议只在少数人使用时使用这个模式。
- `pam`: 这个编译选项将会启用 PAM (Linux Pluggable Authentication Modules) 认证，如果你使用这一认证模式的话需要开启这个选项。

使用 `bindata` 可以打包资源文件到二进制可以使开发和测试更容易，你可以根据自己的需求决定是否打包资源文件。 要包含资源文件，请使用 bindata tag：
```sh
TAGS="bindata" make build
```

默认的发布版本中的编译选项是：`TAGS="bindata sqlite sqlite_unlock_notify"`。以下为推荐的编译方式：
```sh
TAGS="bindata sqlite sqlite_unlock_notify" make build
```


#### 测试

在执行了以上步骤之后，你将会获得 `gitea` 的二进制文件，在你复制到部署的机器之前可以先测试一下。在命令行执行完后，你可以 `Ctrl + C` 关掉程序。
```sh
./gitea web
```
