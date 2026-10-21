# infi-sim

Infinity N5 的二维战术模拟器。入口分为真实比赛与教学演示；纯 HTML、CSS、JavaScript ES Modules，无运行时 npm 依赖。

## 本地运行与测试

需要 Node.js 22+（测试）和 Python 3（本地静态服务器）。

```bash
npm start
# 浏览器打开 http://localhost:4173/
npm test
```

不要直接双击 HTML，浏览器需要通过 HTTP 加载模块及 JSON。

## 当前功能

- 真实比赛：ITS18 Hardlock／Annihilation（300点级、48×48寸），双方官方军表导入、先手/部署权检定、部署与保留模型、手动或随机火力组、独立战斗组命令池。
- 教学演示：固定单位、阵营、装备与起点；规则分类、搜索与 FAQ、独立重置、可选固定教学骰。比赛和教学各自保存浏览器进度。
- 主动/ARO宣告、拼骰与SD弃骰、过保/伤害、闪避与勇气移动、状态与常用技能装备。
- 移动、攀爬及三维折线跳跃；炽天使短超级跳6+3=9寸，喷气推进允许空中转向。

## 目录

- `dist/`：可直接部署的网页、规则代码、图片及数据。也是可编辑源码，不需要构建。
- `tests/`：Node内置测试框架的规则与几何回归测试。
- `scripts/`：官方 Army 数据整理脚本。
- `RULES_V8.md`：规则依据、实现记录和人工网页验证记录。
- `MIGRATION.md`：独立托管、存档和GitHub迁移说明。
- `README_HISTORY.md`：此前分版本说明，属于历史记录；当前能力以此README及最新规则记录为准。
- `.github/workflows/test.yml`：每次push/PR及手动触发，运行测试与JS语法检查。
- `.openai/hosting.json`：原Sites站点关联信息，仅用于原托管平台；不是GitHub认证信息。

## GitHub迁移

公开仓库：[sz8265493-cecil/infi-sim](https://github.com/sz8265493-cecil/infi-sim)。

在线使用：[GitHub Pages 模拟器](https://sz8265493-cecil.github.io/infi-sim/)。

2026-10-21 按用户确认改为公开，后续测试与部署统一使用 GitHub，不再更新原 GPT Sites 站点。每次推送 main，GitHub Actions 先执行规则测试及 JavaScript 语法检查，通过后发布完整 dist/；也可手动触发 Deploy GitHub Pages 工作流。

最初迁移保留的是可运行源码快照；原开发历史另有本地备份。军表、图标及第三方素材的权利归属不因仓库公开而改变。

## 存档与规则边界

对局保存在访问该网址的浏览器本地存储。换域名或浏览器不会自动迁移，也没有在线联机、账号或云数据库。

这是非官方教学/对战沙盘，并未实现全部Infinity规则。异形地形、跨层倾斜模板、复杂轮廓等仍有近似；规则争议以最新官方规则、FAQ与赛事裁定为准。官方图标、军表数据及商标归各自权利人，不在迁移时另行授予第三方素材许可。
