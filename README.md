# k8s

## 虚拟机
全虚拟化和半虚拟化
### 1、VMware
这款虚拟机软件兼容性不错，VMware Tools也很强大，快照功能很快捷，方便，允许你在任意开机时刻创建系统快照和恢复，主要用于调试极易产生蓝屏的软件和工具，十分实用。有点不好的地方在于它安装时会虚拟两块网卡，还可以在设置中虚拟更多的虚拟网卡，一般来说使用桥接Bridge的方法就可以让虚拟机上网，基本没有用过NAT方式。VMware和VirtualBox一样都是会修改电脑本身的网卡设置的。
官方地址：https://www.vmware.com/cn.html
### 2、VirtualBox
Sun公司的产品，属于轻量级的虚拟机平台，而且是开源的，完整安装包很小，不像VMware有几百兆，功能相对也很精简，快照功能这里叫备份和快速修复，在不同的快照间跳转用起来感觉不是很方便，也不能实现文件拖拽的功能。文件共享方面，叫做“数据空间”，在关机的状态下，先在设置中选择主机的一个目录来加入到固定分配栏中。然后在虚拟机中右键单击我的电脑选择“映射网络驱动器”，在文件夹浏览中整个网络里的”VirtualBox Shared Foders”选择刚才共享的那个文件夹，确定后就可以将其映射为我的电脑中的一个盘符使用了。
官方地址：
https://www.virtualbox.org/wiki/Downloads （旧）
https://www.oracle.com/virtualization/technologies/vm/downloads/virtualbox-downloads.html
### Xen
Xen 是一个开放源代码虚拟机监视器，由剑桥大学开发。它打算在单个计算机上运行多达100个满特征的操作系统。操作系统必须进行显式地修改(“移植”)以在Xen上运行。这使得Xen无需特殊硬件支持，就能达到高性能的虚拟化。
官方地址：http://www.xenserver.org （旧）
官方地址：https://www.citrix.com/zh-cn/products/citrix-hypervisor/
### KVM
KVM (全称是 Kernel-based Virtual Machine) 是 Linux 下 x86 硬件平台上的全功能虚拟化解决方案，包含一个可加载的内核模块 kvm.ko，提供和虚拟化核心架构和处理器规范模块。使用 KVM 可允许多个包括 Linux 和 Windows 每个虚拟机有私有的硬件，包括网卡、磁盘以及图形适配卡等。
官方地址：https://www.linux-kvm.org/page/Main_Page
### Proxmox 
Proxmox Virtual Environment是一个基于 QEMU/KVM 和 LXC 的开源服务器虚拟化管理解决方案。您可以使用集成的、易于使用的 Web 界面或通过 CLI 管理虚拟机、容器、高可用性集群、存储和网络。Proxmox VE 代码根据 GNU Affero 通用公共许可证第 3 版获得许可。该项目由Proxmox Server Solutions GmbH开发和维护。
官方地址：https://www.proxmox.com/en/
文档地址：https://pve.proxmox.com/wiki/Main_Page
### OpenStack
OpenStack 是一种云操作系统，可控制整个数据中心的大型计算、存储和网络资源池，所有这些都通过仪表板进行管理，该仪表板为管理员提供控制权，同时授权用户通过 Web 界面配置资源。
官方地址：https://www.openstack.org
OpenStack不是虚拟软件,而是管理虚拟机的图形化工具.
