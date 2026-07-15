# 医养结合云端后台管理系统

## 1. 文档目的

本文档用于指导“医养结合云端后台管理系统”的前后端协同开发，统一业务范围、接口约定、数据结构、错误码和联调方式，便于后续由后端输出 OpenAPI 文档并由前端自动生成接口代码。

系统面向医养结合示范项目建设场景，围绕老人档案、健康预警、评估报告、重点人群管理、报表统计、设备管理、账号管理和大数据决策分析等核心能力展开。

## 2. 建设目标

1. 建立统一的老人健康养老服务后台管理能力。
2. 形成标准化的前后端分离开发模式，降低联调成本。
3. 使用 OpenAPI 作为接口契约源，保证接口可生成、可校验、可追踪。
4. 图表展示统一使用 ECharts，避免在业务层重复封装图表能力。
5. 大数据决策分析模块预留 AI 接入能力，采用 spec 方式向后端和前端同步分析输入、输出与约束。

## 3. 技术架构约定

### 3.1 架构模式

- 前端：React
- 后端：Java + Spring Boot
- 架构：前后端分离
- 接口协议：RESTful + JSON
- 接口契约：OpenAPI 3.0
- 图表：ECharts
- AI 分析：以独立 spec 描述，后端可对接模型服务或规则引擎

### 3.2 分层职责

- 前端负责页面渲染、交互状态管理、接口调用、图表展示和权限可视化控制。
- 后端负责业务规则、权限控制、数据聚合、审计留痕、导出、告警计算和 AI 推理编排。
- OpenAPI 文件由后端维护并作为前端接口生成依据。

## 4. 角色与权限

### 4.1 角色定义

- 系统管理员：账号、权限、基础配置、全局数据看板。
- 医生：老人健康档案查看、评估、预警处理、重点人群管理、设备关联查看。
- 运营人员：报表统计、设备管理、老人账户管理、数据巡检。
- 只读分析人员：查看看板和报表，不允许修改业务数据。

### 4.2 权限原则

- 所有接口默认需要登录态，除去登陆模块，采用双token鉴权
- 数据权限按机构、角色、区域或项目维度控制，具体以后端实现为准。
- 删除操作建议使用软删除，保留审计信息。

## 5. 全局接口规范

### 5.1 请求约定

- Base URL 示例：`/api/v1`
- 请求体格式：`application/json`
- 时间格式：ISO 8601，推荐 `yyyy-MM-dd HH:mm:ss` 或 `yyyy-MM-dd'T'HH:mm:ssXXX`
- 分页参数：`pageNo` 从 1 开始，`pageSize` 默认 10

### 5.2 统一响应格式

```json
{
	"code": 0,
	"message": "success",
	"data": {},
	"traceId": "b3c1f8e9d8f14a7f"
}
```

#### 字段说明

- `code`：业务状态码，`0` 表示成功。
- `message`：提示信息。
- `data`：业务数据，成功时返回具体内容。
- `traceId`：链路追踪 ID，便于联调和排查。

### 5.3 分页响应格式

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

### 5.4 错误码建议

| code | 含义 |
| --- | --- |
| 200 | 成功 |
| 400 | 参数校验失败 |
| 401 | 未登录或登录失效 |
| 403 | 禁止访问 |
| 404 | 数据不存在 |
| 500 | 系统内部错误 |
| 501 | 第三方服务调用失败 |

## 6. 核心数据对象

以下为接口设计中的核心业务对象，后端可据此生成 OpenAPI Schema。

### 6.1 老人档案 ElderlyProfile

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

### 6.2 健康预警 HealthWarning

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

### 6.3 评估报告 AssessmentReport

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

### 6.4 重点人群 KeyPopulation

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

### 6.5 设备 Device

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

### 6.6 账号 UserAccount

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

## 7. 模块清单与页面范围

### 7.1 首页

- 核心指标总览
- 风险预警概览
- 老人数量趋势
- 重点人群统计
- 设备在线率
- AI 决策建议摘要

### 7.2 老人档案

- 老人信息列表
- 新增/编辑/详情
- 标签、分组、档案状态管理
- 与设备、评估、预警、重点人群联动

### 7.3 健康预警

- 预警列表
- 预警详情
- 预警处理、转派、关闭

### 7.4 评估报告

- 报告列表
- 报告详情
- 报告生成、复核、导出

### 7.5 重点人群

- 人群列表
- 分级管理
- 随访周期和负责人维护

### 7.6 报表统计

- 老人规模统计
- 预警趋势统计
- 机构/区域统计
- 设备数据统计

### 7.7 设备管理

- 设备列表
- 设备绑定、解绑
- 在线状态与数据上报查看

### 7.8 老人账户管理

- 老人登录账号创建与维护
- 状态启停

### 7.9 医生账户管理

- 医生账号创建与维护
- 角色、状态、机构归属管理

### 7.10 大数据决策分析

- 多维数据分析看板
- AI 生成分析结论
- 风险预测与建议

### 7.11 用户账号管理

- 系统账号、角色、权限管理
- 重置密码、禁用、启用、审计

### 7.12 个人中心

- 个人资料维护
- 修改密码
- 我的消息与待办

## 8. 接口契约总则

### 8.1 命名规则

- 资源名使用复数风格，如 `/elderly-profiles`、`/health-warnings`。
- 查询列表使用 `GET`。
- 创建使用 `POST`。
- 修改使用 `PUT` 或 `PATCH`。
- 删除使用 `DELETE`。

### 8.2 推荐接口前缀

- 统一前缀：`/api/v1`
- 可选扩展：`/api/admin/v1`
- 如后端使用网关，可由网关完成路径转发，不影响 OpenAPI 路径定义。

### 8.3 认证方式

- 推荐使用 JWT 或 双token 组合。
- 前端在请求头中携带 `Authorization: Bearer <token>`。

## 9. 接口列表

以下接口定义为建议契约，便于后续直接生成 OpenAPI 文档。实际落地时可按后端模块拆分为多个 tag。

### 9.1 登录与基础信息

#### 登录

- `POST /api/v1/auth/login`

请求：

```json
{
	"username": "admin",
	"password": "123456"
}
```

响应：

```json
{
	"code": 0,
	"message": "success",
	"data": {
		"token": "eyJhbGciOi...",
		"expireAt": "2026-07-07 10:00:00",
		"user": {
			"id": "u-001",
			"realName": "系统管理员",
			"roleCode": "admin"
		}
	},
	"traceId": "b3c1f8e9d8f14a7f"
}
```

#### 获取当前用户信息

- `GET /api/v1/auth/me`

#### 退出登录

- `POST /api/v1/auth/logout`

### 9.2 首页看板

#### 首页总览

- `GET /api/v1/dashboard/overview`

返回字段建议：

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

#### 首页图表数据

- `GET /api/v1/dashboard/charts`

图表数据建议拆分为：

- 老人数量趋势
- 预警等级分布
- 重点人群分布
- 设备在线趋势

### 9.3 老人档案

#### 老人列表

- `GET /api/v1/elderly-profiles`

查询参数：

- `keyword`
- `gender`
- `careLevel`
- `status`
- `regionCode`
- `pageNo`
- `pageSize`

#### 老人详情

- `GET /api/v1/elderly-profiles/{id}`

#### 新增老人

- `POST /api/v1/elderly-profiles`

#### 编辑老人

- `PUT /api/v1/elderly-profiles/{id}`

#### 删除老人

- `DELETE /api/v1/elderly-profiles/{id}`

#### 老人关联数据

- `GET /api/v1/elderly-profiles/{id}/warnings`
- `GET /api/v1/elderly-profiles/{id}/reports`
- `GET /api/v1/elderly-profiles/{id}/devices`
- `GET /api/v1/elderly-profiles/{id}/key-populations`

### 9.4 健康预警

#### 预警列表

- `GET /api/v1/health-warnings`

查询参数：

- `elderlyId`
- `warningType`
- `severity`
- `status`
- `source`
- `startTime`
- `endTime`

#### 预警详情

- `GET /api/v1/health-warnings/{id}`

#### 处理预警

- `POST /api/v1/health-warnings/{id}/handle`

请求建议：

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

#### 转派预警

- `POST /api/v1/health-warnings/{id}/assign`

### 9.5 评估报告

访问角色：医生、管理员。老人不可访问（老人可通过个人中心查看自己的报告）。

报告由医生创建，围绕具体病症/健康状况展开，每份报告至少包含一项病症评估，并给出用药建议和后续动作。不使用图表展示。

所有评估报告接口均由后端提供统一响应。

#### 报告列表

- `GET /api/v1/assessment-reports`
- 查询参数：`elderlyId`（可选）, `pageNo`, `pageSize`
- 返回 `PageResult<AssessmentReport>` 分页数据

#### 报告详情

- `GET /api/v1/assessment-reports/{id}`
- 返回 `ApiResponse<AssessmentReport>`

#### 生成评估报告

- `POST /api/v1/assessment-reports`
- 请求体（`AssessmentReportInput`）：

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

- 报告类型（`reportType`）建议枚举：`健康评估` / `康复评估` / `用药评估` / `睡眠评估`
- 等级（`grade`）建议枚举：`A` / `B` / `C` / `D`
- `summary`：综合评估结论
- `riskItems`：识别到的风险项，支持 tag 展示
- `recommendations`：按列表展示，每项包含具体用药名称、剂量、频次和后续动作建议

#### 删除报告

- `DELETE /api/v1/assessment-reports/{id}`

#### 导出评估报告

- `GET /api/v1/assessment-reports/{id}/export`

### 9.6 重点人群

#### 重点人群列表

- `GET /api/v1/key-populations`

#### 新增重点人群

- `POST /api/v1/key-populations`

#### 更新重点人群

- `PUT /api/v1/key-populations/{id}`

#### 关闭重点人群

- `POST /api/v1/key-populations/{id}/close`

### 9.7 报表统计

访问角色：仅管理员。老人和医生不可访问。

报表统计为全局数据看板，分为两部分：顶部非图表统计卡片 + 下方图表区域。图表使用 ECharts 渲染，后端返回 `domain` 对象，前端负责转换为 ECharts 配置。

#### 统计总览

- `GET /api/v1/reports/statistics/overview`
- 返回 `ApiResponse<StatisticsOverview>`

`StatisticsOverview` 数据结构（非图表字段）：

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

前端仅以统计卡片展示以下指标（不需要图表）：

| 指标 | 说明 |
| --- | --- |
| `totalElderlyCount` | 在档老人总数 |
| `totalDoctorCount` | 医生总数 |
| `totalDeviceCount` | 设备总数 |
| `unboundDeviceCount` | 未关联设备数量 |
| `deviceOnlineRate` | 设备在线率（百分比） |

#### 趋势图数据

- `GET /api/v1/reports/statistics/trends`
- 返回 `ApiResponse<Array<ChartDomain>>`，包含多个图表

`ChartDomain` 数据结构：

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

前端根据 `chartType` 字段动态选择 ECharts 图表类型：
- `line` → 折线图（趋势类）
- `bar` → 柱状图（对比类）
- `pie` → 饼图（分布类）

推荐的三个固定图表：
1. **重点人群变化趋势**（`line`）：各分类人群数量逐月变化
2. **老人档案变化趋势**（`line`）：新增/注销老人档案数量逐月变化
3. **未关联设备数量统计**（`pie`）：已关联 vs 未关联设备占比

#### 分布数据

- `GET /api/v1/reports/statistics/distributions`
- 返回 `ApiResponse<Array<ChartDomain>>`
- 数据结构与趋势图接口一致，可按区域/机构/风险等级等维度展示分布

#### 导出统计报表

- `GET /api/v1/reports/statistics/export`

### 9.8 设备管理

#### 设备列表

- `GET /api/v1/devices`

#### 设备详情

- `GET /api/v1/devices/{id}`

#### 绑定设备

- `POST /api/v1/devices/bind`

#### 解绑设备

- `POST /api/v1/devices/{id}/unbind`

#### 更新设备信息

- `PUT /api/v1/devices/{id}`

#### 设备数据上报记录

- `GET /api/v1/devices/{id}/reports`

### 9.9 老人账户管理

#### 老人账号列表

- `GET /api/v1/elderly-accounts`

#### 创建老人账号

- `POST /api/v1/elderly-accounts`

#### 重置密码

- `POST /api/v1/elderly-accounts/{id}/reset-password`

#### 启用/禁用账号

- `POST /api/v1/elderly-accounts/{id}/status`

### 9.10 医生账户管理

#### 医生账号列表

- `GET /api/v1/doctor-accounts`

#### 创建医生账号

- `POST /api/v1/doctor-accounts`

#### 编辑医生账号

- `PUT /api/v1/doctor-accounts/{id}`

#### 重置密码

- `POST /api/v1/doctor-accounts/{id}/reset-password`

### 9.11 用户账号管理

#### 系统账号列表

- `GET /api/v1/users`

#### 创建系统账号

- `POST /api/v1/users`

#### 账号详情

- `GET /api/v1/users/{id}`

#### 修改账号

- `PUT /api/v1/users/{id}`

#### 修改状态

- `POST /api/v1/users/{id}/status`

#### 分配角色

- `POST /api/v1/users/{id}/roles`

### 9.12 个人中心

#### 获取个人资料

- `GET /api/v1/profile`

#### 更新个人资料

- `PUT /api/v1/profile`

#### 修改密码

- `POST /api/v1/profile/change-password`

#### 我的待办

- `GET /api/v1/profile/todos`

## 10. 大数据决策分析与 AI Spec

该模块建议作为独立能力处理。前端仅负责展示结果，后端负责收集聚合数据并调用 AI 服务。AI 能力不应直接侵入业务页面，而应通过统一 spec 管理。

### 10.1 目标

- 形成面向管理层的数据分析结论。
- 生成风险预测、资源配置建议、重点人群关注建议。
- 支持结构化输出，便于前端卡片、图表和列表同时展示。

### 10.2 AI 输入 Spec

```json
{
	"scene": "care_decision_analysis",
	"tenantId": "tenant-001",
	"regionCode": "440305",
	"timeRange": {
		"start": "2026-06-01",
		"end": "2026-07-06"
	},
	"metrics": {
		"elderlyCount": 1280,
		"warningCount": 12,
		"unhandledWarningCount": 4,
		"highRiskPopulationCount": 86,
		"deviceOnlineRate": 0.93
	},
	"dimensions": {
		"groupBy": ["region", "institution", "warningType"]
	},
	"constraints": {
		"language": "zh-CN",
		"outputFormat": "json",
		"maxInsightCount": 5,
		"mustInclude": ["trend", "risk", "suggestion"]
	}
}
```

### 10.3 AI 输出 Spec

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
		{
			"chartType": "line",
			"title": "预警趋势",
			"optionKey": "warningTrend"
		}
	]
}
```

### 10.4 AI 接口建议

- `POST /api/v1/ai/analysis/care-decision`
- `GET /api/v1/ai/analysis/care-decision/history`
- `GET /api/v1/ai/analysis/care-decision/{id}`

### 10.5 AI 调用边界

- AI 输出必须可结构化解析，禁止仅返回大段自由文本作为唯一结果。
- AI 只给建议，不直接执行写操作。
- 后端应对 AI 结果做可信度校验、敏感词过滤和字段白名单控制。

## 11. ECharts 接入约定

### 11.1 前端职责

- 前端只根据后端返回的图表数据渲染 ECharts。
- 图表配置应尽量保持前端通用化，避免为每张图手写一套接口。

### 11.2 图表数据结构建议

```json
{
	"chartType": "bar",
	"title": "重点人群分布",
	"xAxis": ["慢病", "失能", "高龄"],
	"series": [
		{
			"name": "人数",
			"data": [120, 46, 78]
		}
	]
}
```

### 11.3 约定

- 后端返回数据要稳定，字段名不要频繁变更。
- 图表标题、单位、排序规则尽量由后端给出。
- 前端仅负责样式适配和交互，不负责业务口径计算。

## 12. OpenAPI 规范建议

### 12.1 输出要求

后端至少应输出以下内容：

- `openapi` 版本声明
- `info` 基本信息
- `servers`
- `tags`
- `paths`
- `components/schemas`
- `components/securitySchemes`

### 12.2 Tag 建议

- `Auth`
- `Dashboard`
- `ElderlyProfile`
- `HealthWarning`
- `AssessmentReport`
- `KeyPopulation`
- `ReportStatistics`
- `Device`
- `ElderlyAccount`
- `DoctorAccount`
- `UserAccount`
- `Profile`
- `AIAnalysis`

### 12.3 Schema 建议

- 统一封装 `ApiResponse<T>`
- 统一分页封装 `PageResult<T>`
- 核心实体单独建模，避免在接口里重复散落定义

## 13. 前后端联调约定

### 13.1 前端需要后端提前确认的内容

- 登录认证方式
- 权限粒度和数据权限规则
- 各模块字段的枚举值
- 图片、文件、导出、上传的处理方式
- AI 分析输出字段是否固定

### 13.2 后端需要前端提前确认的内容

- 页面上实际需要展示的字段
- 搜索条件和筛选项
- 列表中的默认排序
- 图表所需维度和指标
- 空态、异常态和加载态展示方式

### 13.3 联调检查点

- 接口路径是否与 OpenAPI 一致。
- 请求参数是否与 Schema 一致。
- 响应字段是否满足页面渲染需要。
- 错误码是否能被前端正确识别并提示。
- 文件导出、上传、下载是否可直接联调。

## 14. 版本管理建议

- 文档和 OpenAPI 文件需要纳入版本控制。
- 每次接口变更必须同步更新接口契约。
- 对于破坏性变更，建议通过版本号或兼容字段策略处理。

## 15. 交付建议

建议按以下顺序推进：

1. 后端先输出 OpenAPI 初版。
2. 前端基于 OpenAPI 生成 API Client。
3. 双方确认核心列表、详情和看板接口。
4. 优先打通登录、首页、老人档案、预警、设备和报表。
5. 最后接入 AI 决策分析与导出能力。

## 16. 附录：最小可落地接口清单

如果需要先做最小闭环，建议优先实现以下接口：

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

## 17. 结语

本文档作为前后端协同开发的第一版接口契约草案，后续可根据实际业务字段、数据库设计和页面原型持续补全。建议由后端维护 OpenAPI 源文件，前端以生成代码的方式接入，确保接口稳定、联调高效、迭代可控。
