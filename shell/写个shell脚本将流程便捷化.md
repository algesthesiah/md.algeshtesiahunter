---
title: 写个shell脚本将流程便捷化
des: 将打包的单页面应用代码打包上传至服务器
category: coding
tag: shell
date: 2019/12/11
img: shell1.png
---

### tips

在 mac 的`zsh`的配置文件`.zshrc`写这个脚本

### code

```bash
pub_github_list=('Algesthesiahunter.github.io' 'base')
pub_coding_list=('Algesthesiahunter.coding.me' 'algesthesiahunter.me')

base_pub() {
  npm run build
  cd /Users/liulu/Documents/work/github/$1
  setopt rmstarsilent
  rm -rf *
  cp -rf /Users/liulu/Documents/work/github/$2/dist/* ./
  cp index.html 404.html
  gaa
  gcmsg 'init'
  gp -u origin master
  cd -
}

publish() {
  if [ -z "$1" ]; then
    echo "请输入名称"
  elif [[ "$1" == "coding" ]]; then
    base_pub $pub_coding_list
  elif [[ "$1" == "github" ]]; then
    base_pub $pub_github_list
  else
    echo "暂不支持"
  fi
}
```

### usage

```bash
publish github

publish coding
```
