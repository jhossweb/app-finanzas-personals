# 📊 App Finanzas Personales

Una aplicación de gestión de finanzas personales construida con NestJS, TypeScript y SQLite.

## 🚀 Descripción

Esta aplicación permite a los usuarios gestionar sus finanzas personales de manera eficiente, incluyendo:

- **Gestión de usuarios** con autenticación JWT
- **Categorización de transacciones** (ingresos, gastos, transferencias, inversiones, deudas, ahorros)
- **Registro de transacciones** con montos, monedas y descripciones
- **Sistema de roles** (USER y ADMIN)
- **Jerarquía de categorías** (categorías padre e hijas)
- **API RESTful** completa con autenticación

## 🛠️ Tecnologías Utilizadas

- **Backend**: NestJS 11.0.1
- **Lenguaje**: TypeScript 5.7.3
- **Base de Datos**: SQLite 5.1.7
- **ORM**: TypeORM 0.3.25
- **Autenticación**: JWT, Passport
- **Validación**: class-validator, class-transformer
- **Encriptación**: bcryptjs

## 📁 Estructura del Proyecto

```
src/
├── auth/                 # Autenticación y autorización
│   ├── controllers/      # Controladores de auth
│   ├── services/         # Servicios de auth
│   ├── strategies/       # Estrategias de Passport
│   └── dto/             # Data Transfer Objects
├── users/               # Gestión de usuarios
│   ├── controllers/      # Controladores de usuarios
│   ├── services/         # Servicios de usuarios
│   ├── entities/         # Entidad User
│   └── dto/             # DTOs de usuarios
├── categories/           # Gestión de categorías
│   ├── controllers/      # Controladores de categorías
│   ├── services/         # Servicios de categorías
│   ├── entities/         # Entidad Category
│   └── dto/             # DTOs de categorías
├── transactions/         # Gestión de transacciones
│   ├── controllers/      # Controladores de transacciones
│   ├── services/         # Servicios de transacciones
│   ├── entities/         # Entidad Transaction
│   └── dto/             # DTOs de transacciones
├── roles/               # Sistema de roles
│   ├── enum/            # Enumeraciones de roles
│   ├── guards/          # Guards de autorización
│   └── decorators/      # Decoradores de roles
├── config/              # Configuración
│   ├── data.source.ts   # Configuración de base de datos
│   └── base.entity.ts   # Entidad base
└── main.ts              # Punto de entrada
```

## 🗄️ Modelo de Datos

### Usuarios (Users)
- `id`: UUID (clave primaria)
- `username`: Nombre de usuario único
- `email`: Email único
- `password`: Contraseña encriptada
- `role`: Rol del usuario (USER/ADMIN)
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de actualización

### Categorías (Categories)
- `id`: UUID (clave primaria)
- `name`: Nombre de la categoría
- `type`: Tipo (ingreso, gasto, transferencia, inversión, deuda, ahorro, otro)
- `description`: Descripción opcional
- `isDefault`: Si es categoría por defecto
- `isActive`: Si está activa
- `userId`: Usuario propietario
- `parentId`: Categoría padre (jerarquía)

### Transacciones (Transactions)
- `id`: UUID (clave primaria)
- `amount`: Monto de la transacción
- `currency`: Moneda
- `description`: Descripción opcional
- `userId`: Usuario propietario
- `categoryId`: Categoría asociada
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de actualización

## 🔐 Autenticación y Autorización

### JWT Authentication
- Tokens almacenados en cookies HTTP-only
- Expiración configurable (2 horas por defecto)
- Estrategia `jwt-cookie` para validación

### Roles
- **USER**: Usuario estándar con acceso a sus propios datos
- **ADMIN**: Administrador con acceso completo

### Guards
- `AuthGuard('jwt-cookie')`: Protege rutas que requieren autenticación
- `RolesGuard`: Valida roles de usuario

## 📡 API Endpoints

### Autenticación
```
POST /api/auth/register    # Registrar nuevo usuario
POST /api/auth/login       # Iniciar sesión
```

### Usuarios
```
GET    /api/users          # Obtener todos los usuarios
GET    /api/users/:id      # Obtener usuario por ID
POST   /api/users          # Crear usuario
PATCH  /api/users/:id      # Actualizar usuario
DELETE /api/users/:id      # Eliminar usuario
```

### Categorías
```
GET    /api/categories                    # Obtener categorías del usuario
POST   /api/categories/user              # Crear categoría padre (ADMIN)
POST   /api/categories/personal          # Crear categoría personal
GET    /api/categories/personal/:id      # Obtener categoría personal
PATCH  /api/categories/personal/:id      # Actualizar categoría personal
PATCH  /api/categories/personal/:id/active # Activar/desactivar categoría
DELETE /api/categories/:id               # Eliminar categoría
```

### Transacciones
```
GET    /api/transactions                 # Obtener todas las transacciones
GET    /api/transactions/:id             # Obtener transacción por ID
GET    /api/transactions/category/:categoryId # Obtener transacciones por categoría
POST   /api/transactions                 # Crear transacción
PATCH  /api/transactions/:id             # Actualizar transacción
DELETE /api/transactions/:id             # Eliminar transacción
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone git@github.com:jhossweb/app-finanzas-personals.git
cd app-finanzas-personals
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .develop.env .env

# Editar las variables según tu entorno
APP_PORT=8100
DATABASE='databases/database.db'
API_PREFIX='api'
JWT_SECRET='tu-secreto-jwt'
JWT_EXPIRES_IN='2h'
```

4. **Ejecutar migraciones**
```bash
npm run m:run
```

5. **Iniciar el servidor**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Servidor en modo desarrollo
npm run start:debug        # Servidor con debug

# Producción
npm run build              # Compilar proyecto
npm run start:prod         # Ejecutar en producción



# Base de datos
npm run m:gen              # Generar migración
npm run m:run              # Ejecutar migraciones
npm run m:revert           # Revertir última migración
npm run m:show             # Mostrar migraciones

# Linting y formateo
npm run lint               # Linting con ESLint
npm run format             # Formateo con Prettier
```

## 🔧 Configuración de Base de Datos

### SQLite
- Base de datos: `databases/database.db`
- Migraciones: `databases/migrations/`
- Configuración: `src/config/data.source.ts`

### Migraciones
```bash
# Generar nueva migración
npm run m:gen -- -n NombreMigracion

# Ejecutar migraciones pendientes
npm run m:run

# Revertir última migración
npm run m:revert
```



## 🔒 Seguridad

- **JWT Tokens**: Almacenados en cookies HTTP-only
- **Encriptación**: Contraseñas encriptadas con bcryptjs
- **Validación**: DTOs con class-validator
- **CORS**: Configurado para prevenir ataques CSRF
- **Roles**: Sistema de autorización basado en roles

## 📊 Características Principales

### Gestión de Categorías
- Categorías jerárquicas (padre/hijo)
- Tipos de categorías: ingreso, gasto, transferencia, inversión, deuda, ahorro, otro
- Categorías por defecto y personalizadas
- Activación/desactivación de categorías

### Gestión de Transacciones
- Registro de transacciones con montos y monedas
- Asociación con categorías
- Filtrado por categorías
- Validación de datos

### Sistema de Usuarios
- Registro e inicio de sesión
- Roles de usuario (USER/ADMIN)
- Gestión de perfiles
- Autenticación JWT


