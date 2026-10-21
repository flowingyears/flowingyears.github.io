# 琴台暮云 · 个人主页

一个纯静态的个人主页，集中展示我的联系方式与社交账号：QQ 邮箱、武汉大学邮箱、Gmail、GitHub、哔哩哔哩。

- 线上地址：<https://flowingyears.github.io>
- 风格：浅宣纸晨雾的东方简约风，竖排诗句「酒肆人间世，琴台日暮云」+ 朱红印章点缀

## 特性

- 零依赖、零构建：原生 HTML / CSS / JavaScript，克隆下来双击 `index.html` 就能看
- 账号信息集中在 `js/config.js`，改一个文件即可更新全部链接，无需碰页面代码
- 卡片点击新标签页跳转，邮箱地址支持一键复制
- 入场 stagger 渐显、流云漂移、hover 微交互等动效，且适配 `prefers-reduced-motion`
- 未填写的账号会自动显示「未配置」虚线状态，不会跳出错误链接

## 目录结构

```
.
├── index.html        页面骨架（天幕、诗句、印章、卡片区）
├── css/
│   └── style.css     全部视觉与动效
└── js/
    ├── config.js     站点配置：姓名、头衔、简介、各平台账号与链接
    └── main.js       渲染卡片、复制、toast 提示、入场编排
```

## 本地运行

无需安装任何东西，任选其一：

```bash
# 方式一：直接打开
start index.html

# 方式二：起一个本地服务器（推荐，剪贴板等功能更完整）
python -m http.server 8765
# 然后浏览器访问 http://127.0.0.1:8765/
```

## 修改我的信息

编辑 `js/config.js`，把 `profile` 与 `links` 里的字段换成自己的内容，保存后刷新浏览器即可生效。
新增一个平台只需在 `links` 数组里追加一项（`id / label / handle / description / icon / url`）。

## 部署

仓库名即 GitHub Pages 用户站点：在仓库 Settings → Pages 中选择分支后，站点发布于 <https://flowingyears.github.io>。

## 许可

仅作个人主页展示用途。
