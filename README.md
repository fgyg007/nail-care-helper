# 护甲上岸助手 · NailCare Helper Pro

一个以本地记录为核心的护甲打卡工具，提供 Android APK 和可自行运行的 Web 页面。把手足部位标记、日常任务、照片对比和日历提醒文件放在一起，帮助整理长期护理记录。

[下载 Android APK](https://github.com/fgyg007/nail-care-helper/releases/latest) · [使用与隐私说明](docs/PRIVACY.md) · [反馈问题](https://github.com/fgyg007/nail-care-helper/issues)

> 本项目是个人记录工具，不提供诊断或个体化治疗建议。应用内现有用药、护理步骤和阶段文字来自初始原型，尚未经过专业医学审校；请勿将其视为治疗指南或据此自行操作。部位标记和进度尺是用户手动记录，不是病情判定或疗效评估。

## 为什么做这个工具

长期记录往往分散在相册、备忘录和日历里：哪天做过什么、某个部位的照片在哪里、与最初相比有什么变化，都不容易回看。本项目希望减少记录和查找的步骤，同时让照片留在使用者的设备上。

## 已有功能

| 功能 | 当前实现 |
|---|---|
| 手足 20 指（趾）图谱 | 点击 SVG 图形循环标记状态，保存各部位的自评记录 |
| 分项打卡 | 分开记录每周任务、早间和晚间任务，汇总累计天数与次数 |
| 图文展示 | 内嵌 SVG 示意图，无需从外部网站下载插图 |
| 分部位相册 | Android 原生拍照或选图，填写部位和备注，按部位筛选、对比首张与最新照片 |
| 手动进度记录 | 180 天打卡进度条与四阶段手动选择；不自动识别照片 |
| 日历文件 | 导出 `.ics` 文件，通过 Android 分享面板保存或交给支持导入的日历应用 |
| 本地数据 | 打卡/图谱使用 localStorage，压缩后的照片使用 IndexedDB；没有应用账户或自建云同步服务 |

每日早晚的日历事件各重复 90 次，每周三/周日事件共重复 48 次。必须由用户在日历应用导入并开启通知；能否响铃、准时提醒取决于日历应用和系统设置，本应用本身不提供后台闹钟。

## 下载与安装

1. 打开 [Releases](https://github.com/fgyg007/nail-care-helper/releases/latest)，下载附件中的 `nail-care-v1.0.0.apk`，无需下载源码 ZIP。
2. 将 APK 传到 Android 手机打开，按系统提示为此次使用的文件管理器或浏览器允许安装来源。
3. 安装后测试拍照、选图和日历导入是否适配自己的设备。

最低 Android 7.0（API 24）。APK 由维护者的固定密钥签名，不是应用商店版本。以后使用相同包名和签名的版本可覆盖安装；不要为更新而先卸载，卸载或清除数据会删除本地记录。

### v1.0.0 文件校验

大小：6,671,749 字节（约 6.36 MiB）。SHA-256：

```text
08308b8c5fe24e2f8fddbc795801c09978fc1e9884f413e4e2781fea9c7d8788
```

APK 由维护者的独立私有构建仓库生成。本公开仓库提供对应的应用源码、说明和下载；公开源码快照导出自已验证的构建提交 `e0dcc76`，保留原有应用实现，另补充文档和许可证。

## 隐私与数据边界

- 当前应用代码没有照片上传、登录、广告或统计接口；Android 包内的页面、样式和脚本均本地打包，可离线使用。
- “本地存储”不等于绝对不会泄露：设备访问、系统环境以及用户主动使用的分享/日历应用仍影响隐私。
- 日历文件交给第三方应用后，可能随该应用的账户同步。不要在公开 Issue 上传私人照片或个人健康记录。
- **目前没有数据备份/恢复功能，也没有跨设备同步。** Android 系统备份已关闭，卸载或清除应用数据会丢失记录；Web 版清理站点数据也会丢失记录。
- Android 与浏览器的数据相互独立。照片会经 Canvas 缩放压缩，并非原图存档。

完整范围见 [PRIVACY.md](docs/PRIVACY.md)。

## 开发与本地预览

技术栈：HTML / JavaScript、Tailwind CSS 3、Capacitor 8、Camera / Filesystem / Share、esbuild、Playwright、GitHub Actions。

需要 Node.js 22+。运行网页和页面测试无需 Android Studio：

```sh
git clone https://github.com/fgyg007/nail-care-helper.git
cd nail-care-helper
npm ci
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory www
```

打开 `http://127.0.0.1:4173`。当前仓库没有部署公共在线站点，也没有配置完整 PWA manifest 和 service worker，因此不承诺浏览器安装及离线缓存能力。

停止预览服务器后执行测试（测试也使用 4173 端口）：

```sh
npx playwright install chromium
npm test
```

## Android 打包

```sh
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

本地 Android 构建需要 Java 21 和相应 Android SDK。Debug APK 位于 `android/app/build/outputs/apk/debug/`。

### 公开源码与私有打包分工

- `nail-care-helper`：公开应用源码、ISC 许可证、使用说明和 Releases 下载。
- 维护者的私有构建仓库：运行签名构建，保留 Actions Secrets，验证后将 APK 发布到本公开仓库。
- 公开仓库不包含维护者的签名密钥或私有构建工作流，也不因提交说明而自动重新打包。

若自行构建 release，可按 `android/app/build.gradle` 的配置提供自己的 PKCS12 密钥库（别名 `nailcare`），通过 `NAIL_KEYSTORE` 指定绝对路径，通过 `NAIL_STORE_PASSWORD` 提供密钥库及密钥密码，然后运行 `./gradlew assembleRelease`。切勿把密钥或密码提交 Git。

自行签名的包不能直接覆盖维护者发布的 APK；后续同一渠道升级须保持包名和签名，并递增 `versionCode`。

## 目录

```text
src/index.html                 页面与记录逻辑
src/native.js                  Android 拍照/选图、日历分享桥接
src/styles.css                 Tailwind 样式入口
scripts/build.mjs              离线资源构建
android/                       Android 原生工程
tests/                         页面自动化
```

`www/` 和 `node_modules/` 为本地生成内容，不提交 Git。

## 验证状态与已知限制

已通过：页面打卡、阶段/图谱和照片持久化、备注转义、页面切换、ICS 导出测试；Android release 编译与 lint；APK ZIP 完整性、离线资源及签名块存在性检查。

尚未完成：Android 实机相机、分享目标、日历通知与不同厂商系统的兼容性验收。页面自动化不能替代这些实机验证。当前内置的示例部位和护理任务也不代表个人实际情况。

欢迎提交可复现的问题或改进 PR。反馈请附应用版本、手机型号、Android 版本与操作步骤，避免上传私人健康资料。

## 许可证

项目代码使用 [ISC License](LICENSE)。第三方依赖及其随包资源分别遵循各自许可证。
