#cms-frontend-portal项目 

##环境准备

1.安装node.js

2.配置.npmrc

在用户目录下增加 .npmrc文件,内容如下（需替换成自己的用户、邮箱）：  

    registry=https://collaborate.gigrt.com/nexus/repository/npm-public/
	#Replace <Base64_encode(username:password)>
	_auth=<Base64_encode(username:password)>
	#Replace <your_email_address>
	email=<your_email_address>
	strict-ssl=false

Base64_encode(username:password)工具链接：<http://tool.oschina.net/encrypt?type=3>

##工程搭建
- WebStorm为例

开始之前请确保已经安装git客户端

1.打开WebStorm客户端，在欢迎页选择“Check out from Version Control”下的Git

2.输入URL

 `https://collaborate.gigrt.com/bitbucket/scm/cms2/cms-frontend-portal.git`

3.点击“Clone”完成

##工程配置
- WebStorm为例

1.进入菜单File>Setting>Languages & Frameworks>Node.js and NPM，配置node.js

2.执行npm install完成依赖包下载



