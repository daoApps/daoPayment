# Fix Backend Network Error Spec

## Why
用户遇到了“Network Error: Unable to connect to the backend server”的网络错误。这是因为前端目前将 API 的基础 URL 硬编码为 `http://localhost:8000/api`。当通过远程开发沙盒或云端预览链接访问应用时，浏览器内的 `localhost` 解析的是用户本地的电脑，而不是运行 FastAPI 后端的远程服务器。同时，带有凭证的通配符 CORS 配置也容易被现代浏览器拦截。通过让 Next.js 作为代理转发 API 请求，可以完美避开此类问题。

## What Changes
- 修改 `next.config.mjs`，添加 `rewrites` 规则，将所有 `/api/:path*` 的请求代理到 `http://127.0.0.1:8000/api/:path*`。
- 删除不生效的 `next.config.js`。
- 修改 `src/api/client.ts`，使用相对路径 `/api` 代替硬编码的 `http://localhost:8000/api`。

## Impact
- Affected specs: 远程开发环境预览支持
- Affected code: `next.config.mjs`, `src/api/client.ts`

## MODIFIED Requirements
### Requirement: API Connectivity
**Reason**: 为了支持远程沙盒预览环境，避免跨域资源共享（CORS）错误和 `localhost` 环回解析问题。
**Migration**: 前端 Next.js 服务现在兼作 FastAPI 后端的反向代理。
