# Plan de Implementación - Gestión de Alumnos

## Tareas de Implementación

- [x] 1. Configurar estructura del proyecto y dependencias
  - Inicializar proyecto Node.js con estructura MVC
  - Instalar y configurar Hono framework
  - Configurar base de datos PostgreSQL
  - Crear estructura de directorios (models, views, controllers, routes)
  - _Requisitos: Historia 1, 2, 3 (infraestructura base)_

- [ ] 2. Implementar modelo de datos Student
  - [x] 2.1 Crear esquema de base de datos
    - Ejecutar script SQL para crear tabla Student con todos los campos
    - Configurar índices para optimizar búsquedas por nombre y apellidos
    - _Requisitos: Historia 1, 2, 3 (estructura de datos)_
  
  - [x] 2.2 Implementar modelo Student en Node.js
    - Crear clase/interfaz Student con validaciones
    - Implementar métodos de serialización/deserialización
    - Validar campos obligatorios (first_name, last_name, birth_date, school_name)
    - _Requisitos: Historia 1 (validación de datos de alta)_
  
  - [x]* 2.3 Escribir pruebas unitarias para el modelo Student
    - Crear tests para validaciones de campos
    - Probar serialización/deserialización de datos
    - _Requisitos: Estrategia de pruebas_

- [ ] 3. Implementar capa de acceso a datos (Repository)
  - [x] 3.1 Crear StudentRepository con operaciones CRUD
    - Implementar método create() para dar de alta estudiantes
    - Implementar método findByName() para búsqueda por nombre y apellidos
    - Implementar método findById() para obtener estudiante por ID
    - Implementar método update() para actualizar datos
    - Implementar método delete() para eliminación lógica (is_active = false)
    - Implementar método findAll() para listar todos los estudiantes
    - _Requisitos: Historia 1 (alta), Historia 2 (búsqueda y actualización), Historia 3 (eliminación)_
  
  - [ ]* 3.2 Escribir pruebas unitarias para StudentRepository
    - Crear tests para cada operación CRUD
    - Probar casos de error y validaciones
    - _Requisitos: Estrategia de pruebas_

- [ ] 4. Implementar servicios de negocio
  - [ ] 4.1 Crear StudentService con lógica de negocio
    - Implementar createStudent() con validaciones de negocio
    - Implementar searchStudentsByName() con lógica de búsqueda
    - Implementar updateStudent() con validaciones de actualización
    - Implementar deleteStudent() con eliminación lógica
    - Implementar getAllStudents() para listado completo
    - _Requisitos: Historia 1 (lógica de alta), Historia 2 (lógica de búsqueda/actualización), Historia 3 (lógica de eliminación)_
  
  - [ ]* 4.2 Escribir pruebas unitarias para StudentService
    - Crear tests para cada método del servicio
    - Probar validaciones de negocio y casos de error
    - _Requisitos: Estrategia de pruebas_

- [ ] 5. Implementar API REST con Hono
  - [ ] 5.1 Crear controlador StudentController
    - Implementar POST /students para crear estudiante
    - Implementar GET /students para listar todos los estudiantes
    - Implementar GET /students/:id para obtener estudiante por ID
    - Implementar PATCH /students/:id para actualizar estudiante
    - Implementar DELETE /students/:id para eliminar estudiante
    - Implementar GET /students/search?name=X&lastName=Y para búsqueda
    - _Requisitos: Historia 1 (endpoint POST), Historia 2 (endpoints GET y PATCH), Historia 3 (endpoint DELETE)_
  
  - [ ] 5.2 Configurar rutas y middleware
    - Configurar rutas en Hono para todos los endpoints
    - Implementar middleware de validación de datos
    - Implementar middleware de manejo de errores
    - _Requisitos: Historia 1, 2, 3 (infraestructura API)_
  
  - [ ]* 5.3 Escribir pruebas de integración para API
    - Crear tests para cada endpoint
    - Probar casos de éxito y error para cada operación
    - _Requisitos: Estrategia de pruebas_

- [ ] 6. Implementar interfaz web (Views)
  - [ ] 6.1 Crear página de alta de alumno
    - Desarrollar formulario HTML con todos los campos requeridos
    - Implementar validación client-side con JavaScript
    - Conectar formulario con API POST /students
    - Mostrar mensajes de éxito/error al usuario
    - _Requisitos: Historia 1 (formulario web para alta)_
  
  - [ ] 6.2 Crear página de búsqueda y actualización
    - Desarrollar formulario de búsqueda por nombre y apellidos
    - Implementar listado de resultados de búsqueda
    - Crear formulario de edición con datos pre-cargados
    - Conectar con APIs GET /students/search y PATCH /students/:id
    - _Requisitos: Historia 2 (búsqueda y edición de datos)_
  
  - [ ] 6.3 Crear página de eliminación de alumno
    - Desarrollar formulario de búsqueda para eliminación
    - Implementar confirmación antes de eliminar
    - Conectar con API DELETE /students/:id
    - Mostrar mensajes de confirmación
    - _Requisitos: Historia 3 (eliminación por búsqueda)_
  
  - [ ] 6.4 Implementar estilos CSS
    - Crear estilos responsivos para todos los formularios
    - Implementar diseño consistente en todas las páginas
    - Añadir estilos para mensajes de éxito/error
    - _Requisitos: Historia 1, 2, 3 (interfaz web)_

- [ ] 7. Integración y configuración final
  - [ ] 7.1 Configurar servidor y conexión a base de datos
    - Configurar variables de entorno para conexión DB
    - Implementar pool de conexiones
    - Configurar puerto y host del servidor
    - _Requisitos: Historia 1, 2, 3 (infraestructura)_
  
  - [ ] 7.2 Crear scripts de inicialización
    - Script para crear base de datos y tablas
    - Script para datos de prueba (opcional)
    - Script de inicio del servidor
    - _Requisitos: Historia 1, 2, 3 (despliegue)_
  
  - [ ]* 7.3 Escribir pruebas end-to-end
    - Crear tests que simulen flujos completos de usuario
    - Probar integración entre frontend y backend
    - _Requisitos: Estrategia de pruebas_

## Notas de Implementación

- Las tareas marcadas con * son opcionales y se enfocan en testing
- Cada tarea incluye referencias específicas a las historias de usuario
- La implementación sigue el patrón MVC especificado en el diseño
- Se utiliza eliminación lógica (is_active = false) en lugar de eliminación física
- La búsqueda por nombre incluye tanto first_name como last_name para mayor flexibilidad