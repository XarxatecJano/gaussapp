Stack: HTML, CSS, NodeJS, Hono

Arquitectura: MVC

Modelos de datos: 

TABLE Student (
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

API: quiero get students, get student:id, post student, patch student y delete student

Estrategia de pruebas: quiero pruebas unitarias para todos los servicios