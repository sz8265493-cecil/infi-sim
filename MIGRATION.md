> 当前方案（2026-10-28）：公开仓库＋GitHub Pages，Pages Source为GitHub Actions。发布与回退说明见README；下方早期迁移过程仅作历史记录。

# infi-sim 独立迁移说明

## 当前结构

迁移前的旧地址由 Sites 托管，配置见 `.openai/hosting.json`，静态目录为 `dist/`。没有数据库、服务端API、账号系统或付费API密钥。HTML、JS、JSON、图片等运行文件均在 `dist/`；浏览器通过相对路径加载资源。Sites的登录／访问控制属于托管平台，不是游戏源码中的功能。样式已改用系统字体；单位徽标及补充状态图标也已随 assets/vendor/ 发布，不再从 Google Fonts 或官方图片 CDN 加载。必须完整上传 dist/。

## 迁移静态站

1. 解压独立部署包，让 `index.html`、JS文件、JSON文件、`assets/` 位于站点根目录。
2. 使用支持HTML/ES模块/JSON/图片的静态网站托管，上传整个目录。无需安装Node依赖、无需构建，首页为 `index.html`。
3. 如果使用自己的服务器，用Nginx等静态Web服务器将站点根目录指向解压目录；配置域名和HTTPS。`.openai/hosting.json` 只用于Sites，不必部署到其他平台。
4. 验证首页、单位图标、教学选择、地图缩放、对局刷新恢复正常。新域名不会继承旧平台访问权限，需在新平台设置是否公开。

本机预览（在解压目录运行）：

```bash
python3 -m http.server 4173
```

然后打开 http://localhost:4173 。不要直接双击HTML，以免ES模块与JSON加载被浏览器限制。这个命令只用于预览。

## 对局存档

对局只保存在访问者自己的浏览器localStorage，键为 `infi-sim-v5`。网站文件压缩包不含玩家存档，换域名／浏览器不会自动共享它；当前版本没有跨设备同步。若无需保留当前对局，直接在新域名开局即可。

保留对局的方法：在旧站点打开浏览器开发者工具的Application/应用 → Local Storage/本地存储，选择旧站点域名，复制 `infi-sim-v5` 的完整值。在新站点先打开一次页面，在该域名的Local Storage中新建同名键，填入原值，然后刷新。覆盖前备份新站点已有值。仅导入自己可信的存档；保存内容应为JSON。

## 源码与后续维护

项目源码目录包含 `dist/`、`tests/`、`package.json` 和README。`dist/`中的JS就是可编辑源码，未压缩编译，不依赖Sites才能运行。

继续开发时，保存完整项目目录；发布时只需同步更新后的 `dist/` 内容。测试命令为 `npm test`（需要Node）。域名可自行绑定到目标主机，原 `chatgpt.site` 域名属于当前托管平台，不能作为自己的域名一起迁移。

当前为单浏览器双方手动操作的沙盘；迁移不会自动增加在线联机、用户账号或服务器存档。

## 2026-10-21 GitHub私有仓库迁移

目标账号sz8265493-cecil（用户指定邮箱已在GitHub设置确认），仓库infi-sim，Private。源快照对应原站提交ec05f3d370f66202e1c0c73563e4a3a3cb4f242b；迁移准备副本位于同级infi-sim-github。原站及原项目保留。网页上传迁移当前源文件，原Git历史在本地保留，GitHub从迁移提交开始。新增只读权限自动测试工作流；本阶段不启用网页托管。

当前独立存档键除兼容infi-sim-v5外，还包括infi-sim-match、infi-sim-tutorial，分别保存比赛与教学。迁移源码不携带任何玩家浏览器存档。

## 2026-10-21 切换 GitHub Pages

用户已明确授权公开仓库及源码。主仓库为 https://github.com/sz8265493-cecil/infi-sim ，网页为 https://sz8265493-cecil.github.io/infi-sim/ 。后续测试及部署全部使用 GitHub Actions，不再向 GPT Sites 发布。旧站暂留历史版本。

Pages 来源设为 GitHub Actions。main 推送或手动触发 deploy-pages.yml 后，先运行 npm test 和 JS 语法检查，再上传 dist/ 并部署。旧域名浏览器存档不会自动出现在新域名。

## 2026-10-21 最终工作流调整（取代上文公开部署方案）

用户确认改回私有仓库，停止 Pages 自动发布。后续在本地网页实际验证通过后再推送 GitHub，保留 Actions 自动测试。Pages 网页已取消发布，发布工作流已移除。原 GPT Sites 站点不再更新。此前公开部署章节仅保留为历史记录，不是当前操作指引。
