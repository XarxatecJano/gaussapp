# Sistema de Gestión de Alumnos

Sistema web para gestionar alumnos con Node.js, Hono y PostgreSQL.

## Requisitos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm

## Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar base de datos:**
   - Crear base de datos PostgreSQL llamada `gauss_students`
   - Ejecutar el script SQL: `sql/create_database.sql`

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales de base de datos
   ```

4. **Compilar el proyecto:**
   ```bash
   npm run build
   ```

5. **Iniciar el servidor:**
   ```bash
   npm start
   ```

   Para desarrollo con recarga automática:
   ```bash
   npm run dev
   ```

## Estructura del Proyecto

```
src/
├── config/         # Configuración (base de datos, etc.)
├── models/         # Modelos de datos
├── repositories/   # Capa de acceso a datos
├── services/       # Lógica de negocio
├── controllers/    # Controladores MVC
├── routes/         # Definición de rutas
├── views/          # Vistas HTML
├── middleware/     # Middleware personalizado
└── index.ts        # Punto de entrada

public/
├── css/           # Archivos CSS
└── js/            # Archivos JavaScript del cliente

sql/               # Scripts de base de datos
tests/             # Pruebas unitarias
```

## API Endpoints

- `GET /students` - Listar todos los estudiantes
- `GET /students/:id` - Obtener estudiante por ID
- `POST /students` - Crear nuevo estudiante
- `PATCH /students/:id` - Actualizar estudiante
- `DELETE /students/:id` - Eliminar estudiante
- `GET /students/search` - Buscar estudiantes por nombre

## Funcionalidades

- ✅ Alta de alumnos mediante formulario web
- ✅ Búsqueda y actualización de datos de alumnos
- ✅ Eliminación de alumnos por búsqueda
- ✅ API REST completa
- ✅ Interfaz web responsive