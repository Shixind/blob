---
title: Ubuntu 20.04 更换国内源
date: 2023-03-17
tags:
  - ubuntu
author: shixind
lang: zh-CN
---

ubuntu 20.04 是 Ubuntu 的第 8 个 LTS 版本，其重大更新和改进将在 2030 年前终止，计划于2020年 4 月 23 日发布。

国内有很多 Ubuntu 的镜像源，包括阿里的、网易的，还有很多教育网的镜像源，比如：清华大学镜像源、中科大镜像源。

我们这里以“清华大学镜像源”为例讲解如何修改 Ubuntu 20.04 里面默认的源。

1. 备份原文件

```sh
cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

2. 修改 sources.list 文件，将 `http://archive.ubuntu.com` 和 `http://security.ubuntu.com` 替换成清华大学镜像源的网址

```sh
sed -i "s@http://.*archive.ubuntu.com@http://mirrors.tuna.tsinghua.edu.cn@g" /etc/apt/sources.list
sed -i "s@http://.*security.ubuntu.com@http://mirrors.tuna.tsinghua.edu.cn@g" /etc/apt/sources.list
```

3. 编辑文件完成后，执行如下命令进行更新缓存

```sh
apt-get update
apt-get upgrade
```



## 清华大学镜像源

修改 sources.list 文件，将 `http://archive.ubuntu.com` 和 `http://security.ubuntu.com` 替换成 `http://mirrors.tuna.tsinghua.edu.cn`，可以参考如下命令：

```sh
sed -i "s@http://.*archive.ubuntu.com@http://mirrors.tuna.tsinghua.edu.cn@g" /etc/apt/sources.list
sed -i "s@http://.*security.ubuntu.com@http://mirrors.tuna.tsinghua.edu.cn@g" /etc/apt/sources.list
```

镜像网址：[https://mirrors.tuna.tsinghua.edu.cn/](https://mirrors.tuna.tsinghua.edu.cn/)



## 中科大镜像源

修改 sources.list 文件，将 `http://archive.ubuntu.com` 和 `http://security.ubuntu.com` 替换成 `http://mirrors.ustc.edu.cn`，可以参考如下命令：

```sh
sed -i "s@http://.*archive.ubuntu.com@http://mirrors.ustc.edu.cn@g" /etc/apt/sources.list
sed -i "s@http://.*security.ubuntu.com@http://mirrors.ustc.edu.cn@g" /etc/apt/sources.list
```

镜像网址：[https://mirrors.ustc.edu.cn/](https://mirrors.ustc.edu.cn/)



## 网易镜像源

修改 sources.list 文件，将 `http://archive.ubuntu.com` 和 `http://security.ubuntu.com` 替换成 `http://mirrors.163.com`，可以参考如下命令：

```sh
sed -i "s@http://.*archive.ubuntu.com@http://mirrors.163.com@g" /etc/apt/sources.list
sed -i "s@http://.*security.ubuntu.com@http://mirrors.163.com@g" /etc/apt/sources.list
```

镜像网址：[https://mirrors.163.com/](https://mirrors.163.com/)



## 阿里云镜像源

修改 sources.list 文件，将 `http://archive.ubuntu.com` 和 `http://security.ubuntu.com` 替换成 `http://mirrors.aliyun.com`，可以参考如下命令：

```sh
sed -i "s@http://.*archive.ubuntu.com@http://mirrors.aliyun.com@g" /etc/apt/sources.list
sed -i "s@http://.*security.ubuntu.com@http://mirrors.aliyun.com@g" /etc/apt/sources.list
```

镜像网址：[https://developer.aliyun.com/mirror/](https://developer.aliyun.com/mirror/)



## 华为镜像源

修改 sources.list 文件，将 `http://archive.ubuntu.com` 和 `http://security.ubuntu.com` 替换成 `http://repo.huaweicloud.com`，可以参考如下命令：

```sh
sed -i "s@http://.*archive.ubuntu.com@http://repo.huaweicloud.com@g" /etc/apt/sources.list
sed -i "s@http://.*security.ubuntu.com@http://repo.huaweicloud.com@g" /etc/apt/sources.list
```

镜像网址：[https://mirrors.huaweicloud.com/](https://mirrors.huaweicloud.com/)



## 相关网址参考

[https://zhuanlan.zhihu.com/p/359445541](https://zhuanlan.zhihu.com/p/359445541)
[https://www.cnblogs.com/leeyazhou/p/12976814.html](https://www.cnblogs.com/leeyazhou/p/12976814.html)
