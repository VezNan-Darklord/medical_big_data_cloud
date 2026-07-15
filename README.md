# 医养结合云端后台管理系统

## 本地开发

需要 JDK 17 或更高版本。项目默认使用 `dev` 配置和本地 H2 文件数据库，首次启动会由 Flyway 建表，并创建开发管理员。

Windows 上请确认 `JAVA_HOME` 指向 JDK 17+；如果 PATH 里仍是旧 Java，可直接使用 Maven Wrapper 启动。

```powershell
.\mvnw.cmd spring-boot:run
```

- API 基地址：`http://localhost:8080/api/v1`
- Swagger UI：`http://localhost:8080/api/v1/swagger-ui.html`
- H2 Console：`http://localhost:8080/api/v1/h2-console`
- 开发管理员：`admin`
- 开发默认密码：`Admin123!`

默认密码只用于本地开发。可通过 `BOOTSTRAP_ADMIN_PASSWORD` 覆盖，登录后应立即调用
`POST /api/v1/profile/change-password` 修改密码。

## 本地注册规则

`POST /api/v1/auth/register` 注册成功后会直接返回 access token 和 refresh token：

- 浏览器前端固定创建 `elderly`，不展示也不接受其他角色。
- 仅在 `app.auth.apifox-privileged-registration-enabled=true` 时，Apifox 才可将 `roleCode` 设置为 `admin`、`doctor` 或 `elderly`；`dev`/`test` 配置开启，其他环境默认关闭。
- 已登录管理员仍可通过 `POST /api/v1/doctor-accounts` 创建医生账号。

该开关和 `User-Agent` 区分只适用于本地开发，不作为生产环境的安全认证方案。也可通过环境变量
`APIFOX_PRIVILEGED_REGISTRATION_ENABLED` 显式控制。

## MySQL

MySQL 使用独立配置，不提供数据库密码或 JWT 密钥默认值：

```powershell
$env:SPRING_PROFILES_ACTIVE = "mysql"
$env:MYSQL_HOST = "localhost"
$env:MYSQL_PORT = "3306"
$env:MYSQL_DB = "medical_db"
$env:MYSQL_USER = "medical_app"
$env:MYSQL_PASSWORD = "replace-me"
$env:JWT_SECRET = "replace-with-at-least-32-random-bytes"
.\mvnw.cmd spring-boot:run
```

Flyway 当前基线面向全新数据库。已有历史 MySQL 数据库不要直接启用该配置；应先备份数据，在测试环境完成字段映射、数据清洗和迁移演练，再切换生产库。

如需在全新 MySQL 库引导管理员，额外设置：

```powershell
$env:BOOTSTRAP_ADMIN_ENABLED = "true"
$env:BOOTSTRAP_ADMIN_USERNAME = "admin"
$env:BOOTSTRAP_ADMIN_PASSWORD = "replace-with-a-strong-password"
```

管理员创建完成后，应关闭 `BOOTSTRAP_ADMIN_ENABLED`。已有管理员时，引导逻辑不会重复创建账号。

## 验证

```powershell
.\mvnw.cmd clean test
.\mvnw.cmd package
```

接口契约维护在 `openapi.yaml`，后端路由、状态码、双 Token、文件导出和请求模型变更时应同步更新。
