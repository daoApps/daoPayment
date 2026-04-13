# Tasks
- [x] Task 1: 更新 Next.js 配置文件以添加 API 代理重写规则。
  - [x] SubTask 1.1: 修改 `next.config.js`，包含一个 `async rewrites` 函数，代理 `/api/:path*` 到 `http://127.0.0.1:8000/api/:path*`。
- [x] Task 2: 更新前端 API 客户端以使用相对 URL。
  - [x] SubTask 2.1: 在 `src/api/client.ts` 中，将 `BASE_URL` 从 `http://localhost:8000/api` 更改为 `/api`。
- [x] Task 3: 修复由于 `next.config.mjs` 导致重写规则未生效的问题。
  - [x] SubTask 3.1: 将代理配置写入实际生效的 `next.config.mjs`，并删除无用的 `next.config.js`。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
