# 医养结合云端后台管理系统

## 1. 本地开发

### 环境要求

- **JDK 17+**（Windows 请确认 `JAVA_HOME` 指向 JDK 17+）
- 默认使用 `dev` 配置 + 本地 H2 文件数据库，首次启动自动建表并创建开发管理员

### 启动

```powershell
.\mvnw.cmd spring-boot:run
```

### 访问地址

| 地址 | 说明 |
|---|---|
| `http://localhost:8080/api/v1` | API 基地址 |
| `http://localhost:8080/api/v1/swagger-ui.html` | Swagger UI |
| `http://localhost:8080/api/v1/h2-console` | H2 Console |

### 默认账号

- 管理员：`admin` / `Admin123!`（仅本地开发）
- 可通过 `BOOTSTRAP_ADMIN_PASSWORD` 覆盖密码
- 登录后应立即调用 `POST /api/v1/profile/change-password` 修改密码

## 2. 注册规则

`POST /api/v1/auth/register` 注册成功直接返回 access token + refresh token：

| 场景 | 规则 |
|---|---|
| 浏览器前端 | 固定创建 `elderly` 角色，不展示/不接受其他角色 |
| Apifox（特权注册） | `roleCode` 可设为 `admin`/`doctor`/`elderly`，需 `app.auth.apifox-privileged-registration-enabled=true` |
| 已登录管理员 | 通过 `POST /api/v1/doctor-accounts` 创建医生账号 |

> 该开关和 `User-Agent` 区分仅适用于本地开发，非生产环境安全方案。可通过环境变量 `APIFOX_PRIVILEGED_REGISTRATION_ENABLED` 显式控制。

## 3. MySQL 配置

MySQL 使用独立配置，无默认密码或 JWT 密钥：

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

> Flyway 当前基线面向全新数据库。已有历史 MySQL 数据库应先备份数据，在测试环境完成迁移演练后再切换。

全新 MySQL 库引导管理员（创建后应关闭 `BOOTSTRAP_ADMIN_ENABLED`）：

```powershell
$env:BOOTSTRAP_ADMIN_ENABLED = "true"
$env:BOOTSTRAP_ADMIN_USERNAME = "admin"
$env:BOOTSTRAP_ADMIN_PASSWORD = "replace-with-a-strong-password"
```

## 4. 验证

```powershell
.\mvnw.cmd clean test
.\mvnw.cmd package
```

接口契约维护在 `openapi.yaml`，后端路由、状态码、双 Token、文件导出和请求模型变更时应同步更新。
