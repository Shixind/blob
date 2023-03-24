---
title: 如何在 Linux 中更改 SSH 端口
date: 2023-03-22
tags:
  - linux
  - ssh
author: shixind
lang: zh-CN
---

本文转载：[https://linuxize.com/post/how-to-change-ssh-port-in-linux/](https://linuxize.com/post/how-to-change-ssh-port-in-linux/)

默认情况下，SSH 侦听端口 22。更改默认 SSH 端口可降低自动攻击的风险，从而为服务器增加额外的安全层。

本教程介绍如何更改 Linux 中的默认 SSH 端口。我们还将向您展示如何配置防火墙以允许访问新的 SSH 端口。

> 保护服务器免受攻击的最佳方法是将防火墙配置为仅允许从受信任的主机访问端口 22，并设置[基于 SSH 密钥的身份验证]()。


## 更改 SSH 端口

更改服务器的 SSH 端口是一项简单的任务。您需要做的就是编辑 SSH 配置文件并重新启动服务。

### 1. 选择新端口号

在 Linux 中，低于 1024 的端口号是为已知服务保留的，只能由 root 绑定。虽然 SSH 服务可以使用 1-1024 范围内的端口以避免将来出现端口分配问题，但建议选择 1024 以上的端口。

在此示例中，将 SSH 端口更改为5522，您可以选择所需的任何端口。


### 2. 调整防火墙

在更改 SSH 端口之前，需要调整防火墙以允许新 SSH 端口上的流量。

如果您使用的是 Ubuntu 的默认防火墙配置工具 UFW，请运行以下命令以打开新的 SSH 端口：

```sh
sudo ufw allow 5522/tcp
```

在 CentOS 中，默认的防火墙管理工具是 FirewallD。要打开新的端口运行，请执行以下操作：

```sh
sudo firewall-cmd --permanent --zone=public --add-port=5522/tcp
sudo firewall-cmd --reload
```

CentOS 用户还需要调整 SELinux 规则：
```sh
sudo semanage port -a -t ssh_port_t -p tcp 5522
```

如果使用 iptables 作为防火墙，要打开新端口，请运行：

```sh
sudo iptables -A INPUT -p tcp --dport 5522 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
```

### 3. 配置 SSH

辑器 SSH 配置文件：`/etc/ssh/sshd_config`
```sh
vim /etc/ssh/sshd_config
```

搜索 `Port 22`，删除开头的 `#` 符号（如有）并输入新的 SSH 端口号：`Port 5522`
```
Port 5522
```

修改 SSH 配置文件时要格外小心。不正确的配置可能会导致 SSH 服务无法启动。

完成后，保存文件并重新启动 SSH 服务以应用更改：

```sh
sudo systemctl restart ssh
```

在 CentOS 中，ssh 服务被命名为：`sshd`

```sh
sudo systemctl restart sshd
```

要验证 SSH 守护程序是否正在侦听新端口 5522，请键入：

```sh
ss -an | grep 5522
```

输出应如下所示：
```Output
tcp   LISTEN      0        128            0.0.0.0:5522           0.0.0.0:*
tcp   ESTAB       0        0      192.168.121.108:5522     192.168.121.1:57638
tcp   LISTEN      0        128               [::]:5522              [::]:*
```

## 使用新的 SSH 端口

要指定端口，请调用 [ssh]() 命令，后跟选项：-p <port_number>

如果您定期连接到多个系统，则可以通过在 [SSH 配置文件]() 中定义所有连接来简化工作流程。
