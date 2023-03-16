---
title: 报错：Package requirements (libzip ＞= 0.11 libzip != 1.3.1 libzip != 1.7.0) were not met
date: 2023-03-16
tags:
  - php
  - docker
  - libzip
author: shixind
lang: zh-CN
---


## 一、环境

> 系统：windows 10 家庭版
> 
> 软件：docker-desktop
>
> 镜像：php:8.0.24-fpm-alpine


## 二、问题

执行 `docker-ext-install zip` 编译安装 **zip** 扩展时报错：

```sh
checking if awk is broken... no
checking for zip archive read/write support... yes, shared
checking for libzip >= 0.11 libzip != 1.3.1 libzip != 1.7.0... no
configure: error: Package requirements (libzip >= 0.11 libzip != 1.3.1 libzip != 1.7.0) were not met:

Package 'libzip', required by 'virtual:world', not found
Package 'libzip', required by 'virtual:world', not found
Package 'libzip', required by 'virtual:world', not found

Consider adjusting the PKG_CONFIG_PATH environment variable if you
installed software in a non-standard prefix.

Alternatively, you may set the environment variables LIBZIP_CFLAGS
and LIBZIP_LIBS to avoid the need to call pkg-config.
See the pkg-config man page for more details.
```

意思是 libzip 的版本必须大于等于 0.11 且不能能与 1.3.1 或者 1.7.0



## 三、解决方案

1. 更新 libzip 版本
```sh
wget https://libzip.org/download/libzip-1.3.2.tar.gz
tar xvf libzip-1.3.2.tar.gz
cd libzip-1.3.2
./configure
make && make install
```

2. 重新编译安装 zip 扩展
```sh
docker-ext-install zip
```

3. 安装成功后需要重新启动容器。
