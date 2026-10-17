PRAGMA foreign_keys = ON;

-- =========================================
-- GOOD SMS
-- BANCO PRINCIPAL
-- =========================================


-- =========================================
-- ADMINISTRADORES
-- =========================================

CREATE TABLE IF NOT EXISTS admins (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    pin_hash TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'active'
        CHECK (
            status IN (
                'active',
                'blocked'
            )
        ),

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    last_login_at TEXT

);


-- =========================================
-- PERMISSÕES
-- =========================================

CREATE TABLE IF NOT EXISTS admin_permissions (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    admin_id INTEGER NOT NULL,

    permission TEXT NOT NULL,

    enabled INTEGER NOT NULL DEFAULT 0,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (
        admin_id,
        permission
    ),

    FOREIGN KEY (
        admin_id
    )
    REFERENCES admins(id)
    ON DELETE CASCADE

);


-- =========================================
-- SESSÕES
-- =========================================

CREATE TABLE IF NOT EXISTS sessions (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    admin_id INTEGER NOT NULL,

    session_token_hash TEXT NOT NULL UNIQUE,

    ip_hash TEXT,

    user_agent_hash TEXT,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    expires_at TEXT NOT NULL,

    revoked_at TEXT,

    FOREIGN KEY (
        admin_id
    )
    REFERENCES admins(id)
    ON DELETE CASCADE

);


-- =========================================
-- APIS / INTEGRAÇÕES
-- =========================================

CREATE TABLE IF NOT EXISTS api_integrations (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    identifier TEXT NOT NULL,

    base_url TEXT NOT NULL,

    api_key_encrypted TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'active'
        CHECK (
            status IN (
                'active',
                'inactive'
            )
        ),

    last_checked_at TEXT,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP

);


-- =========================================
-- CONFIGURAÇÕES
-- =========================================

CREATE TABLE IF NOT EXISTS settings (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    setting_key TEXT NOT NULL UNIQUE,

    setting_value TEXT NOT NULL,

    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP

);


-- =========================================
-- MÓDULOS
-- =========================================

CREATE TABLE IF NOT EXISTS modules (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    module_key TEXT NOT NULL UNIQUE,

    enabled INTEGER NOT NULL DEFAULT 1,

    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP

);


-- =========================================
-- LOGS DE AUDITORIA
-- =========================================

CREATE TABLE IF NOT EXISTS audit_logs (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    admin_id INTEGER,

    event_type TEXT NOT NULL,

    event_name TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'success'
        CHECK (
            status IN (
                'success',
                'warning',
                'error'
            )
        ),

    source TEXT,

    ip_hash TEXT,

    details TEXT,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (
        admin_id
    )
    REFERENCES admins(id)
    ON DELETE SET NULL

);


-- =========================================
-- TENTATIVAS DE LOGIN
-- =========================================

CREATE TABLE IF NOT EXISTS login_attempts (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    email_hash TEXT NOT NULL,

    ip_hash TEXT,

    success INTEGER NOT NULL DEFAULT 0,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP

);


-- =========================================
-- ÍNDICES
-- =========================================

CREATE INDEX IF NOT EXISTS
idx_admins_email
ON admins(email);


CREATE INDEX IF NOT EXISTS
idx_sessions_admin
ON sessions(admin_id);


CREATE INDEX IF NOT EXISTS
idx_sessions_expires
ON sessions(expires_at);


CREATE INDEX IF NOT EXISTS
idx_api_status
ON api_integrations(status);


CREATE INDEX IF NOT EXISTS
idx_audit_admin
ON audit_logs(admin_id);


CREATE INDEX IF NOT EXISTS
idx_audit_type
ON audit_logs(event_type);


CREATE INDEX IF NOT EXISTS
idx_audit_created
ON audit_logs(created_at);


CREATE INDEX IF NOT EXISTS
idx_login_email
ON login_attempts(email_hash);


CREATE INDEX IF NOT EXISTS
idx_login_created
ON login_attempts(created_at);


-- =========================================
-- CONFIGURAÇÕES INICIAIS
-- =========================================

INSERT OR IGNORE INTO settings (
    setting_key,
    setting_value
)

VALUES
    (
        'site_name',
        'GOOD SMS'
    ),

    (
        'site_status',
        'online'
    ),

    (
        'support_email',
        ''
    ),

    (
        'timezone',
        'America/Sao_Paulo'
    );


-- =========================================
-- MÓDULOS INICIAIS
-- =========================================

INSERT OR IGNORE INTO modules (
    module_key,
    enabled
)

VALUES
    (
        'moduleApis',
        1
    ),

    (
        'moduleAdmins',
        1
    ),

    (
        'moduleLogs',
        1
    ),

    (
        'moduleMonitoring',
        1
    );
