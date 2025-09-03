任务：补充重定向地址

我已经完成 打开 Google Cloud Console 
 
在 Authorized redirect URIs 中，确保包含以下两个地址：

http://localhost:3000/api/auth/callback/google （本地开发环境）

https://playsnow.net/api/auth/callback/google （生产环境）

 

验收标准

打开该 OAuth Client 的详情页时，能看到 Authorized redirect URIs 里已经包含上述地址。

本地运行时：访问 http://localhost:3000，点击「Sign in with Google」→ 能正确跳转到 Google 授权，并回调 http://localhost:3000/api/auth/callback/google，不再报 redirect_uri_mismatch。

生产环境访问 https://playsnow.net，也能成功走通回调。