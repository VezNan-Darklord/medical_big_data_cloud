CREATE TABLE sys_role (
    id VARCHAR(64) PRIMARY KEY,
    role_code VARCHAR(50) NOT NULL UNIQUE,
    role_name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);

CREATE TABLE sys_user (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    real_name VARCHAR(50) NOT NULL,
    role_code VARCHAR(20) NOT NULL,
    mobile VARCHAR(20) UNIQUE,
    institution_id VARCHAR(64),
    region_code VARCHAR(64),
    status VARCHAR(20) NOT NULL,
    token_version INTEGER NOT NULL DEFAULT 0,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);
CREATE INDEX idx_user_role ON sys_user(role_code);
CREATE INDEX idx_user_status ON sys_user(status);

CREATE TABLE elderly_profile (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    birthday DATE,
    age INTEGER,
    phone VARCHAR(20),
    address VARCHAR(500),
    institution_id VARCHAR(64),
    region_code VARCHAR(64),
    medical_history VARCHAR(1000),
    care_level VARCHAR(10),
    tags TEXT,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);
CREATE INDEX idx_elderly_name ON elderly_profile(name);
CREATE INDEX idx_elderly_institution ON elderly_profile(institution_id);
CREATE INDEX idx_elderly_region ON elderly_profile(region_code);
CREATE INDEX idx_elderly_status ON elderly_profile(status);

CREATE TABLE health_warning (
    id VARCHAR(64) PRIMARY KEY,
    elderly_id VARCHAR(64) NOT NULL,
    warning_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    source VARCHAR(20) NOT NULL,
    metric_name VARCHAR(50),
    metric_value DOUBLE,
    threshold_value DOUBLE,
    status VARCHAR(20) NOT NULL,
    occurred_at TIMESTAMP NOT NULL,
    handled_at TIMESTAMP,
    handler_id VARCHAR(64),
    handler_name VARCHAR(100),
    handle_result VARCHAR(500),
    next_action VARCHAR(50),
    remark VARCHAR(500),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);
CREATE INDEX idx_warning_elderly ON health_warning(elderly_id);
CREATE INDEX idx_warning_status ON health_warning(status);
CREATE INDEX idx_warning_severity ON health_warning(severity);
CREATE INDEX idx_warning_occurred ON health_warning(occurred_at);

CREATE TABLE assessment_report (
    id VARCHAR(64) PRIMARY KEY,
    elderly_id VARCHAR(64) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    grade VARCHAR(10) NOT NULL,
    summary VARCHAR(2000) NOT NULL,
    risk_items TEXT,
    recommendations TEXT,
    assessor_id VARCHAR(64),
    assessed_at TIMESTAMP NOT NULL,
    review_status VARCHAR(20) NOT NULL,
    reviewer_id VARCHAR(64),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);
CREATE INDEX idx_report_elderly ON assessment_report(elderly_id);
CREATE INDEX idx_report_assessed ON assessment_report(assessed_at);
CREATE INDEX idx_report_status ON assessment_report(review_status);

CREATE TABLE key_population (
    id VARCHAR(64) PRIMARY KEY,
    elderly_id VARCHAR(64) NOT NULL,
    category VARCHAR(50) NOT NULL,
    reason VARCHAR(500),
    level VARCHAR(10) NOT NULL,
    owner_doctor_id VARCHAR(64),
    follow_up_cycle_days INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);
CREATE INDEX idx_key_population_elderly ON key_population(elderly_id);
CREATE INDEX idx_key_population_owner ON key_population(owner_doctor_id);
CREATE INDEX idx_key_population_status ON key_population(status);

CREATE TABLE device (
    id VARCHAR(64) PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    device_sn VARCHAR(100) NOT NULL UNIQUE,
    elderly_id VARCHAR(64),
    binding_status VARCHAR(20) NOT NULL,
    online_status VARCHAR(20) NOT NULL,
    last_report_at TIMESTAMP,
    firmware_version VARCHAR(20),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);
CREATE INDEX idx_device_elderly ON device(elderly_id);
CREATE INDEX idx_device_binding ON device(binding_status);
CREATE INDEX idx_device_online ON device(online_status);

CREATE TABLE device_data_report (
    id VARCHAR(64) PRIMARY KEY,
    device_id VARCHAR(64) NOT NULL,
    reported_at TIMESTAMP NOT NULL,
    metrics_json TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);
CREATE INDEX idx_device_report_device ON device_data_report(device_id);
CREATE INDEX idx_device_report_time ON device_data_report(reported_at);

CREATE TABLE refresh_token (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);
CREATE INDEX idx_refresh_user ON refresh_token(user_id);
CREATE INDEX idx_refresh_expires ON refresh_token(expires_at);

CREATE TABLE ai_analysis (
    id VARCHAR(64) PRIMARY KEY,
    scene VARCHAR(50) NOT NULL,
    tenant_id VARCHAR(64),
    region_code VARCHAR(64),
    summary VARCHAR(2000) NOT NULL,
    insights_json TEXT NOT NULL,
    actions_json TEXT NOT NULL,
    charts_json TEXT NOT NULL,
    created_by VARCHAR(64),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);
CREATE INDEX idx_ai_analysis_scene ON ai_analysis(scene);
CREATE INDEX idx_ai_analysis_creator ON ai_analysis(created_by);

INSERT INTO sys_role (
    id, role_code, role_name, description, status, created_at, updated_at, deleted
) VALUES
    ('role-admin', 'admin', '系统管理员', '全局配置、账号与权限管理', 'enabled', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE),
    ('role-doctor', 'doctor', '医生', '健康档案、预警与评估管理', 'enabled', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE),
    ('role-operator', 'operator', '运营人员', '设备、报表与老人账户管理', 'enabled', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE),
    ('role-analyst', 'analyst', '只读分析人员', '只读查看看板与报表', 'enabled', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE),
    ('role-elderly', 'elderly', '老人用户', '查看本人健康资料', 'enabled', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE);
