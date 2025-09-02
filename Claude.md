合并执行清单：数据库建模 + Google 登录（JWT）
先决条件

已执行 npx prisma init（已存在 prisma/schema.prisma）。

.env.local 已配置：DATABASE_URL、GOOGLE_CLIENT_ID、GOOGLE_CLIENT_SECRET、NEXTAUTH_URL、NEXTAUTH_SECRET。

Vercel Postgres 可连接。

任务 A：数据库建模（与登录适配）

在 prisma/schema.prisma 定义三表

User：id、email(唯一/可空)、name、image、createdAt、updatedAt

Account：id、userId(FK→User, ON DELETE CASCADE)、provider="google"、providerAccountId（与 provider 复合唯一）以及令牌相关可空字段（access_token/refresh_token/id_token/expires_at/scope/token_type）

VerificationToken：identifier、token(唯一)、expires

约束：unique(User.email)（允许 NULL）；unique(Account.provider, Account.providerAccountId)；Account.userId 外键索引 + 级联删除。

生成与同步

npx prisma generate

npx prisma migrate dev -n "init_auth"（或 npx prisma db push）

验证

npx prisma studio 查看三表存在与约束有效。

任务 B：登录业务（OAuth 重定向式 + JWT 会话）

NextAuth 基础配置

Provider：Google（读取 GOOGLE_CLIENT_ID/SECRET）

Adapter：Prisma Adapter（指向上面的三表）

session.strategy = "jwt"（本期不建 Session 表）

callbacks.session：把 userId 注入到 session（便于前端/服务端读取）

路由与页面

登录入口：放置一个调用「Google 登录」的按钮（首次=自动注册并登录；再次=直接登录）； 按钮位置在：src/components/Header.tsx 

受保护页面(暂无规划，不做)：示例页（如 /dashboard）在服务端检查会话，未登录则 302 到 /login?callbackUrl=...

用户信息接口：GET /api/me 返回当前登录用户（未登录返回 user: null）

登出接口：清除会话

数据库 I/O（由 Adapter 执行）

Google 回调时：

查询 Account(provider, providerAccountId)

不存在 → 创建 User + Account

存在 → 读取 userId（按需更新 Account 的令牌字段）

会话：JWT（不写 Session 表）

幂等与错误处理

并发首登：插入 Account 若触发唯一约束，捕获后退回为“查询已存在账号”并继续登录

错误回跳：登录失败附 ?error=... 到登录页（例如 OAuthAccountNotLinked）

仅在服务端校验 ID Token（签名、aud、iss、exp、可选 nonce）

任务 C：验收测试（必须全部通过）

首登：点击 Google 登录 → 数据库产生 1 条 User + 1 条 Account，页面进入 callbackUrl。

再登：同一账号再次登录 → 不新增 User/Account。

接口：登录态下 GET /api/me 返回 id/email/name/image；登出后返回 user: null 或 401（任选一种固定行为）。

受保护页：未登录访问会被重定向到 /login，登录后自动回跳到原地址。

并发：快速多次点击登录，不出现重复用户/账号（唯一约束正确处理）。

环境：本地与 Vercel 环境都能正常走通（域名为 HTTPS）。

任务 D：交付清单（让 Claude Code 回报）

数据库迁移已执行成功；三表与约束截图或文本说明。

登录流程工作正常（简要步骤与结果）。

/api/me 与受保护页的行为说明。

如有错误，输出排查结论与已修复情况。

注意事项（实现策略）

不保存 Google 令牌也可以；若未来要访问 Google API，再把 access_token/refresh_token 持久化。

JWT 里只放最小必要信息；权限变更等需要“立即生效”的地方，建议接口处再查库。

线上部署时在 Vercel Build 后执行 npx prisma migrate deploy 以保证生产库就绪。