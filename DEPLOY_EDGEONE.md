# EdgeOne Pages 部署步骤

这个项目已经整理成适合部署到 EdgeOne Pages 的结构：

- 静态页面：`/index.html`
- 接口函数：`/node-functions/api/bootstrap.js`、`/node-functions/api/snapshot.js`
- PWA 文件：`/manifest.webmanifest`、`/sw.js`

## 1. 上传到 GitHub

在项目目录执行：

```bash
cd /Users/kelven/Documents/Codex
git init
git add .
git commit -m "Prepare EdgeOne Pages deployment"
```

然后：

1. 去 GitHub 新建一个仓库
2. 按 GitHub 页面给出的命令，把本地仓库推上去

## 2. 在 EdgeOne Pages 导入仓库

1. 登录 EdgeOne Pages
2. 点击“新建项目”或“Import Repository”
3. 选择你的 GitHub 仓库
4. 部署设置里按下面填写：

- Framework Preset：`Other`
- Build Command：留空
- Output Directory：`/`
- Install Command：留空

这个项目不需要额外打包，直接部署根目录即可。

## 3. 等待首次部署完成

部署成功后，EdgeOne Pages 会给你一个测试网址。

你先用手机打开测试：

1. 选择产品
2. 点击“刷新官网价格”
3. 看中国官网价格和各地区卡片是否正常显示

## 4. 添加到手机主屏幕

### iPhone

1. 用 Safari 打开网址
2. 点击底部分享按钮
3. 选择“添加到主屏幕”

### 安卓

1. 用 Chrome 打开网址
2. 点击右上角菜单
3. 选择“添加到主屏幕”或“安装应用”

## 5. 正式分享给同事

测试没问题后，把 EdgeOne Pages 的网址直接发给同事即可。

如果后面你准备正式长期使用，再做这两步：

1. 绑定你自己的域名
2. 完成备案

## 6. 后续更新

以后你改完代码，只要重新推送到 GitHub，EdgeOne Pages 一般会自动重新部署。
