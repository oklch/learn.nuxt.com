# Nuxt Tutorial Playground

本项目学习自 [Anthony Fu 的视频教程](https://www.youtube.com/playlist?list=PL4ETc_mXFfxUGiY852jH3ctljnI2e9Rax)，原始项目：[nuxt/learn.nuxt.com](https://github.com/nuxt/learn.nuxt.com)。Nuxt Content 的中文翻译由 [ffgenius/learn.nuxt.com-zh](https://github.com/ffgenius/learn.nuxt.com-zh) 提供。

项目地址：[learnnuxtcom.netlify.app](https://learnnuxtcom.netlify.app)。

实现细节：

- 使用 WebContainer 在浏览器里运行 Node，从而实现在浏览器里运行 Nuxt 应用
- 实现符合 WebContainer 规范的 Virtual File 并挂载，通过 getter 响应式地读取文件内容
- 使用 UnoCSS 实现页面和 Nuxt Content 中用到的原子类的提取，使用 Shortcuts 和 @apply 实现样式的一致性及 Dark Mode 下对应的样式，使用 presetIcons 提供页面的 icon
- 使用 Splitpanes 将页面中的组件（Docs、Editor、Preview、Terminal、EditorFileSystemTree、EditorMonaco）实现为 Resizable Panel；针对 Splitpanes 中的 bug 使用 pnpm-patch-i 进行修改
- 仅对需要交互的部分使用 Client 组件，其余内容通过 SSR 输出，提升首屏性能与 SEO 效果；针对 Splitpanes 每一个 Pane 的大小使用 useMounted 和 Cookie 以优化 SSR
- 定义 Nuxt Module 导出 Playground 中基本的 Virtual File，使用 Nuxt Layer 屏蔽不应展示给用户的细节，并使用 JSZip 实现文件下载
- 定义 iframe 中 Nuxt 应用的启动状态，在轮询状态结束时使用 Nuxt Plugin 通知父文档，并通过 birpc 实现 iframe 与父文档的通信
- 通过 Vite Plugin 和 import.meta.glob，在路由切换时更新 Playground 和 Solution
- 使用 Xterm.js 和 Stream API 实现 WebContainer 的 CLI 的读写，spawn 出 pnpm install、pnpm dev、jsh 进程；依靠 AbortController 和 进程的 kill，得以重新启动 Nuxt 应用，加深可交互性
- 使用 Monaco 实现页面中的代码编辑，基于 Volar、Vue REPL 实现对 Vue / TypeScript / JSON 等文件的语法解析，使用 Shiki 实现语法高亮；优化 Vue REPL 中基于 CDN 的 npm 文件系统，使用 WebContainer 的 FS API 将 node\_modules / tsconfig.json / .nuxt 等文件提供给 Volar
- 使用 Nuxt Content 实现 Document Driven 模式，实现导航：前 / 后一篇文章、Breadcrumb、Dropdown；实现 CommandPalette，其中使用 Fuse.js 对 Guide 进行搜索
- Hijack NuxtLink，对于 nuxt.com 的链接使用 iframe 作为 Drawer 嵌入到页面中
- 使用 Nuxt SEO 实现 sitemap.xml、OG Image，结合 Nuxt Devtools 实现对 SEO 的可视化检查
- 使用 floating-vue 实现 Dropdown 组件，使用 useId 避免 aria-id 的水合不匹配；使用 Nuxt Runtime Config 实现构建时间的动态获取，并使用 execa 获取到最近提交的 git SHA 值
- 使用 Nuxt I18n 对 Nuxt Content 增加 i18n 支持，使用 Nuxt Middleware 提供 URL 的重定向，使用 eslint-plugin-vue-i18n 对模板中的 Raw Text 进行 Lint
