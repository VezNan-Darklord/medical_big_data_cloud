# 医养结合云端后台管理系统

## 1. 概述

### 1.1 文档目的

本文档用于指导"医养结合云端后台管理系统"的前后端协同开发，统一业务范围、接口约定、数据结构、错误码和联调方式。

系统面向医养结合示范项目建设场景，核心能力涵盖：老人档案、健康预警、评估报告、重点人群管理、报表统计、设备管理、账号管理和大数据决策分析。

### 1.2 建设目标

1. 建立统一的老人健康养老服务后台管理能力
2. 形成标准化的前后端分离开发模式，降低联调成本
3. 使用 OpenAPI 3.0 作为接口契约源，保证接口可生成、可校验、可追踪
4. 图表展示统一使用 ECharts，避免业务层重复封装
5. 大数据决策分析模块预留 AI 接入能力，以 spec 方式同步分析输入/输出与约束

### 1.3 技术架构

| 项 | 选型 |
|---|---|
| 前端 | React |
| 后端 | Java + Spring Boot |
| 架构 | 前后端分离 |
| 接口协议 | RESTful + JSON |
| 接口契约 | OpenAPI 3.0 |
| 图表 | ECharts |
| AI | 独立 spec，后端对接模型服务或规则引擎 |

**分层职责：**

| 角色 | 职责 |
|---|---|
| 前端 | 页面渲染、交互状态管理、接口调用、图表展示、权限可视化控制 |
| 后端 | 业务规则、权限控制、数据聚合、审计留痕、导出、告警计算、AI 推理编排 |
| 契约 | OpenAPI 由后端维护，作为前端接口生成依据 |

## 2. 角色与权限

### 2.1 角色定义

| 角色 | 权限范围 |
|---|---|
| 系统管理员 | 账号、权限、基础配置、全局数据看板 |
| 医生 | 老人档案查看/评估、预警处理、重点人群管理、设备关联查看 |
| 运营人员 | 报表统计、设备管理、老人账户管理、数据巡检 |
| 只读分析人员 | 查看看板和报表，不允许修改业务数据 |

### 2.2 权限原则

- 除登录模块外，所有接口需登录态，采用双 token 鉴权
- 数据权限按机构、角色、区域或项目维度控制
- 删除操作建议软删除，保留审计信息

## 3. 全局接口规范

### 3.1 请求约定

- **Base URL**：`/api/v1`
- **请求格式**：`application/json`
- **时间格式**：ISO 8601（`yyyy-MM-dd HH:mm:ss` 或 `yyyy-MM-dd'T'HH:mm:ssXXX`）
- **分页参数**：`pageNo`（从 1 开始）、`pageSize`（默认 10）
- **认证方式**：`Authorization: Bearer <token>`，双 token 机制

### 3.2 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "traceId": "b3c1f8e9d8f14a7f"
}
```

| 字段 | 说明 |
|---|---|
| `code` | 业务状态码，`0` 表示成功 |
| `message` | 提示信息 |
| `data` | 业务数据 |
| `traceId` | 链路追踪 ID，便于联调排查 |

### 3.3 分页响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [],
    "pageNo": 1,
    "pageSize": 10,
    "total": 0
  },
  "traceId": "b3c1f8e9d8f14a7f"
}
```

### 3.4 错误码

| code | 含义 |
|---|---|
| 200 | 成功 |
| 400 | 参数校验失败 |
| 401 | 未登录或登录失效 |
| 403 | 禁止访问 |
| 404 | 数据不存在 |
| 500 | 系统内部错误 |
| 501 | 第三方服务调用失败 |

## 4. 核心数据对象

以下为核心业务对象 Schema，后端可据此生成 OpenAPI。

### 4.1 老人档案 `ElderlyProfile`

```json
{
  "id": "10001",
  "name": "张三",
  "gender": "male",
  "birthday": "1948-05-12",
  "age": 78,
  "phone": "13800000000",
  "address": "广东省深圳市南山区...",
  "institutionId": "inst-001",
  "medicalHistory": "高血压",
  "careLevel": "C2",
  "tags": ["慢病", "高风险"],
  "status": "active",
  "createdAt": "2026-07-06 10:00:00",
  "updatedAt": "2026-07-06 10:00:00"
}
```

### 4.2 健康预警 `HealthWarning`

```json
{
  "id": "warn-001",
  "elderlyId": "10001",
  "warningType": "abnormal_heart_rate",
  "severity": "high",
  "source": "device",
  "metricName": "heartRate",
  "metricValue": 128,
  "thresholdValue": 100,
  "status": "unprocessed",
  "occurredAt": "2026-07-06 09:40:00",
  "handledAt": null,
  "handlerId": null,
  "remark": "连续异常心率"
}
```

### 4.3 评估报告 `AssessmentReport`

```json
{
  "id": "report-001",
  "elderlyId": "10001",
  "reportType": "health_assessment",
  "score": 82,
  "grade": "B",
  "summary": "整体情况稳定，需关注血压控制",
  "riskItems": ["血压偏高", "睡眠不足"],
  "recommendations": ["定期监测血压", "增加康复训练"],
  "assessorId": "doc-001",
  "assessedAt": "2026-07-06 11:00:00"
}
```

### 4.4 重点人群 `KeyPopulation`

```json
{
  "id": "kp-001",
  "elderlyId": "10001",
  "category": "high_risk_chronic_disease",
  "reason": "高血压长期控制不佳",
  "level": "A",
  "ownerDoctorId": "doc-001",
  "followUpCycleDays": 7,
  "status": "active"
}
```

### 4.5 设备 `Device`

```json
{
  "id": "dev-001",
  "deviceName": "血压计 A100",
  "deviceType": "blood_pressure_monitor",
  "deviceSn": "SN20260706001",
  "elderlyId": "10001",
  "bindingStatus": "bound",
  "onlineStatus": "online",
  "lastReportAt": "2026-07-06 09:40:00",
  "firmwareVersion": "1.0.3"
}
```

### 4.6 账号 `UserAccount`

```json
{
  "id": "u-001",
  "username": "doctor01",
  "realName": "李医生",
  "roleCode": "doctor",
  "mobile": "13900000000",
  "status": "enabled",
  "lastLoginAt": "2026-07-06 09:30:00"
}
```

## 5. 模块清单

| 模块 | 功能范围 |
|---|---|
| 首页 | 核心指标总览、风险预警概览、老人数量趋势、重点人群统计、设备在线率、AI 决策摘要 |
| 老人档案 | 列表/详情/新增/编辑、标签分组管理、与设备/预警/评估/重点人群联动 |
| 健康预警 | 预警列表/详情、处理、转派、关闭 |
| 评估报告 | 报告列表/详情、生成、复核、导出 |
| 重点人群 | 人群列表、分级管理、随访周期与负责人维护 |
| 报表统计 | 老人规模、预警趋势、机构/区域/设备统计 |
| 设备管理 | 设备列表、绑定/解绑、在线状态、数据上报查看 |
| 老人账户管理 | 账号创建与维护、状态启停 |
| 医生账户管理 | 账号创建与维护、角色/状态/机构归属管理 |
| 大数据决策分析 | 多维数据分析看板、AI 分析结论、风险预测与建议 |
| 用户账号管理 | 系统账号/角色/权限管理、重置密码、禁用/启用、审计 |
| 个人中心 | 个人资料维护、修改密码、我的消息与待办 |

## 6. 接口契约总则

### 6.1 RESTful 命名规则

| 操作 | 方法 | 示例 |
|---|---|---|
| 查询列表 | `GET` | `/elderly-profiles` |
| 创建 | `POST` | `/elderly-profiles` |
| 修改 | `PUT`/`PATCH` | `/elderly-profiles/{id}` |
| 删除 | `DELETE` | `/elderly-profiles/{id}` |

> 资源名统一使用复数风格，如 `/elderly-profiles`、`/health-warnings`。统一前缀 `/api/v1`，网关层不做路径改写。

### 6.2 OpenAPI Tag 建议

`Auth` / `Dashboard` / `ElderlyProfile` / `HealthWarning` / `AssessmentReport` / `KeyPopulation` / `ReportStatistics` / `Device` / `ElderlyAccount` / `DoctorAccount` / `UserAccount` / `Profile` / `AIAnalysis`

### 6.3 Schema 规范

- 统一封装 `ApiResponse<T>`
- 统一分页封装 `PageResult<T>`
- 核心实体单独建模，避免接口中重复定义

## 7. 接口列表

### 7.1 登录与认证

| 接口 | 说明 |
|---|---|
| `POST /api/v1/auth/login` | 登录 |
| `GET /api/v1/auth/me` | 获取当前用户信息 |
| `POST /api/v1/auth/logout` | 退出登录 |

<details>
<summary>登录请求/响应示例</summary>

**请求：**
```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOi...",
    "expireAt": "2026-07-07 10:00:00",
    "user": { "id": "u-001", "realName": "系统管理员", "roleCode": "admin" }
  },
  "traceId": "b3c1f8e9d8f14a7f"
}
```
</details>

### 7.2 首页看板

| 接口 | 说明 |
|---|---|
| `GET /api/v1/dashboard/overview` | 首页总览 |
| `GET /api/v1/dashboard/charts` | 首页图表数据 |

`overview` 返回字段：

```json
{
  "totalElderlyCount": 1280,
  "warningCount": 12,
  "unhandledWarningCount": 4,
  "keyPopulationCount": 86,
  "deviceOnlineRate": 0.93,
  "recentTrend": [
    { "date": "2026-07-01", "value": 6 },
    { "date": "2026-07-02", "value": 9 }
  ]
}
```

`charts` 拆分为：老人数量趋势、预警等级分布、重点人群分布、设备在线趋势。

### 7.3 老人档案

| 接口 | 说明 |
|---|---|
| `GET /api/v1/elderly-profiles` | 列表（支持 keyword/gender/careLevel/status/regionCode 筛选） |
| `GET /api/v1/elderly-profiles/{id}` | 详情 |
| `POST /api/v1/elderly-profiles` | 新增 |
| `PUT /api/v1/elderly-profiles/{id}` | 编辑 |
| `DELETE /api/v1/elderly-profiles/{id}` | 删除 |
| `GET /api/v1/elderly-profiles/{id}/warnings` | 关联预警 |
| `GET /api/v1/elderly-profiles/{id}/reports` | 关联报告 |
| `GET /api/v1/elderly-profiles/{id}/devices` | 关联设备 |
| `GET /api/v1/elderly-profiles/{id}/key-populations` | 关联重点人群 |

### 7.4 健康预警

| 接口 | 说明 |
|---|---|
| `GET /api/v1/health-warnings` | 列表（支持 elderlyId/warningType/severity/status/source/时间范围筛选） |
| `GET /api/v1/health-warnings/{id}` | 详情 |
| `POST /api/v1/health-warnings/{id}/handle` | 处理预警 |
| `POST /api/v1/health-warnings/{id}/assign` | 转派预警 |

处理预警请求体：

```json
{
  "status": "processed",
  "handlerId": "doc-001",
  "handlerName": "李医生",
  "result": "已电话联系家属，建议复测",
  "nextAction": "follow_up",
  "remark": "高风险预警已处理"
}
```

### 7.5 评估报告

> 访问角色：医生、管理员。报告由医生创建，至少包含一项病症评估及用药建议，不使用图表展示。

| 接口 | 说明 |
|---|---|
| `GET /api/v1/assessment-reports` | 列表（支持 elderlyId 筛选，分页） |
| `GET /api/v1/assessment-reports/{id}` | 详情 |
| `POST /api/v1/assessment-reports` | 生成报告 |
| `DELETE /api/v1/assessment-reports/{id}` | 删除 |
| `GET /api/v1/assessment-reports/{id}/export` | 导出 |

创建报告请求体：

```json
{
  "elderlyId": "10001",
  "reportType": "健康评估",
  "score": 82,
  "grade": "B",
  "summary": "血压偏高，头晕频繁，请注意控制饮食和运动。",
  "riskItems": ["血压偏高", "睡眠不足", "心律不齐"],
  "recommendations": [
    "硝苯地平 30mg qd 口服",
    "阿司匹林 100mg qd 口服",
    "建议每周复测血压 2 次",
    "建议增加有氧运动每周 3 次",
    "低盐低脂饮食"
  ],
  "assessedAt": "2026-07-06 11:00:00"
}
```

- `reportType` 枚举：`健康评估` / `康复评估` / `用药评估` / `睡眠评估`
- `grade` 枚举：`A` / `B` / `C` / `D`

### 7.6 重点人群

| 接口 | 说明 |
|---|---|
| `GET /api/v1/key-populations` | 列表 |
| `POST /api/v1/key-populations` | 新增 |
| `PUT /api/v1/key-populations/{id}` | 更新 |
| `POST /api/v1/key-populations/{id}/close` | 关闭 |

### 7.7 报表统计

> 访问角色：仅管理员。分为顶部统计卡片 + 下方图表区域，图表使用 ECharts 渲染。

| 接口 | 说明 |
|---|---|
| `GET /api/v1/reports/statistics/overview` | 统计总览 |
| `GET /api/v1/reports/statistics/trends` | 趋势图数据 |
| `GET /api/v1/reports/statistics/distributions` | 分布数据 |
| `GET /api/v1/reports/statistics/export` | 导出 |

`StatisticsOverview` 结构：

```json
{
  "totalElderlyCount": 1280,
  "totalDoctorCount": 96,
  "totalDeviceCount": 642,
  "unboundDeviceCount": 49,
  "deviceOnlineRate": 0.93,
  "totalWarningCount": 31,
  "unhandledWarningCount": 4
}
```

`ChartDomain` 结构（trends/distributions 共用）：

```json
{
  "chartType": "line",
  "title": "重点人群变化趋势",
  "xAxis": ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"],
  "series": [
    { "name": "慢病高风险", "data": [35, 37, 39, 38, 40, 42] },
    { "name": "跌倒高风险", "data": [15, 16, 18, 19, 18, 21] },
    { "name": "认知关注", "data": [10, 10, 11, 12, 11, 13] }
  ]
}
```

前端根据 `chartType` 选择图表类型：`line` → 折线图、`bar` → 柱状图、`pie` → 饼图。

推荐固定图表：重点人群变化趋势（line）、老人档案变化趋势（line）、未关联设备占比（pie）。

### 7.8 设备管理

| 接口 | 说明 |
|---|---|
| `GET /api/v1/devices` | 列表 |
| `GET /api/v1/devices/{id}` | 详情 |
| `POST /api/v1/devices/bind` | 绑定 |
| `POST /api/v1/devices/{id}/unbind` | 解绑 |
| `PUT /api/v1/devices/{id}` | 更新 |
| `GET /api/v1/devices/{id}/reports` | 数据上报记录 |

### 7.9 老人账户管理

| 接口 | 说明 |
|---|---|
| `GET /api/v1/elderly-accounts` | 列表 |
| `POST /api/v1/elderly-accounts` | 创建 |
| `POST /api/v1/elderly-accounts/{id}/reset-password` | 重置密码 |
| `POST /api/v1/elderly-accounts/{id}/status` | 启用/禁用 |

### 7.10 医生账户管理

| 接口 | 说明 |
|---|---|
| `GET /api/v1/doctor-accounts` | 列表 |
| `POST /api/v1/doctor-accounts` | 创建 |
| `PUT /api/v1/doctor-accounts/{id}` | 编辑 |
| `POST /api/v1/doctor-accounts/{id}/reset-password` | 重置密码 |

### 7.11 用户账号管理

| 接口 | 说明 |
|---|---|
| `GET /api/v1/users` | 列表 |
| `POST /api/v1/users` | 创建 |
| `GET /api/v1/users/{id}` | 详情 |
| `PUT /api/v1/users/{id}` | 修改 |
| `POST /api/v1/users/{id}/status` | 修改状态 |
| `POST /api/v1/users/{id}/roles` | 分配角色 |

### 7.12 个人中心

| 接口 | 说明 |
|---|---|
| `GET /api/v1/profile` | 获取个人资料 |
| `PUT /api/v1/profile` | 更新个人资料 |
| `POST /api/v1/profile/change-password` | 修改密码 |
| `GET /api/v1/profile/todos` | 我的待办 |

## 8. 大数据决策分析（AI）

该模块作为独立能力，前端仅展示结果，后端负责数据聚合与 AI 服务调用。

### 8.1 接口

| 接口 | 说明 |
|---|---|
| `POST /api/v1/ai/analysis/care-decision` | 触发分析 |
| `GET /api/v1/ai/analysis/care-decision/history` | 历史记录 |
| `GET /api/v1/ai/analysis/care-decision/{id}` | 分析详情 |

### 8.2 AI 输入 Spec

```json
{
  "scene": "care_decision_analysis",
  "tenantId": "tenant-001",
  "regionCode": "440305",
  "timeRange": { "start": "2026-06-01", "end": "2026-07-06" },
  "metrics": {
    "elderlyCount": 1280,
    "warningCount": 12,
    "unhandledWarningCount": 4,
    "highRiskPopulationCount": 86,
    "deviceOnlineRate": 0.93
  },
  "dimensions": { "groupBy": ["region", "institution", "warningType"] },
  "constraints": {
    "language": "zh-CN",
    "outputFormat": "json",
    "maxInsightCount": 5,
    "mustInclude": ["trend", "risk", "suggestion"]
  }
}
```

### 8.3 AI 输出 Spec

```json
{
  "scene": "care_decision_analysis",
  "summary": "本周期整体运行平稳，但高风险预警处理及时率仍有提升空间。",
  "insights": [
    {
      "type": "risk",
      "title": "高风险预警集中在慢病老人",
      "description": "近 7 天高血压相关预警占比最高。",
      "confidence": 0.91,
      "suggestion": "优先安排医生复核并提高随访频率。"
    }
  ],
  "actions": [
    {
      "actionType": "increase_followup",
      "target": "highRiskPopulation",
      "priority": "high",
      "expectedEffect": "降低未处理预警数量"
    }
  ],
  "charts": [
    { "chartType": "line", "title": "预警趋势", "optionKey": "warningTrend" }
  ]
}
```

### 8.4 边界约束

- 输出必须可结构化解析，禁止仅返回自由文本
- AI 只给建议，不直接执行写操作
- 后端应对 AI 结果做可信度校验、敏感词过滤和字段白名单控制

## 9. ECharts 接入约定

| 职责 | 内容 |
|---|---|
| 前端 | 根据后端返回的 `ChartDomain` 数据渲染 ECharts，负责样式适配和交互 |
| 后端 | 返回稳定字段的图表数据（`chartType`/`title`/`xAxis`/`series`），包含标题、单位、排序规则 |

```json
{
  "chartType": "bar",
  "title": "重点人群分布",
  "xAxis": ["慢病", "失能", "高龄"],
  "series": [{ "name": "人数", "data": [120, 46, 78] }]
}
```

## 10. 前后端联调约定

### 10.1 前端需后端提前确认

- 登录认证方式、权限粒度与数据权限规则
- 各模块字段枚举值
- 图片/文件/导出/上传的处理方式
- AI 分析输出字段是否固定

### 10.2 后端需前端提前确认

- 页面实际展示字段
- 搜索条件与筛选项
- 列表默认排序
- 图表所需维度与指标
- 空态、异常态和加载态展示方式

### 10.3 联调检查点

- 接口路径是否与 OpenAPI 一致
- 请求参数是否与 Schema 一致
- 响应字段是否满足页面渲染需要
- 错误码是否被前端正确识别并提示
- 文件导出/上传/下载是否可直接联调

## 11. 开发与交付建议

### 11.1 推进顺序

1. 后端输出 OpenAPI 初版
2. 前端基于 OpenAPI 生成 API Client
3. 双方确认核心列表、详情和看板接口
4. 优先打通：登录 → 首页 → 老人档案 → 预警 → 设备 → 报表
5. 最后接入 AI 决策分析与导出能力

### 11.2 最小闭环接口清单

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/dashboard/overview`
- `GET /api/v1/elderly-profiles`
- `GET /api/v1/elderly-profiles/{id}`
- `GET /api/v1/health-warnings`
- `POST /api/v1/health-warnings/{id}/handle`
- `GET /api/v1/devices`
- `GET /api/v1/reports/statistics/overview`
- `POST /api/v1/ai/analysis/care-decision`

### 11.3 版本管理

- 文档和 OpenAPI 文件纳入版本控制
- 每次接口变更同步更新接口契约
- 破坏性变更通过版本号或兼容字段策略处理

> 本文档为前后端协同开发第一版接口契约草案，后续可根据实际业务字段、数据库设计和页面原型持续补全。建议由后端维护 OpenAPI 源文件，前端以生成代码方式接入。
