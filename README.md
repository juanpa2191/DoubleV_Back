# API de Gestión de Deudas entre Amigos

Este proyecto es una API REST desarrollada con NestJS para gestionar deudas entre amigos. Permite registrar usuarios, crear y gestionar deudas, marcar deudas como pagadas y consultar el estado de las deudas.

## Características

- Registro de usuarios con email y contraseña encriptada
- CRUD completo de deudas
- Marcar deudas como pagadas
- Listar deudas de un usuario (pendientes y pagadas)
- Exportación de deudas en formato JSON o CSV
- Endpoints con agregaciones (total de deudas pagadas, saldo pendiente, etc.)

## Tecnologías utilizadas

- NestJS como framework backend
- PostgreSQL como base de datos principal
- TypeORM como ORM
- Redis para caché (opcional)
- JWT para autenticación
- Passport para estrategias de autenticación
- Class-validator para validación de datos

## Estructura del proyecto

```
src/
├── auth/                  # Módulo de autenticación
│   ├── guards/            # Guardias de autenticación
│   ├── strategies/        # Estrategias de autenticación
│   ├── auth.controller.ts # Controlador de autenticación
│   ├── auth.module.ts     # Módulo de autenticación
│   └── auth.service.ts    # Servicio de autenticación
├── common/                # Código compartido
│   └── config/            # Configuraciones
├── debts/                 # Módulo de deudas
│   ├── dto/               # Objetos de transferencia de datos
│   ├── entities/          # Entidades
│   ├── debts.controller.ts # Controlador de deudas
│   ├── debts.module.ts    # Módulo de deudas
│   └── debts.service.ts   # Servicio de deudas
├── users/                 # Módulo de usuarios
│   ├── dto/               # Objetos de transferencia de datos
│   ├── entities/          # Entidades
│   ├── users.controller.ts # Controlador de usuarios
│   ├── users.module.ts    # Módulo de usuarios
│   └── users.service.ts   # Servicio de usuarios
├── app.controller.ts      # Controlador principal
├── app.module.ts          # Módulo principal
├── app.service.ts         # Servicio principal
└── main.ts                # Punto de entrada de la aplicación
```

## Requisitos previos

- Node.js (v14 o superior)
- npm o yarn
- PostgreSQL
- Redis

## Instalación

1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd nest-back
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=debt_manager

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=3600
```

4. Iniciar la base de datos PostgreSQL

Asegúrate de tener PostgreSQL en ejecución y crea una base de datos llamada `debt_manager`.

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

La API estará disponible en `http://localhost:3000/api`.

## Endpoints principales

### Autenticación

- `POST /api/auth/login` - Iniciar sesión

### Usuarios

- `POST /api/users` - Registrar un nuevo usuario
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener un usuario por ID

### Deudas

- `POST /api/debts` - Crear una nueva deuda
- `GET /api/debts` - Obtener todas las deudas
- `GET /api/debts/:id` - Obtener una deuda por ID
- `GET /api/debts/user/:userId` - Obtener deudas de un usuario
- `PATCH /api/debts/:id` - Actualizar una deuda
- `PATCH /api/debts/:id/pay` - Marcar una deuda como pagada
- `DELETE /api/debts/:id` - Eliminar una deuda

### Endpoints adicionales

- `GET /api/debts/export/:userId` - Exportar deudas de un usuario (formato JSON o CSV)
- `GET /api/debts/stats/:userId` - Obtener estadísticas de deudas de un usuario

## Decisiones técnicas

### Arquitectura

Se ha utilizado una arquitectura modular siguiendo los principios de NestJS, separando la aplicación en módulos independientes pero interconectados. Cada módulo contiene sus propios controladores, servicios, DTOs y entidades.

### Base de datos

Se ha elegido PostgreSQL como base de datos principal por su robustez, soporte para transacciones y capacidad para manejar relaciones complejas. TypeORM se utiliza como ORM para facilitar la interacción con la base de datos.

### Autenticación

Se ha implementado autenticación basada en JWT utilizando Passport.js, lo que proporciona un sistema seguro y escalable para la autenticación de usuarios.

### Validación

Se utiliza class-validator para la validación de datos de entrada, lo que garantiza que los datos recibidos cumplan con los requisitos establecidos antes de ser procesados.

### Caché

Se ha configurado Redis como sistema de caché para mejorar el rendimiento de la aplicación, especialmente en operaciones de lectura frecuentes.

## Validaciones de negocio

- No se pueden registrar deudas con valores negativos
- Una deuda pagada no puede ser modificada
- Se valida la existencia de los usuarios al crear una deuda

## Tests

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## Autor

