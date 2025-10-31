-- Script de inicialización de base de datos
-- Tabla Student con índices optimizados

CREATE TABLE IF NOT EXISTS student (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    second_last_name VARCHAR(100),
    birth_date DATE NOT NULL,
    school_name VARCHAR(150) NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    withdrawal_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_student_name ON student(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_student_active ON student(is_active);
CREATE INDEX IF NOT EXISTS idx_student_school ON student(school_name);