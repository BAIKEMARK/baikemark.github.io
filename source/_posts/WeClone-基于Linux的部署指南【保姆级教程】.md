---
title: WeClone：基于 Linux 的部署指南【保姆级教程】
tags:
  - WeClone
  - 数字分身
  - LLM
  - 大语言模型
  - 指南
  - Linux
categories:
  - 技术教程
  - AI应用
keywords: 'WeClone, 数字克隆, 数字分身, 数字永生, LLM, 大语言模型, 聊天机器人,Linux, QLoRA, 教程'
description: 本指南演示如何在 Linux 环境下使用 xming521/WeClone 项目，创造一个拥有你“那味儿”的数字分身。
cover: 'https://blog-img.051088.xyz/weclone.png'
top_img: 'https://blog-img.051088.xyz/wallhaven-5gwvz5_1920x1080.png'
permalink: /posts/weclone-linux-tutorial
abbrlink: 23179
date: 2025-05-22 17:00:00
---

## WeClone：让你的聊天记录拥有“灵魂”

你是否曾设想过——如果你的聊天风格、口头禅，甚至独特的表达习惯，能够被 AI 学会，并在数字世界中“复刻”一个你，会是怎样的体验？ [xming521/WeClone 项目](https://github.com/xming521/WeClone) 正是在这样一个愿景下诞生的尝试。

WeClone 是一个一站式解决方案，它通过分析你的微信聊天记录，微调大语言模型（LLM），让模型说出“你那味儿”的话，并将其接入聊天机器人，打造出专属于你的数字分身。

<details>
  <summary style="cursor: pointer; font-size: 16px; font-weight: bold; margin-bottom: 10px;">
    点击展开查看训练效果图
  </summary>
  <div style="
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    padding-top: 15px;
    width: 100%;
    box-sizing: border-box;
  ">
    <div style="flex: 1 1 400px; max-width: 800px;">
      <img 
        src="https://blog-img.051088.xyz/%E6%9C%80%E7%BB%88%E6%95%88%E6%9E%9C1.png" 
        alt="WeClone 训练效果示例：与AI数字分身的对话截图1"
        style="
          width: 100%;
          height: auto;
          object-fit: contain;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        " 
        loading="lazy"
      />
    </div>
    <div style="flex: 1 1 300px; max-width: 500px;">
      <img 
        src="https://blog-img.051088.xyz/%E6%9C%80%E7%BB%88%E6%95%88%E6%9E%9C.png" 
        alt="WeClone 训练效果示例：与AI数字分身的对话截图2"
        style="
          width: 100%;
          height: auto;
          object-fit: contain;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        " 
        loading="lazy"
      />
    </div>
  </div>
</details>


------

## 简介（废话版）

WeClone 项目官方推荐使用 **Linux 环境** 进行部署。在实际操作中我们也发现，相较于 Windows 或 macOS，Linux 系统对大多数深度学习库支持更好，资源调度更高效，更适合模型训练等计算密集型任务。

同时，由于 Windows 或 macOS 用户本地设备的性能——尤其是显存容量——往往难以满足大模型微调的需求，因此租用具备更高算力的 Linux 云服务器，也成为一种常见且现实的选择。

不过，对于习惯图形界面操作的初学者来说，Linux 尤其是无图形界面的云服务器，可能会带来一定的上手门槛。此外，WeClone 所采用的 **QLoRA 微调流程** 及其他关键细节虽然在官方文档中有所提及，但讲解相对简略，对缺乏深度学习经验的用户来说，依然存在不少理解与操作上的困难。

因此，本文将作为项目 [README](https://github.com/xming521/WeClone/?tab=readme-ov-file) 的**补充指南**，专为新手用户撰写，手把手带你完成从云服务器租用、环境搭建，到训练出属于你自己的 AI 克隆体的完整流程。

> ⚠️ **重要提示：**
> WeClone 项目仍在持续迭代中，目前版本为 `v0.2.2`。微调效果受多种因素影响，如模型规模、数据数量与质量等。一般而言：**模型越大、数据越多、语言风格越统一，生成的数字分身就越接近原始人格特征。**
> 本文旨在提供一个可操作的实践参考，实际部署过程中可能仍会遇到个别技术问题，敬请理解与探索。

> 💡 **温馨提示：**
>
> 关于租用显卡训练的成本问题：若使用项目默认的 **7B 模型**，并按文档教程步骤操作，整个训练过程的总花费**通常不超过 5 元**。

> ⚠️⚠️⚠️ **免责声明：**
>
> 本教程以 AutoDL 算力云平台为例进行演示。但需特别说明：**笔者及 WeClone 项目均与 AutoDL 平台无任何商务合作关系**，所涉平台与工具仅为实践所选，不代表推荐或背书。

------

在正式开始前，请务必注意：

> ⚠️ **隐私第一！**
>
> 请务必妥善保护自己的聊天记录及个人信息，**切勿上传至公共平台**，并确保本项目不被用于任何非法用途。使用者应对自己的数据使用和行为承担全部责任。

------

## 租借云服务器

[AutoDL算力云 ](https://www.autodl.com/home)是一个提供GPU租用服务的平台，主要面向深度学习和人工智能领域的研究者和开发者。用户可以在AutoDL上租用GPU服务器，进行深度学习模型的训练和实验。平台提供了多种GPU资源，用户可以根据自己的需求和预算选择合适的GPU型号和配置。

首先登陆[AutoDL算力云 ](https://www.autodl.com/home)，注册并完成实名认证（如果是学生可以完成学生认证，在校期间一直享95折优惠）。在“充值”界面点击“其他金额”根据，充值自定义金额（不充值没法租显卡）。充值后点击“算力市场”挑选显卡。

<img src="https://blog-img.051088.xyz/linux003.png" style="zoom: 67%;" alt="AutoDL主界面" />



## 服务器配置选择

运行 WeClone，尤其是在执行模型微调阶段时，对硬件配置要求较高，其中**显存（VRAM）是关键因素**。你需要根据所选模型的大小，合理选择具备足够显存的 GPU 服务器。

项目默认使用 [`Qwen2.5-7B-Instruct`](https://www.modelscope.cn/models/Qwen/Qwen2.5-7B-Instruct) 模型，并采用 **LoRA** 方法进行参数高效微调，对显存的最低需求约为 **16GB**。

下表整理了不同模型规模和微调方法下的显存需求（数据参考自 [LLaMA Factory](https://github.com/hiyouga/LLaMA-Factory)）：

| 微调方法                        | 精度 (bits) | 7B 模型 | 14B 模型 | 30B 模型 | 70B 模型 | `x`B 模型 |
| ------------------------------- | ----------- | ------- | -------- | -------- | -------- | --------- |
| Full (`bf16` / `fp16`)          | 32          | 120GB   | 240GB    | 600GB    | 1200GB   | `18x` GB  |
| Full (`pure_bf16`)              | 16          | 60GB    | 120GB    | 300GB    | 600GB    | `8x` GB   |
| Freeze / LoRA / GaLore / APOLLO | 16          | 16GB    | 32GB     | 64GB     | 160GB    | `2x` GB   |
| QLoRA                           | 8           | 10GB    | 20GB     | 40GB     | 80GB     | `x` GB    |
| QLoRA                           | 4           | 6GB     | 12GB     | 24GB     | 48GB     | `x/2` GB  |
| QLoRA                           | 2           | 4GB     | 8GB      | 16GB     | 24GB     | `x/4` GB  |



此外，AutoDL 等云平台默认提供 **30GB 系统盘** 和 **50GB 数据盘**（我们通常将数据、模型及缓存文件放在数据盘）。对 7B 或 14B 模型来说，这一容量通常是充足的；但若你计划训练 30B 或更大规模的模型，**建议提前扩容数据盘**，以免中途因存储不足导致训练失败。

对于不同 GPU 服务器的配置与性能，可参考 AutoDL 帮助文档中的[GPU型号简介](https://www.autodl.com/docs/gpu/#gpu_2)，里面提供了各型号 GPU 的介绍与选择建议。7B模型推荐直接租4090，经笔者测试，其cuda版本和性能均满足项目要求，且在不使用QLora的条件下也能完成各部分训练。

值得注意的是，不同版本 GPU 所支持的 **CUDA 版本** 并不一致。本项目推荐使用 **CUDA 12.4 及以上版本**，部分用户反馈使用 CUDA 11.x 也能成功部署，但笔者**未在此版本上亲测**，建议优先选择官方推荐版本以避免不必要的兼容性问题。

> 📌 **提示**
>  若你打算采用 **QLoRA** 微调方式，请继续阅读后续章节“[修改配置文件 (settings.jsonc)](#启用-QLoRA-（可选配置）)”，了解如何正确配置微调策略与参数。

## **服务器购买与初始化**

在明确自身需求后，你可以前往 **算力市场**，选择合适的 GPU 服务器，并进入「**创建实例**」页面。

![img](https://blog-img.051088.xyz/linux004.png)

在该界面按如下路径选择镜像：
 **镜像 → 基础镜像 → PyTorch → 2.5.1 → Python 3.10 (Ubuntu 22.04) → CUDA 12.4**

确认无误后，点击右下角「**创建并开机**」，即完成服务器的购买与初始化。

如果出现如下提示：

> “镜像的 CUDA 版本高于主机支持的最高 CUDA 版本，将导致无法开机，请重新选择主机/镜像。”

则说明你所选 GPU 不支持 CUDA 12.4。此时可以选择较低版本的 PyTorch 镜像（如 **2.1.2**），以匹配当前算力资源的兼容性。

![img](https://blog-img.051088.xyz/linux005-1.png)

## 环境配置 

### 连接服务器

成功创建实例后，你将进入**「容器实例」**页面。在 AutoDL 提供的环境中，你可以通过 **SSH 登录** 和 **在线 JupyterLab** 两种方式连接并操作服务器。推荐使用 **VS Code 的 Remote-SSH 插件** 进行远程开发，同时结合在线 JupyterLab 实现便捷的文件上传。

此外，在「快捷工具」中还可找到 **【AutoPanel】** 入口，用于实时监测远程服务器的 GPU、CPU、内存与磁盘使用情况，便于资源管理与调试。

![img](https://blog-img.051088.xyz/linux006-1.png)

> 💡 **新手提示**：
> 如果你尚未安装 **VS Code**，或不熟悉如何通过它连接到**Auto DL**远程服务器，可以参考以下教程：
> [VSCode 连接远程服务器（傻瓜式教学） - CSDN 博客](https://blog.csdn.net/zhaxun/article/details/120568402)
>
> [VS Code远程开发Auto DL（Auto DL官方文档）](https://www.autodl.com/docs/vscode/)

连接成功后，建议首先切换到数据盘目录：

```bash
cd /root/autodl-tmp
```

WeClone 项目将被部署在该目录下。

> 📁 若你希望进一步了解 AutoDL 环境下的目录结构与作用，可参阅官方文档：[容器实例概要](https://www.autodl.com/docs/env/)

### Git 版本控制工具

WeClone 项目的代码托管在 GitHub 上，因此你需要预先安装 **Git** 工具来克隆项目仓库。

如果你使用的是基于 Ubuntu 的系统，可直接运行以下命令进行安装：

```bash
apt-get update && apt-get install git
```

对于其他 Linux 发行版或安装方式，请参考：
 [Git 安装与配置教程 - 菜鸟教程](https://www.runoob.com/git/git-install-setup.html)

### 加速 GitHub 克隆速度

在国内访问 GitHub 往往存在网速瓶颈。AutoDL 环境提供了 **学术网络加速工具**，你可以通过以下命令启用：

```bash
source /etc/network_turbo  # 启用学术加速
```

若后续无需加速，可使用以下命令关闭代理环境变量：

```bash
unset http_proxy && unset https_proxy
```

### **创建虚拟环境并安装 WeClone 依赖**

`uv`是一个由 Astral 开发的快速 Python 包管理器。推荐使用 `uv` 创建虚拟环境并安装项目依赖，可以避免包版本冲突。

> 注：项目尚未提供 `requirements.txt`，使用其他命令（如 `conda`）易导致依赖版本冲突。

* **安装 uv (推荐的包管理器)**
  打开命令提示符 (CMD) 或 PowerShell，使用 pip 安装 uv：

  ```bash
  pip install uv
  ```

1. （直接跳过）**cuda安装**：

   由于在创建实例时Auto DL已经为我们配置好了cuda，所以这里不需要再重新安装了。


2. **克隆 WeClone 项目：**
   打开 CMD 或 PowerShell，导航到你希望存放项目的目录，然后克隆仓库：

   ```bash
   git clone https://github.com/xming521/WeClone.git
   cd WeClone
   ```

3. **创建并激活虚拟环境 (使用 uv)：**

   在 `WeClone` 项目根目录下执行：

   ```bash
   uv venv .venv --python=3.10  # 你可以指定已安装的 Python 3.10+ 版本
   source .venv/bin/activate
   ```

   激活成功后，你的命令行提示符前通常会显示 `(.venv)`。

4. **安装项目主要依赖：**

   ```bash
   uv pip install --group main -e .
   ```

   此命令将读取项目中依赖配置并安装所有库。


5. **（ `pytorch`安装失败再看）手动安装 `pytorch`**


    <details>
      <summary>手动安装 PyTorch 参考教程</summary>
      <p> 网络环境不稳定的情况下安装PyTorch有一定概率会出错，所以可以在环境内安装好 PyTorch。推荐从一些国内镜像源下载好 PyTorch 安装包后在本地离线安装。可以参考下面的教程，但是注意教程中使用的是下载官方包的链接，需要替换成国内镜像源的对应网站。</p>
      <p><strong>参考教程：</strong><a href="https://blog.csdn.net/weixin_44956153/article/details/142303905" target="_blank">PyTorch 离线版本安装教程</a></p>
      安装完后记得重新跑一下`uv pip install --group main -e .`把漏掉的包重新安装上
    </details>


6. **测试 CUDA 环境 (NVIDIA GPU 用户)：**
   安装完依赖后（特别是 PyTorch），运行以下命令测试 CUDA 是否配置正确并能被 PyTorch 识别：

   ```bash
   python -c "import torch; print('CUDA是否可用:', torch.cuda.is_available()); print('CUDA版本:', torch.version.cuda); print('PyTorch版本:', torch.__version__)"
   ```

   如果 `CUDA是否可用:` 显示 `True`，则表示配置成功。

7. **复制配置文件模板**

   将配置文件模板复制一份并重命名为`settings.jsonc`，后续配置修改在此文件进行：

   ```bash
   cp settings.template.jsonc settings.jsonc
   ```

8. **(可选) 安装 FlashAttention：**
   为了加速训练和推理（如果你的硬件支持），可以尝试安装 FlashAttention。

   可以直接尝试：

   ```bash
   uv pip install flash-attn --no-build-isolation
   ```

   > ⚠️Flash Attention 仅适用于 Turing、Ampere、Ada 和 Hopper 架构的 NVIDIA GPU（如 A100、H100、T4、RTX 2080、RTX 3090 等），不支持 Volta 架构的 V100。

   <details>

   <summary>如果失败再用下面方法：</summary>

   **再次检查本地python、torch、cuda的版本**（如果你很清楚你当前的配置可以不用检查）

   ```bash
   python --version &&
   python -c "import torch; print(torch.__version__); print(torch.cuda.is_available())" &&
   nvcc -V
   ```

   执行以上命令，得到你的`python`、`torch`和`cuda`版本。正常来讲你会得到下面的结果：

   ```bash
   Python 3.10.12 #python版本，应该是3.10
   2.6.0+cu124 #你的torch版本，安教程来安装的应该是2.6.0
   True #CUDA可用
   nvcc: NVIDIA (R) Cuda compiler driver
   Copyright (c) 2005-2024 NVIDIA Corporation
   Built on Thu_Sep_12_02:18:05_PDT_2024
   Cuda compilation tools, release 12.6, V12.6.77
   Build cuda_12.6.r12.6/compiler.34841621_0 #cuda版本，应该大于12.4
   ```

   确定自己的相关版本后，在[Flash-attention下载地址](https://github.com/Dao-AILab/flash-attention/releases)选择对应的`whl`文件用`pip install`来安装，例如：

   ```bash
   wget https://github.com/Dao-AILab/flash-attention/releases/download/v2.7.4.post1/flash_attn-2.7.4.post1+cu12torch2.6cxx11abiTRUE-cp310-cp310-linux_x86_64.whl
   pip install flash_attn-2.7.4.post1+cu12torch2.6cxx11abiTRUE-cp310-cp310-linux_x86_64.whl
   ```

   </details>

   

---

**到这里，恭喜你完成了全部的环境配置。你已经完成了整个项目部署最难的部分！！！**

> 💡 **省钱小技巧**
>
> 在接下来的 [模型下载](#模型下载) 环节中，通常需要较长等待时间，但此时并不需要使用 GPU。为了节省成本，**AutoDL** 提供了一种 **“无卡模式”开机** 方案，费用仅为 **0.1 元/小时**。你可以在“容器实例”管理页面先将当前实例 **关机**，然后使用 **无卡模式重新开机**，即可在无需 GPU 的情况下完成模型下载等任务。
>
> 如果你想了解更多细节，可以查看 AutoDL 帮助文档中的 [省钱绝招](https://www.autodl.com/docs/save_money/)。
>
> ⚠️ **注意**：关机后如果你希望以 **有卡模式**（即正常方式）重新开机，有可能会遇到 `该主机空闲GPU不足` 的提示。此时你需要等待 GPU 空闲后，才能继续进行 [数据预处理](#数据预处理) 及之后依赖 GPU 的步骤。

## 模型下载

>如果你是使用**无卡模式重新开机**进入的，记得重新进入项目根目录并激活环境：
>```bash
>cd /root/autodl-tmp/WeClone
>source .venv/bin/activate
>```

WeClone 默认使用 Qwen2.5-7B-Instruct 模型，你也可以选择其他你想要使用的模型（不推荐使用深度思考模型）。这里提供两种下载方法：

### **方法一：使用`Git`安装（WeClone官方推荐）**

#### **安装 Git LFS：**

在 终端运行命令：

```bash
apt update # 更新包列表
apt install git-lfs # 安装 git-lfs(ubuntu)
git lfs install # 验证是否安装成功
```
若显示：`Git LFS initialized`则安装成功。

> 每个用户只需执行一次此命令。

#### **克隆模型仓库：**

推荐使用 [魔搭社区（ModelScope）](https://www.modelscope.cn/models) 的模型资源，默认下载 `Qwen2.5-7B-Instruct` 模型。你也可以根据自己的情况和喜好选择该平台的其他模型。

在WeClone根目录下执行以下命令：

```bash
git clone https://www.modelscope.cn/Qwen/Qwen2.5-7B-Instruct.git
# 如果你希望下载完成后自动关机，执行下面这条命令
git clone https://www.modelscope.cn/Qwen/Qwen2.5-7B-Instruct.git && /usr/bin/shutdown
```
> ⚠️ 注：
>
> 1. 模型文件较大，下载时间可能较长，请确保磁盘空间充足（建议至少 20GB）。
> 2. 关于自动关机，用`;`拼接`/usr/bin/shutdown`意味着前边的指令不管执行成功与否，都会执行`shutdown`命令； 用`&&`拼接表示前边的命令执行成功后才会执行`shutdown`。请根据自己的需要选择。

### 方法二：使用`ModelScope` 命令行工具下载（更快）

首先安装`modelscope`库：

```bash
uv pip install modelscope
```

在项目根目录执行下面的命令：

```bash
modelscope download --model Qwen/Qwen2.5-7B-Instruct --local_dir ./Qwen2.5-7B-Instruct
```

等待下载完成即可。

### 修改模型路径或模板

如果你选择了其他模型、将模型下载到了不同目录或者是使用`ModelScope SDK`下载的模型，请在 `settings.jsonc` 中修改路径：

```json
"common_args": {
    "model_name_or_path": "你的模型路径",
     "template": "你的模型模板",
}
```



## 使用 PyWxDump 提取微信聊天记录

要微调模型，首先你需要你的微信聊天数据。

### **下载并安装PyWxDump：**

`PyWxDump`是一个用于提取微信聊天记录的工具。由于`PyWxDump`目前仅确认在Windows环境下正常运行，所以这里切换到你的**本地Windows环境**。

**在Windows环境下**访问 [PyWxDump GitHub 仓库](https://github.com/xaoyaoo/PyWxDump) 获取最新版本安装包。安装教程可直接参考[PyWxDump官方教程](https://github.com/xaoyaoo/PyWxDump/blob/master/doc/UserGuide.md)

### **导出数据：**

* 根据 PyWxDump 的指南，运行软件并解密你的微信数据库
* 在 PyWxDump 中选择“聊天备份”功能
* 导出类型选择 CSV
* 你可以选择导出与多个联系人或群聊的聊天记录（当前版本不建议使用群聊记录）

> 大数据量的导出如果遇到问题，可以参考官方QQ群里**浮游**大佬的教程（第二章内容）：[Windows AI 模型部署与训练指南](https://img.justlikemaki.vip/file/1747668628253_WeClone注意事项.html)

### **整理数据：**

* PyWxDump 导出的 CSV 文件通常位于其运行目录下的 `wxdump_tmp/export` 文件夹中。

* 将整个 `csv` 文件夹 (其中可能包含多个代表不同聊天对象的子文件夹，每个子文件夹里是对应的聊天记录CSV文件) 压缩为`.zip`或者`.tar`格式，然后在刚刚Auto DL的**「容器实例」**页面点击「快捷工具」中的**在线 JupyterLab** 进入JupyterLab。


> （如果你不小心退出了，可以通过**Auto DL主页→控制台→容器实例**返回页面）

- 在JupyterLab依次点击文件夹进入`/root/autodl-tmp/WeClone/dataset/`目录下，点击上传按钮将压缩包上传至该目录下。（可参考下面的`PyWxDump操作及文件上传流程图解`）

- 回到**VS Code**，根据你压缩包的文件类型，在项目根目录执行下面对应命令：

  ```bash
  # 解压zip文件 
  unzip  /root/autodl-tmp/WeClone/dataset/csv.zip -d /root/autodl-tmp/WeClone/dataset/csv
  apt-get update && apt-get install -y unzip #如果提示没有zip命令，使用此命令安装
  ```

  ```bash
  # 解压tar文件
  tar -xf/root/autodl-tmp/WeClone/dataset/csv.tar -C /root/autodl-tmp/WeClone/dataset/csv
  ```

- 最终的目录结构应类似于：`WeClone/dataset/csv/张三/聊天记录.csv` 等。

### PyWxDump操作流程图解

<details><summary><strong>🔧 PyWxDump操作流程图解（点击展开）</strong></summary>

#### 启动PyWxDump工具
<p align="center">
  <img src="https://blog-img.051088.xyz/pywxdump%E6%95%99%E7%A8%8B0.png" 
       alt="PyWxDump工具主界面截图，显示微信数据导出工具的启动界面和功能选项" 
       title="PyWxDump主界面"
       width="90%" 
       loading="lazy"/>
</p>

#### 选择微信账户
<p align="center">
  <img src="https://blog-img.051088.xyz/pywxdump%E6%95%99%E7%A8%8B1.png" 
       alt="PyWxDump配置界面，展示微信安装路径检测和数据库文件定位设置" 
       title="微信路径配置"
       width="90%" 
       loading="lazy"/>
</p>

#### 解密聊天数据库
<p align="center">
  <img src="https://blog-img.051088.xyz/pywxdump%E6%95%99%E7%A8%8B3.png" 
       alt="微信聊天记录解密界面，显示数据库解密密钥获取和验证过程" 
       title="数据库解密过程"
       width="90%" 
       loading="lazy"/>
</p>

#### 导出聊天记录
<p align="center">
  <img src="https://blog-img.051088.xyz/pywxdump%E6%95%99%E7%A8%8B4.png" 
       alt="聊天记录导出进度界面，展示数据提取和格式转换的实时进度" 
       title="数据导出进度"
       width="90%" 
       loading="lazy"/>
</p>

#### 查看导出结果
<p align="center">
  <img src="https://blog-img.051088.xyz/pywxdump%E6%95%99%E7%A8%8B002.png" 
       alt="导出结果预览界面，显示成功提取的微信聊天记录数据和文件结构" 
       title="导出结果预览"
       width="90%" 
       loading="lazy"/>
</p>

#### 整理和后续处理
<p align="center">
  <img src="https://blog-img.051088.xyz/pywxdump%E6%95%99%E7%A8%8B001.png" 
       alt="最终数据整理界面，展示导出文件的组织结构和后续处理选项" 
       title="数据整理界面"
       width="90%" 
       loading="lazy"/>
</p>

</details>



---



## 数据预处理

原始的聊天记录需要经过预处理才能用于模型训练。

* **默认处理：** WeClone 项目默认会去除数据中的手机号、身份证号、邮箱和网址。
* **自定义过滤（可选）：** 项目提供了一个禁用词词库 ，在最新的代码中这个词库被移动到了`settings.jsonc`的`blocked_words`。你可以向其中添加不希望出现在训练数据中的词句（包含禁用词的整句会被过滤掉）。

### **执行预处理脚本：**

在激活虚拟环境的命令行中，进入 WeClone 项目根目录，运行：

```bash
weclone-cli make-dataset  #在WeClone根目录下执行该命令
```

* `WeClone` 默认启用了 `clean_dataset` 配置中的 `enable_clean` 选项，会对原始数据进行清洗，以提升后续处理效果。如果你不打算使用该功能，请将其至为`"enable_clean": false`。

* 当前系统支持使用 `llm judge` 对聊天记录进行打分，提供 **vllm 离线推理** 和 **API 在线推理** 两种方式。你可以通过将 `settings.jsonc` 文件中的 `"online_llm_clear": false` 修改为 `true` 来启用 API 在线推理模式，并配置相应的 `base_url`、`llm_api_key`、`model_name` 等参数。所有兼容 OpenAI 接口的模型均可接入，但需注意使用 API 可能带来额外成本。

* 在获得 `llm 打分分数分布情况` 后，可通过设置 `accept_score` 参数筛选可接受的分数区间，同时可适当降低 `train_sft_args` 中的 `lora_dropout` 参数，以提升模型的拟合效果。

* 预处理完成后，数据通常会保存在 `\WeClone\dataset\res_csv\sft` 目录或其子目录下的 `sft-my.json` 文件中。

### 💡 使用 vLLM 时的注意事项

如果你选择使用**vllm进行离线推理**，且显存有限，需要启用**vLLM的`bitsandbytes`量化加载**，否则这一步也可能会爆显存。进一步调整、优化`vllm`参数请查询[ vLLM 引擎参数 ](https://docs.vllm.com.cn/en/latest/serving/engine_args.html#engine-args)

```python
# 在下面代码中的engine_args新增参数
# weclone/core/inference/vllm_infer.py

engine_args = {
    "model": model_args.model_name_or_path,
    "trust_remote_code": True,
    "dtype": model_args.infer_dtype
    "max_model_len": cutoff_len + max_new_tokens,
    "enable_lora": model_args.adapter_name_or_path is not None,
    "enable_prefix_caching": True,

    # ↓ 新增内容 ↓
    "quantization": "bitsandbytes",
    "load_format": "bitsandbytes",
}
```

>[!TIP]
>如果遇到报错`ImportError: Please install bitsandbytes>=0.45.3`，可以尝试重新安装`bitsandbytes`：
>
>```bash
>#使用uv安装 bitsandbytes，建议科学上网
>uv pip install bitsandbytes>=0.39.0
>```

* 此外如果你使用了型号比较老的GPU（例如，计算能力 Compute Capability 低于 8.0 的NVIDIA GPU，如Tesla T4, V100, GTX 10xx/20xx系列等）可能会遇到下面报错：

  ```bash
  ValueError: Bfloat16 is only supported on GPUs with compute capability of at least 8.0. Your xxx GPU has compute capability xx. You can use float16 instead by explicitly setting the idtype flag in CLI, for ecample: --dtype=half.
  ```

  这是因为： `bfloat16` (BF16) 是一种较新的浮点数格式，需要GPU硬件达到一定的计算能力（通常是NVIDIA Ampere架构及更新的GPU，计算能力 >= 8.0）才能原生支持。如果模型默认尝试以 `bfloat16` 加载，而你的GPU不支持，就会出现这个错误。这时候你可以尝试在原本的`CLI`后加上`--dtype=half`然后重新执行：

  ```bash
  weclone-cli make-dataset --dtype=half
  ```

  或者在`settings.jsonc`中增加以下参数，然后重新执行`weclone-cli make-dataset`，看问题是否解决。

  ```json
  "infer_args": {
      "repetition_penalty": 1.2,
      "temperature": 0.5,
      "max_length": 50,
      "top_p": 0.65,
      "infer_dtype": "float16"  // 添加这一行
  }
  ```

## 修改配置文件 (`settings.jsonc`)

WeClone 项目的训练与推理核心配置集中在 `settings.jsonc` 文件中。你需要根据实际使用场景，**适当调整其中的关键参数**。

请打开项目根目录下的 `WeClone/settings.jsonc` 文件，重点关注以下配置项：

**训练相关参数：**

- **`per_device_train_batch_size`** 和 **`gradient_accumulation_steps`**：
   控制单张显卡的显存占用与有效 batch size。可根据显存大小调整，达到资源利用与训练稳定性的平衡。

    >**调节建议：**
    >
    > -  **显存较小**：减小 `per_device_train_batch_size`，增大 `gradient_accumulation_steps`；
    > -  **显存充足**：可适当增大 `per_device_train_batch_size`，以加快训练速度；

- **`train_sft_args` 中的参数**（适用于 SFT 阶段微调）：
  可根据数据量与任务复杂度调整以下参数：

  - `num_train_epochs`：训练轮数；
  - `lora_rank`：LoRA 子空间维度，越高越耗显存；
  - `lora_dropout`：LoRA dropout 比例，用于防止过拟合。

- **建议：**

   - 配置文件中包含详细注释，建议逐条阅读理解后再做修改。
   - 若你希望使用其他微调策略（如全量微调、Freeze 等），请确保 `finetuning_type` 与相关参数保持一致。
   - 进一步了解参数，请查看`LLaMA Factory`官方文档：[参数介绍 - LLaMA Factory](https://llamafactory.readthedocs.io/zh-cn/latest/advanced/arguments.html)


### **启用 QLoRA （可选配置）**

如果你希望进一步减少显存消耗（尤其在显存紧张场景下），可以开启 **QLoRA 量化加速训练**。

在 `settings.jsonc` 的 `common_args` 字段中添加以下参数：

```json
// 开启 QLora
"quantization_bit": 4, //支持值：2 / 4 / 8，数值越低显存越省，但推理速度和效果可能略有下降。
"quantization_type": "nf4",
"double_quantization": true,
"quantization_method": "bitsandbytes",
```

### 其他加速机制（可选配置）

#### **Unsloth**

- [Unsloth](https://github.com/unslothai/unsloth/) 框架支持 Llama, Mistral, Phi-3, Gemma, Yi, DeepSeek, Qwen等大语言模型并且支持 4-bit 和 16-bit 的 QLoRA/LoRA 微调，该框架在提高运算速度的同时还**减少了显存占用**。如果你还想进一步**减少显存占用**，可以使用`Unsloth`加速。

- 如果想使用 `Unsloth`, 在 `settings.jsonc` 的 `common_args` 字段中添加以下参数：

 ```json
 // 开启Unsloth
 "use_unsloth": true,
 ```

> ⚠️安装使用`unsloth`有可能会导致把`transformers`升级版本进而引发报错，需要谨慎使用。如果解决不了，请重新执行以下命令，将其降级至之前版本：
>
> ```bash
> uv pip install --group main -e .
> ```

#### **Liger Kernel**

- [Liger Kernel](https://github.com/linkedin/Liger-Kernel/) 是一个大语言模型训练的性能优化框架, 可有效地**提高吞吐量并减少内存占用**。如果你还想进一步**减少显存占用**，可以使用`Unsloth`加速。
- 如果想使用` Liger Kernel`,在 `settings.jsonc` 的 `common_args` 字段中添加以下参数：


```json
"enable_liger_kernel": true,
```

> ⚠️ **注意：**
>
> 在启用QLora、Unsloth等机制后，其他可能会需要额外安装一些项目依赖包中缺失的包：
>
> ```bash
> #使用uv安装依赖
> 例如：
> uv pip install bitsandbytes>=0.39.0 #QLora需要
> uv pip install unsloth # unsloth需要
> ```
>   
> 如有其他包缺失，也请依次使用`uv pip install`来安装

**调整建议：**

- 配置文件中包含详细注释，建议逐条阅读理解后再做修改。
- 若你希望使用其他微调策略（如全量微调、Freeze、QLoRA 等），请确保 `finetuning_type` 与相关参数保持一致。
- 进一步了解参数详情请查看`LLaMA Factory`官方文档：[参数介绍 - LLaMA Factory](https://llamafactory.readthedocs.io/zh-cn/latest/advanced/arguments.html)
- 关于`unsloth`的报错笔者暂未解决，如想进一步了解请参考[Windows AI 模型部署与训练指南](https://img.justlikemaki.vip/file/1747668628253_WeClone注意事项.html)


---
**到这里你已经完成所有前期的配置工作了，接下来即将开始正式推理、训练模型！！！**



## 微调模型

配置完成后，就可以开始训练了。

### 单卡训练

在激活虚拟环境的命令行中，根目录下运行：

```bash
weclone-cli train-sft
```

> 多卡环境单卡训练，需要先执行 `export CUDA_VISIBLE_DEVICES=0`

训练脚本会读取 `settings.jsonc` 中的配置并开始微调。留意终端输出，观察 loss 是否在正常下降。

### 多卡训练

如果你有多张 NVIDIA GPU 并希望进行多卡训练：

1.  **安装 Deepspeed：**

    ```bash
    uv pip install deepspeed
    ```

    > ⚠️⚠️⚠️注意：
    > Deepspeed 在 Windows 上的原生支持可能有限或配置复杂。官方主要支持 Linux。如果遇到安装或运行问题，可能需要查阅 Deepspeed 官方文档或社区寻求 Windows 解决方案，或者考虑在 WSL2 环境下使用 Deepspeed。

2.  **配置 Deepspeed：**
    在 `settings.jsonc` 中，找到 `deepspeed` 配置项，并取消其注释或根据需要填写 Deepspeed 的 JSON 配置文件路径。

3.  **启动多卡训练：**

    ```bash
    deepspeed --num_gpus=<使用显卡数量> weclone/train/train_sft.py
    ```

    例如，使用2张显卡：`deepspeed --num_gpus=2 weclone/train/train_sft.py`

训练完成后，微调好的 LoRA 适配器权重会保存在你 `settings.jsonc` 中指定的 `output_dir`。

## 推理 (与你的数字分身对话)

微调完成后，你可以通过以下几种方式与你的数字分身进行交互。

### 使用浏览器 Demo 简单推理

这是一种快速测试模型效果并调整推理参数（如 `temperature`, `top_p`）的方法。
在激活虚拟环境的命令行中，运行：

```bash
weclone-cli webchat-demo
```

脚本会启动一个服务器本地 Web 服务 (通常在 `http://127.0.0.1:7860` 或类似地址)，在这里测试出的最佳推理参数可以更新回 `settings.jsonc` 的 `infer_args` 部分，供后续使用。

> ⚠️注意：这里你还没办法在自己本地浏览器访问 `http://127.0.0.1:7860` ，需要在进行[SSH代理](#SSH代理)后才能访问。

### 使用 API 接口进行推理

WeClone 提供了一个 API 服务，可以供其他应用程序调用。

1. **启动 API 服务：**

   ```bash
   weclone-cli server
   ```

   服务启动后，通常会监听在服务器端的 `http://127.0.0.1:8005/v1` (具体地址和端口请查看终端输出或 `settings.jsonc` 中的配置)。

2. **通过 API 调用：**
   你可以使用任何 HTTP客户端 (如 Postman, curl，或 Python 的 `requests` 库) 向该 API 发送请求。API 通常兼容 OpenAI 的格式。同时也可以将其[部署到聊天机器人](#部署到聊天机器人)。

### **量化与本地部署（可选）**

可以考虑使用 `llama.app` 等工具对训练好的模型进行量化处理，并导出`gguf`模型，在本地实现高效推理。

这里可以参考官方QQ群里**浮游**大佬的教程（第四章内容）：[Windows AI 模型部署与训练指南](https://img.justlikemaki.vip/file/1747668628253_WeClone注意事项.html)

### 使用常见聊天问题测试

项目还提供了一个脚本，可以使用预设的问题列表来测试模型。

1.  确保 API 服务 (`weclone-cli server`) 正在运行。
2.  打开一个新的命令行窗口 (并激活虚拟环境)，然后运行：
    ```bash
    weclone-cli test-model
    ```
    测试结果会输出到 `test_result-my.txt`。

## **SSH代理**

由于 **AutoDL 实例不具备独立公网 IP**，无法直接开放端口给外部访问。因此，我们需要通过 **SSH 隧道** 实现端口转发：将远程实例中的端口代理到本地，或反向将本地端口代理至实例。否则你将无法从本地计算机调用远程服务接口（如 API）。

AutoDL 提供了两种主流代理方式：

- 图形界面工具（适用于 **Windows** 用户）
- SSH 命令行代理（适用于 **Linux / macOS** 用户）

### **方法一：[图形界面工具](https://www.autodl.com/docs/ssh_proxy/#_1)（Windows 专用）**

下载并解压 [AutoDL Windows 端口代理工具](https://autodl-public.ks3-cn-beijing.ksyuncs.com/tool/AutoDL-SSH-Tools.zip)，双击运行其中的 `.exe` 文件，无需安装。在工具界面中，只需填写要代理的端口号，即可轻松将远程端口映射到本地，或反向映射。

对于**WeClone项目**，你可以选择将**webchat-demo**对应的`7860`端口或者**server**对应的`8005`端口代理到本地。即在下图的**代理到本地端口**栏填写`7860`或者`8005`。

> ⚠️注意： 如需同时代理多个端口，请使用**英文逗号**分隔：`7860,8005`

<img src="https://www.autodl.com/docs/assets/2024-10-17-19-11-33-image.png" alt="img" style="zoom:50%;" />

### **方法二：[使用 SSH 命令代理](https://www.autodl.com/docs/ssh_proxy/#ssh_1)**

适用于 Linux、macOS 以及熟悉终端操作的 Windows 用户。

1. 在 AutoDL 实例中启动所需服务（如 `webchat-demo` 或 `server`）。
    这里以 `webchat-demo` 所使用的 `7860` 端口为例，如果要代理的是 `server`，只需将端口号改为 `8005`。

2. 在**本地电脑**的终端(cmd / powershell / terminal等)中执行代理命令：

    ```bash
    ssh -CNg -L 7860:127.0.0.1:7860 root@123.125.240.150 -p 42151
    ```

    其中`root@123.125.240.150`和`42151`分别是实例中SSH指令的访问地址与端口，请找到自己实例的ssh指令**做相应替换**。`7860:127.0.0.1:7860`是指代理实例内`7860`端口到本地的`7860`端口。

> 注意：执行完这条ssh命令，没有任何日志是正常的，只要没有要求重新输入密码或错误退出
>
> **Windows下的cmd/powershell如果一直提示密码错误，是因为无法粘贴，手动输入即可（正常不会显示正在输入的密码)**

3. 在本地浏览器中访问`http://127.0.0.1:7860`即可打开你部署的 `webchat-demo` 服务，注意这里的`7860`端口要和上述`7860:127.0.0.1:7860`中的端口保持一致。

> 💡 **补充：**
>
>  `server`服务是无法通过浏览器访问的，其端口用于[部署到聊天机器人](#部署到聊天机器人)或其他`api`服务。
>
> `http://127.0.0.1`和下文提到的`http://localhost`含义相同，都是本地回环地址。填写两者任意一种均可。
>
> 如果你还有其他问题，请访问[AutoDL帮助文档](https://www.autodl.com/docs/ssh_proxy/#_2)查看。

## 部署到聊天机器人

你可以通过 **AstrBot** 或 **LangBot** 将`server`服务部署到本地聊天机器人。接下来的操作需要在**本地计算机**完成。

### 通过 AstrBot 部署

<details>
    <summary>通过 AstrBot 部署到聊天机器人操作流程</summary>
    [AstrBot](https://github.com/AstrBotDevs/AstrBot) 是一个支持多平台的 LLM 聊天机器人框架，可以将你的 WeClone 模型部署到 QQ、微信、Telegram 等平台。

1. **部署 AstrBot：** 根据 AstrBot 官方文档的指引，在你的服务器或本地安装并配置好 AstrBot。

    [使用 Windows 一键安装器部署 AstrBot | AstrBot](https://astrbot.app/deploy/astrbot/windows.html)

2. **启动 WeClone API 服务：** 确保你的 `weclone-cli server` 正在运行，并且 AstrBot 可以访问到该服务的地址和端口。

3. **在 AstrBot 中新增服务提供商：**

     * 启动AstrBot ，并进入其web UI界面，一般是`http://localhost:6185`。
     * 依次点击**服务提供商**→**新增服务提供商**
     * 类型选择：OpenAI
     * API Base URL：填写你的 WeClone API 服务地址 (如果部署在本地则填写 `http://localhost:8005/v1`)。
     * 模型：可以填写一个占位符，如 `gpt-3.5-turbo` (因为实际使用的模型由 WeClone API 服务决定)。
     * API Key：随意填写一个即可（填写完记得回车或者点击右侧添加按钮）
     * 完成后点击“启用”和“保存”等待AstrBot 重启。

     <img src="https://blog-img.051088.xyz/AstrBo02.png" style="zoom:70%;" alt="AstrBot 中新增服务提供商配置图示"/>

4. **在 AstrBot 中部署消息平台：** 在“消息平台”界面配置 AstrBot ，以连接到你希望使用的聊天平台 (如微信、QQ 等)。不同消息平台应参照 [AstrBot官方文档](https://astrbot.app/) 。例如如果你想要部署到QQ，可以参考下面AstrBot提供的教程：[通过 NapCatQQ 协议实现端接入 QQ | AstrBot](https://astrbot.app/deploy/platform/aiocqhttp/napcat.html#通过-napcatqq-协议实现端接入-qq)

5. **关闭工具调用 (重要)：**
   微调后的模型主要用于模仿你的语言风格，通常不支持复杂的工具调用。在 AstrBot 对应的聊天平台中，向你的机器人发送指令关闭所有默认工具，以确保能看到微调效果：

   ```bash
   /tool off all
   ```

   你还可以在“插件管理”页面手动关闭系统插件。这里我只保留了`astrbot`、`session_controller`两个系统插件。

   ![](https://blog-img.051088.xyz/AstrBo03.png)

6. **设置系统提示词：**
   在 AstrBot 的配置中，为你的机器人设置**系统提示词 (System Prompt)**。这个提示词必须与你微调模型时在 `settings.jsonc` 中设置的 `default_system` **完全一致**。<img src="https://blog-img.051088.xyz/AstrBot%E6%95%99%E7%A8%8B01.png" alt="AstrBot 配置文件修改图示"/>

7. **其他功能**

   在“配置文件”界面还有其他很多配置，可以查询 [AstrBot官方文档](https://astrbot.app/) 自行调节。

8. **调整采样参数：**
   根据你在浏览器 Demo 或其他测试中得到的最佳效果，在 AstrBot 中调整模型的采样参数，如 `temperature`, `top_p`, `top_k` 等。具体配置方法请参考 AstrBot 文档中关于[配置自定义的模型参数 | AstrBot](https://astrbot.app/config/model-config.html)的部分。

> ⚠️
> 经常检查 `api_service.py` 的日志输出，确保 AstrBot 发送给大模型服务的请求参数 (如 system prompt, temperature 等) 与你微调和测试时期望的一致。

</details>



### 通过 LangBot 部署

<details>

<summary>通过 LangBot 部署到聊天机器人操作流程</summary>

[LangBot](https://github.com/RockChinQ/LangBot) 是一个开源的接入全球多种即时通信平台的 LLM 机器人平台，适合各种场景使用。将WeClone服务端接入LangBot的流程与接入AstrBot类似。下面是流程简介：

1. [部署 LangBot](https://github.com/RockChinQ/LangBot#-%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8)
2. 在 LangBot 中添加一个机器人
3. 在模型页添加新模型，名称`gpt-3.5-turbo`，供应商选择 OpenAI，填写 请求 URL 为 WeClone 的地址，详细连接方式可以参考[文档](https://docs.langbot.app/zh/workshop/network-details.html)，API Key 任意填写。

<img width="400px" alt="image" src="https://github.com/user-attachments/assets/fc167dea-7c93-4d94-9c5f-db709d0320ba" />

6. 在流水线配置中选择刚才添加的模型，或修改提示词配置

<img width="400px" alt="image" src="https://github.com/user-attachments/assets/dbb0fd0a-f760-42db-acd0-bb99c859b52e" />

</details>

### 通过 Dify 部署到工作流

<details> <summary>点击展开：Dify 部署 WeClone 到工作流的操作流程</summary>


[Dify](https://dify.ai/zh) 是一个开源的 LLM 应用开发平台，致力于帮助开发者快速构建生成式 AI 应用。它提供直观易用的界面，结合 AI 工作流、RAG 管道、代理功能与模型管理等特性，大幅简化了从原型构建到实际部署的流程。

你可以将 `WeClone` 中的模型部署到 Dify，并集成进你的工作流中，提升模型的可用性和交互能力。

以下是部署的基本流程：

1. **部署 Dify：**
   可参考 [Dify 官方文档](https://docs.dify.ai/zh-hans/introduction) 进行安装配置，或直接使用其提供的云服务。

-  [Dify 云服务地址](https://cloud.dify.ai/apps)
-  [Dify 社区版部署教程](https://docs.dify.ai/zh-hans/getting-started/install-self-hosted/readme)

2. **配置模型供应商：**
   进入 Dify 主界面，点击左侧菜单中的 **设置 → 模型供应商 → OpenAI → 添加模型**。
   按如下方式进行配置：

   - 模型名称：填写 `gpt-3.5-turbo` 或其他 GPT 模型名称；
   - API Key / 组织 ID：可填写任意值；
   - API Base：
     - 若使用 Docker 部署的 Dify，请填写：`http://host.docker.internal:8005/`
     - 若使用 Dify 云服务，需要将本地服务暴露至公网，填写：`http://<公网IP地址>:8005/`
       ⚠️ *出于安全考虑，不推荐直接将本地服务暴露至公网。*

   <img src="https://blog-img.051088.xyz/Dify.png" alt="Dify 配置示意图" style="zoom:67%;" />

3. **在工作流中插入 WeClone 模型节点**

   在 Dify 的工作流编辑器中，插入一个 **LLM 节点**，并将其绑定到刚才添加的模型（如 `gpt-3.5-turbo`）。
    随后，在该节点的 **System Prompt（SYSTEM）** 配置中填写 WeClone 模型训练时所使用的提示词。
    若你使用的是 WeClone 的默认配置，则应填入：

   ```text
   请你扮演一名人类，不要说自己是人工智能。
   ```

   这样，模型在工作流中就能保持一致的语气风格与角色设定。

   ![Dify 工作流插入 WeClone 节点示意图](https://blog-img.051088.xyz/Dify0.png)

   </details>

---

**现在，你的专属数字分身应该已经成功部署到聊天机器人平台了！快去和“它”聊聊天，看看效果如何吧。**

> 💡温馨提示：服务器用完记得关机！！！



## 问题解决与支持

  * **微调问题：** 可以参考 LLaMA Factory 的 [FAQs | 常见问题](https://github.com/hiyouga/LLaMA-Factory/issues/4614)，因为 WeClone 底层使用了 LLaMA Factory 的部分组件或类似逻辑。

  * **项目 Issues：** 查看 WeClone GitHub 仓库的 [Issues](https://github.com/xming521/WeClone/issues) 和 [Discussions](https://github.com/xming521/WeClone/discussions) 是否有类似问题和解决方案。

* <div style="display: flex; align-items: up; gap: 8px;">
    <span style="font-weight: bold;">项目官方群聊：</span>
    <a href="https://qm.qq.com/cgi-bin/qm/qr?k=wNdgbOVT6oFOJ2wlMLsolUXErW9ESLpk&jump_from=webapi&authKey=z/reOp6YLyvR4Tl2k2nYMsLoMC3w9/99ucgKMX0oRGlxDV/WbYnvq2QxODoIkfxn" target="_blank">
      <img src="https://img.shields.io/badge/QQ群-708067078-12B7F5?style=for-the-badge&logo=tencentqq&logoColor=white" alt="QQ群">
    </a>
    <a href="https://t.me/+JEdak4m0XEQ3NGNl" target="_blank">
      <img src="https://img.shields.io/badge/Telegram-WeClone-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram">
    </a>
  </div>

## 免责声明

> ⚠️ ⚠️ ⚠️ 
> 请勿用于非法用途，否则后果自负。
> 本教程仅供学习交流使用。任何违反法律法规、侵犯他人合法权益的行为，均与WeClone项目及笔者无关。严禁用于窃取他人隐私。

## 参考资料

- [xming521/WeClone – 从聊天记录创造数字分身的一站式解决方案](https://github.com/xming521/WeClone?tab=readme-ov-file)：项目主页，涵盖聊天记录处理、LoRA 微调、声音克隆等模块，本文主要基于项目README编写。
- [Windows AI 模型部署与训练指南](https://img.justlikemaki.vip/file/1747668628253_WeClone注意事项.html)：**浮游**大佬撰写的对Weclone部署的避坑指南，本文在编写中参考了很多部分内容。

> 其余引用链接已在正文中明确标注。
