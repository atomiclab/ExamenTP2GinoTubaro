# API Node.js - Examen TP2

**Autor**: Gino Tubaro  
**Fecha**: 8 de Octubre 2025  
**Curso**: Analista de Sistemas

## 📋 Descripción

API REST desarrollada en Node.js que implementa tres endpoints principales con autenticación JWT, manejo de archivos JSON/CSV y operaciones CRUD completas.

## 🚀 Instalación

### Prerrequisitos
- Node.js >= 14.0.0
- npm >= 6.0.0

### Instalación de dependencias
```bash
npm install
```

### Configuración de variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables según necesidades
nano .env
```

### Ejecutar en desarrollo
```bash
npm run dev
```

### Linteo y otros comandos:
```bash
npm run lint 
npm run format
```

### Ejecutar en producción
```bash
npm start
```

## 🛠️ Tecnologías Utilizadas

- **Express.js** - Framework web
- **Morgan** - Middleware de logging
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **UUID** - Generación de IDs únicos
- **Biome** - Linting y formateo de código

## 📁 Estructura del Proyecto

```
proyecto/
├── src/
│   ├── controllers/     # Controladores de rutas
│   ├── services/        # Lógica de negocio
│   ├── routes/          # Definición de rutas
│   ├── middleware/      # Middlewares (JWT, etc.)
│   └── utils/           # Utilidades
├── data/                # Archivos de datos
│   ├── productos.json   # Productos del sistema
│   ├── usuarios.csv     # Usuarios externos
│   └── usuariodb.json   # Base de datos de usuarios
├── tests/               # Archivos de prueba HTTP
└── docs/                # Documentación adicional
```

## 🔗 Endpoints de la API

### Base URL
```
http://localhost:3003
```

---

## 📦 **ENDPOINT 1: Productos**

### GET /api/productos
Obtiene todos los productos desde archivo JSON local.

**Respuesta exitosa (200):**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "nombre": "Laptop Gaming",
      "precio": 1200,
      "categoria": "Electrónicos",
      "stock": 15
    }
  ],
  "count": 1,
  "message": "Productos obtenidos exitosamente"
}
```

**Error si no existe archivo (404):**
```json
{
  "status": 404,
  "error": "Archivo de productos no encontrado",
  "code": "FILE_NOT_FOUND",
  "message": "No se pudo cargar la información de productos"
}
```

---

## 🌐 **ENDPOINT 2: Usuarios Externos**

### GET /api/usuarios-externos
Consume API externa de videojuegos y almacena datos en CSV.

**Respuesta exitosa (200):**
```json
{
  "status": 200,
  "data": {
    "totalRecords": 16598,
    "headers": ["Name", "Platform", "Year_of_Release", ...],
    "source": "Github del profe fue fetcheado con exito",
    "filePath": "/path/to/data/usuarios.csv"
  },
  "message": "Datos externos obtenidos y almacenados exitosamente"
}
```

**Error en API externa (500):**
```json
{
  "status": 500,
  "error": "Error al consumir API externa",
  "details": "HTTP error! status: 404",
  "message": "No se pudo procesar la información externa"
}
```

---

## 👥 **ENDPOINT 3: CRUD de Usuarios**

### GET /api/usuarios
Obtiene todos los usuarios.

**Respuesta (200):**
```json
{
  "status": 200,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "nombre": "Juan Carlos Pérez",
      "email": "juancarlos@example.com",
      "telefono": "123-456-7890",
      "edad": 26,
      "activo": true,
      "fechaCreacion": "2025-01-01"
    }
  ],
  "count": 1,
  "message": "Usuarios obtenidos exitosamente"
}
```

### GET /api/usuarios/:id
Obtiene un usuario por ID.

**Parámetros:**
- `id` (UUID): ID único del usuario

### POST /api/usuarios
Crea un nuevo usuario.

**Body:**
```json
{
  "nombre": "Usuario Nuevo",
  "email": "nuevo@example.com",
  "telefono": "555-999-8888",
  "edad": 30,
  "activo": true
}
```

**Respuesta (201):**
```json
{
  "status": 201,
  "data": {
    "id": "uuid-generado",
    "nombre": "Usuario Nuevo",
    "email": "nuevo@example.com",
    "telefono": "555-999-8888",
    "edad": 30,
    "activo": true,
    "fechaCreacion": "2025-10-09"
  },
  "message": "Usuario creado exitosamente"
}
```

### PUT /api/usuarios/:id
Actualiza un usuario completo.

### DELETE /api/usuarios/:id
Elimina un usuario por ID.

---

## 🔐 **AUTENTICACIÓN JWT**

### POST /api/auth/register
Registra un nuevo usuario con contraseña encriptada.

**Body:**
```json
{
  "nombre": "Usuario Demo",
  "email": "demo@example.com",
  "password": "123456",
  "telefono": "555-0000",
  "edad": 30
}
```

**Respuesta (201):**
```json
{
  "status": 201,
  "data": {
    "user": {
      "id": "d37eab7c-3cff-47d3-bba0-e83e6fc80fa7",
      "nombre": "Usuario Demo",
      "email": "demo@example.com",
      "telefono": "555-0000",
      "edad": 30,
      "activo": true,
      "fechaCreacion": "2025-10-09"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Usuario registrado exitosamente"
}
```

### POST /api/auth/login
Inicia sesión y obtiene token JWT.

**Body:**
```json
{
  "email": "demo@example.com",
  "password": "123456"
}
```

**Respuesta (200):**
```json
{
  "status": 200,
  "data": {
    "user": {
      "id": "d37eab7c-3cff-47d3-bba0-e83e6fc80fa7",
      "nombre": "Usuario Demo",
      "email": "demo@example.com",
      "telefono": "555-0000",
      "edad": 30,
      "activo": true,
      "fechaCreacion": "2025-10-09"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login exitoso"
}
```

### GET /api/auth/profile
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "status": 200,
  "data": {
    "userId": "d37eab7c-3cff-47d3-bba0-e83e6fc80fa7",
    "email": "demo@example.com",
    "nombre": "Usuario Demo",
    "iat": 1759972284,
    "exp": 1759975884
  },
  "message": "Perfil obtenido exitosamente"
}
```

---

## 🧪 **Pruebas**

### Usando RestClient (VS Code)
1. Instala la extensión "REST Client"
2. Abre los archivos `.http` en la carpeta `tests/`
3. Haz clic en "Send Request"

### Usando cURL

**Registro:**
```bash
curl -X POST http://localhost:3003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Usuario Demo","email":"demo@example.com","password":"123456"}'
```

**Login:**
```bash
curl -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"123456"}'
```

**Perfil protegido:**
```bash
curl -X GET http://localhost:3003/api/auth/profile \
  -H "Authorization: Bearer <tu-token-jwt>"
```

---

## 📊 **Códigos de Estado HTTP**

- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos inválidos
- **401**: Unauthorized - Token requerido/inválido
- **403**: Forbidden - Usuario desactivado
- **404**: Not Found - Recurso no encontrado
- **409**: Conflict - Email ya existe
- **500**: Internal Server Error - Error del servidor

---

## 🔧 **Scripts Disponibles**

```bash
npm run dev      # Ejecutar en modo desarrollo con nodemon
npm start        # Ejecutar en modo producción
npm run lint     # Verificar código con Biome
npm run format   # Formatear código con Biome
```

---

## 🔧 **Variables de Entorno**

El proyecto utiliza variables de entorno para configuración. Copia `.env.example` a `.env` y ajusta los valores:

```bash
# Configuración del servidor
PORT=3003
HOST=127.0.0.1
NODE_ENV=development

# Configuración JWT
JWT_SECRET=mi_secreto_super_seguro_para_el_examen_gino_tubaro_2025
JWT_EXPIRES_IN=1h

# Configuración de base de datos
DB_PATH=./data/usuariodb.json
PRODUCTOS_PATH=./data/productos.json
CSV_PATH=./data/usuarios.csv

# API Externa
EXTERNAL_API_URL=https://raw.githubusercontent.com/Andru-1987/csv_files_ds/refs/heads/main/Video_Games.csv

# Configuración de logging
LOG_LEVEL=combined
```

## 📝 **Notas de Desarrollo**

- **UUID**: Todos los usuarios tienen IDs únicos generados automáticamente
- **Encriptación**: Las contraseñas se almacenan encriptadas con bcryptjs
- **JWT**: Tokens con expiración configurable via `JWT_EXPIRES_IN`
- **Validaciones**: Email único, datos requeridos
- **Logging**: Morgan configurado para logging de requests
- **Formateo**: Biome configurado para mantener código consistente
- **Variables de entorno**: Configuración centralizada en `.env`

---

## 👤 **Usuario de Prueba**

Para probar la API, puedes usar:
- **Email**: `demo@example.com`
- **Password**: `123456`

---
