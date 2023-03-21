---
title: 如何在 Linux 上安装 OpenSSH 客户端
date: 2023-03-18
tags:
  - linux
  - ssh
author: shixind
lang: zh-CN
---

本文转载：[https://linuxize.com/post/ssh-command-in-linux/](https://linuxize.com/post/ssh-command-in-linux/)


默认情况下，OpenSSH 客户端预安装在大多数 Linux 发行版上。如果您的系统未安装 ssh 客户端，则可以使用分发包管理器进行安装。


## 在 Ubuntu 和 Debian 上安装 OpenSSH

```sh
apt update
apt install openssh-client
```



## 在 CentOS 和 Fedora 上安装 OpenSSH

```sh
yum install openssl-clients
# OR
dnf install openssh-clients
```



## 在 Windows 10 上安装 OpenSSH 客户端

大多数Windows用户使用 [Putty](https://putty.org/) 通过SSH连接到远程计算机。但是，最新版本的Windows 10包括OpenSSH客户端和服务器。这两个软件包都可以通过GUI或PowerShell安装。

若要查找 OpenSSH 包的确切名称，请键入以下命令：
```Powershell
Get-WindowsCapability -Online | ? Name -like 'OpenSSH*'
```

该命令应返回如下内容：
```
Name  : OpenSSH.Client~~~~0.0.1.0
State : NotPresent

Name  : OpenSSH.Server~~~~0.0.1.0
State : NotPresent
```
> 如果 State 为 `Installed`, 则表示已安装。

知道软件包名称后，通过运行以下命令安装它：

```Powershell
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

成功后，输出将如下所示：
```
Path          :
Online        : True
RestartNeeded : False
```


## 在 macOS 上安装 OpenSSH 客户端

macOS 附带默认安装的 OpenSSH 客户端。



## 如何使用 ssh 命令

必须满足以下要求才能通过 SSH 登录到远程计算机：

- SSH 服务器必须在远程计算机上运行。
- 必须在远程计算机防火墙中打开 SSH 端口。
- 您必须知道远程帐户的用户名和密码。该帐户需要具有远程登录的适当权限。

该命令的基本语法如下：

```sh
ssh [OPTIONS] [USER@]HOST
```

若要使用该命令，请打开终端或 PowerShell 并键入，后跟远程主机名：

```
ssh ssh.linuxize.com
```

首次通过 SSH 连接到远程计算机时，您将看到如下所示的消息：
```
The authenticity of host 'ssh.linuxize.com (192.168.121.111)' can't be established.
ECDSA key fingerprint is SHA256:Vybt22mVXuNuB5unE++yowF7lgA/9/2bLSiO3qmYWBY.
Are you sure you want to continue connecting (yes/no)?
```
每个主机都有一个存储在 `~/.ssh/known_hosts` 文件中的唯一指纹。键入 `yes` 以存储远程指纹，系统将提示您输入密码：
```
Warning: Permanently added 'ssh.linuxize.com' (ECDSA) to the list of known hosts.

dev@ssh.linuxize.com's password:
```
输入密码后，您将登录到远程计算机。

<br>

如果未提供用户名，则 `ssh` 命令将使用当前系统登录名。要以其他用户身份登录，请按以下格式指定用户名和主机：

```sh
ssh username@hostname
```

也可以使用 `-l` 选项指定用户名：
```sh
ssh -l username hostname
```

<br>

默认情况下，如果未提供端口，SSH 客户端将尝试连接到端口 22 上的远程服务器。在某些服务器上，管理员正在更改默认 SSH 端口，以通过降低自动攻击的风险为服务器添加额外的安全层。

要在非默认端口上进行连接，请使用 `-p` 选项指定端口：
```sh
ssh -p 5522 username@hostname
```

如果遇到身份验证或连接问题，请使用 `-v` 选项打印调试消息：
```sh
ssh -v username@hostname
```

要提高详细程度，请使用 `-vv` 或 `-vvv`。
