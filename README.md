# Monas

## 项目概述

Monas 是一个基于 Vue 3 + TypeScript + Vite 构建的现代化管理系统前端项目。项目采用最新的前端技术栈，提供完善的用户管理、角色管理、菜单管理、任务管理等核心功能，支持主题切换、多标签页等特性，为企业级应用提供强大的前端解决方案。

## 核心功能

### 用户管理
- 用户信息的增删改查
- 用户头像裁剪上传
- 用户状态管理
- 个人资料编辑

### 角色管理
- 角色权限配置
- 菜单权限分配
- 角色列表管理

### 菜单管理
- 菜单树形结构管理
- 菜单权限配置
- 动态路由生成

### 任务管理
- 任务创建与编辑
- 任务日志查看
- 任务状态追踪

### 系统功能
- 主题切换（支持亮色/暗色模式）
- 多标签页管理
- 页面缓存（基于 keep-alive 的智能缓存机制）
- 响应式布局
- 文件上传与管理
- 异常页面处理（404、500）

## 技术栈

### 核心框架
- **Vue 3.5.22** - 渐进式 JavaScript 框架
- **TypeScript 5.9.0** - JavaScript 的超集，提供类型安全
- **Vite** - 下一代前端构建工具（使用 rolldown-vite）

### UI 与样式
- **Tailwind CSS 4.1.14** - 原子化 CSS 框架
- **Naive UI** - Vue 3 组件库
- **Lucide Icons** - 现代化图标库
- **HarmonyOS Sans SC** - 字体资源

### 状态管理与路由
- **Pinia 3.0.3** - Vue 3 官方状态管理库
- **pinia-plugin-persistedstate** - Pinia 状态持久化插件
- **Vue Router 4.5.1** - Vue 官方路由管理器

### 工具库
- **Axios 1.12.2** - HTTP 客户端
- **es-toolkit 1.43.0** - 现代 JavaScript 工具库
- **Anime.js 4.2.2** - 动画库
- **vue-cropper 1.1.4** - 图片裁剪组件

### 开发工具
- **ESLint 9.33.0** - 代码检查工具
- **oxlint 1.11.0** - 快速 JavaScript linter
- **Prettier 3.6.2** - 代码格式化工具
- **vue-tsc 3.1.0** - Vue TypeScript 类型检查
- **vite-plugin-vue-devtools** - Vue 开发者工具

## 环境要求

- **Node.js**: ^20.19.0 || >=22.12.0
- **pnpm**: 10.22.0
- **推荐 IDE**: VS Code + Vue (Official) 扩展

## 安装步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd monas
```

### 2. 安装依赖

使用 pnpm 安装项目依赖：

```bash
pnpm install
```

### 3. 环境配置

项目根目录下包含 `.env` 文件，配置说明如下：

```env
# 应用名称
VITE_APP_NAME=Monas

# API 基础路径
VITE_API_BASE_URL=/api

# API 代理目标地址
VITE_API_PROXY_TARGET=http://localhost:9835
```

根据实际后端服务地址修改 `VITE_API_PROXY_TARGET` 配置。

## 使用指南

### 开发模式

启动开发服务器，支持热模块替换（HMR）：

```bash
pnpm dev
```

开发服务器默认运行在 `http://localhost:9300`

### 生产构建

构建生产版本：

```bash
pnpm build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

预览生产构建版本：

```bash
pnpm preview
```

### 代码检查

运行代码检查和自动修复：

```bash
# 运行所有 linter
pnpm lint

# 仅运行 oxlint
pnpm lint:oxlint

# 仅运行 eslint
pnpm lint:eslint
```

### 代码格式化

格式化代码：

```bash
pnpm format
```

### 类型检查

运行 TypeScript 类型检查：

```bash
pnpm type-check
```

## 配置说明

### Vite 配置

项目使用 Vite 作为构建工具，配置文件位于 `vite.config.ts`：

- **开发服务器端口**: 9300
- **路径别名**: `@` 指向 `src` 目录
- **API 代理**: 自动将 `/api` 请求代理到后端服务

### TypeScript 配置

项目包含多个 TypeScript 配置文件：

- `tsconfig.json` - 基础 TypeScript 配置
- `tsconfig.app.json` - 应用代码配置
- `tsconfig.node.json` - Node.js 环境配置

### 路由配置

项目使用 Vue Router 4 进行路由管理，支持动态路由加载。

#### 动态路由

- 使用 `import.meta.glob` 实现组件的动态导入
- 路由配置从后端菜单数据动态生成
- 支持路由元信息（meta）配置：标题、图标、是否隐藏、是否缓存等

#### 路由守卫

- **登录验证**：未登录用户自动跳转到登录页
- **路由加载**：首次访问时动态加载菜单和路由
- **权限控制**：根据菜单配置控制路由访问权限
- **白名单**：登录页、404、500 等页面无需登录即可访问

### ESLint 配置

ESLint 配置文件位于 `eslint.config.ts`，包含以下规则集：

- Vue 3 相关规则
- TypeScript 规则
- Prettier 集成
- oxlint 规则

### Prettier 配置

Prettier 配置文件位于 `.prettierrc.json`，统一代码格式化风格。

### 页面缓存机制

项目实现了基于 `keep-alive` 的智能页面缓存机制，支持多标签页场景下的页面状态保持。

#### 缓存原理

- 使用 Vue 3 的 `keep-alive` 组件包裹 `router-view`
- 通过 `include` 属性指定需要缓存的组件名称
- 根据标签页的打开和关闭动态管理缓存列表

#### 组件名称获取

由于项目使用动态路由加载（`import.meta.glob`），组件名称通过以下方式获取：

1. **组件定义**：所有需要缓存的页面组件必须使用 `defineOptions` 定义组件名称

```vue
<script setup lang="ts">
defineOptions({
  name: 'UserView',
})
</script>
```

2. **动态获取**：通过 `getComponentName` 工具函数动态加载组件并获取其 `__name` 属性
3. **缓存机制**：使用 `Map` 缓存已加载的组件名称，避免重复加载

#### 缓存管理

缓存列表 `keepAliveRoutes` 在以下时机自动更新：

- **打开标签页**：当路由的 `meta.keepAlive` 为 `true` 时，将组件名称添加到缓存列表
- **关闭标签页**：从缓存列表中移除对应组件名称
- **关闭所有标签页**：清空缓存列表
- **关闭其他标签页**：只保留当前标签页的组件名称

#### 配置说明

在菜单管理中，可以为每个菜单项配置是否启用缓存：

- **keepAlive**: `true` 表示启用缓存，`false` 表示不缓存
- **componentName**: 系统自动维护，无需手动配置

#### 注意事项

- 组件名称必须唯一，否则 keep-alive 可能会混淆
- 只有在菜单配置中设置了 `keepAlive: true` 的路由才会被缓存
- 组件名称需要在路由配置中唯一，通常使用菜单的 `code` 字段作为路由名称

## 项目结构

```
monas/
├── public/                 # 静态资源
│   ├── image/             # 图片资源
│   └── favicon.ico        # 网站图标
├── src/
│   ├── assets/            # 资源文件
│   │   ├── fonts/         # 字体文件
│   │   └── image/         # 图片资源
│   ├── components/        # 公共组件
│   │   ├── Exception/     # 异常页面组件
│   │   ├── File/          # 文件组件
│   │   ├── IconInput/     # 图标输入框
│   │   ├── LucideIcon/    # 图标组件
│   │   ├── MenuTreeSelect/# 菜单树选择器
│   │   └── Table/         # 表格组件
│   ├── layout/            # 布局组件
│   │   ├── AppHeader.vue  # 头部组件
│   │   ├── AppLayout.vue  # 主布局
│   │   ├── AppLogo.vue    # Logo 组件
│   │   ├── AppMenu.vue    # 菜单组件
│   │   ├── AppTab.vue     # 标签页组件
│   │   └── AppThemeDrawer.vue # 主题抽屉
│   ├── network/           # 网络请求
│   │   ├── request.ts     # 请求封装
│   │   ├── service.ts     # 服务基类
│   │   └── types/         # 类型定义
│   ├── router/            # 路由配置
│   │   ├── index.ts       # 路由实例
│   │   └── routes.ts      # 路由定义
│   ├── services/          # 业务服务
│   │   └── file/          # 文件服务
│   ├── stores/            # 状态管理
│   │   ├── menu.ts        # 菜单状态
│   │   ├── theme.ts       # 主题状态
│   │   ├── user.ts        # 用户状态
│   │   └── types/         # 类型定义
│   ├── style/             # 样式文件
│   ├── utils/             # 工具函数
│   │   ├── color.ts       # 颜色工具
│   │   ├── renderer.ts    # 渲染工具
│   │   ├── table.ts       # 表格工具
│   │   └── type.ts        # 类型工具
│   ├── views/             # 页面视图
│   │   ├── about/         # 关于页面
│   │   ├── home/          # 首页
│   │   ├── profile/       # 个人资料
│   │   └── system/        # 系统管理
│   │       ├── login/     # 登录
│   │       ├── menu/      # 菜单管理
│   │       ├── role/      # 角色管理
│   │       ├── task/      # 任务管理
│   │       └── user/      # 用户管理
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── .env                   # 环境变量
├── .editorconfig          # 编辑器配置
├── .gitignore             # Git 忽略配置
├── .prettierrc.json       # Prettier 配置
├── eslint.config.ts       # ESLint 配置
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── pnpm-lock.yaml         # 依赖锁定文件
├── pnpm-workspace.yaml    # pnpm 工作区配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── README.md              # 项目文档
```

## 浏览器支持

推荐使用以下浏览器：

- Chrome/Edge（推荐）
- Firefox
- Safari

### 开发者工具扩展

- **Vue.js devtools**: [Chrome](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- **Custom Object Formatter**: [Chrome](http://bit.ly/object-formatters) | [Firefox](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 遵循 ESLint 和 Prettier 配置
- 提交前运行 `pnpm lint` 和 `pnpm type-check`
- 编写清晰的提交信息
- 为新功能添加必要的注释和文档

## 许可证

本项目采用私有许可证，未经授权不得用于商业用途。

## 联系方式

如有问题或建议，请联系项目维护者。

## 更新日志

### v0.0.1
- 初始版本发布
- 实现用户、角色、菜单、任务管理功能
- 支持主题切换和多标签页
- 集成 Tailwind CSS 和 Naive UI
- 实现基于 keep-alive 的智能页面缓存机制
- 支持动态路由加载和组件名称自动获取
- 完善的路由守卫和权限控制
