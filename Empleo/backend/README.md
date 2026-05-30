# 🚀 API - Bolsa de Trabajo (Backend)

API REST construida con Node.js, Express, TypeScript y Prisma (SQLite).
Dos roles: **Administrador** (publica y gestiona vacantes) y **Cliente** (ve vacantes y se postula).

## 🛠️ Tecnologías
- Node.js + Express + TypeScript
- Prisma ORM + SQLite
- Autenticación JWT + bcryptjs
- Validación con Zod
- Documentación Swagger/OpenAPI

## 🗄️ Tablas (modelos)
- `admins` — Administradores
- `clients` — Clientes
- `jobs` — Trabajos / Vacantes
- `applications` — Postulaciones

## 📦 Instalación y ejecución
```bash
npm install                          # Instala dependencias
npx prisma generate                  # Genera el cliente Prisma
npx prisma migrate dev --name init   # Crea la base de datos
npm run db:seed                      # Carga datos de ejemplo
npm run dev                          # Inicia en http://localhost:3000
```

## 🔑 Credenciales de prueba (tras el seed)
| Rol           | Email                       | Contraseña   |
|---------------|-----------------------------|--------------|
| Administrador | admin@empleo.com            | password123  |
| Cliente       | juan.perez@email.com        | password123  |
| Cliente       | maria.garcia@email.com      | password123  |
| Cliente       | carlos.hernandez@email.com  | password123  |

## 📖 Documentación
- Swagger UI: http://localhost:3000/api-docs
- Base de la API: http://localhost:3000/api/v1

## 🔗 Endpoints principales
| Método | Endpoint                                  | Descripción                  | Acceso  |
|--------|-------------------------------------------|------------------------------|---------|
| POST   | `/auth/register`                          | Registrar cliente            | Público |
| POST   | `/auth/login`                             | Login (admin o cliente)      | Público |
| GET    | `/auth/profile`                           | Perfil del usuario actual    | Sesión  |
| GET    | `/jobs`                                   | Listar vacantes activas      | Público |
| GET    | `/jobs/:id`                               | Detalle de una vacante       | Público |
| GET    | `/jobs/manage`                            | Listar todas (incl. cerradas)| Admin   |
| POST   | `/jobs`                                   | Crear vacante                | Admin   |
| PUT    | `/jobs/:id`                               | Actualizar vacante           | Admin   |
| DELETE | `/jobs/:id`                               | Eliminar vacante             | Admin   |
| GET    | `/clients`                                | Listar clientes registrados  | Admin   |
| GET    | `/clients/profile`                        | Ver perfil propio            | Cliente |
| PUT    | `/clients/profile`                        | Editar perfil propio         | Cliente |
| POST   | `/applications/jobs/:jobId/apply`         | Postularse a una vacante     | Cliente |
| GET    | `/applications/my-applications`           | Ver mis postulaciones        | Cliente |
| DELETE | `/applications/:id`                       | Retirar postulación          | Cliente |
| GET    | `/applications`                           | Ver todas las postulaciones  | Admin   |
| GET    | `/applications/jobs/:jobId/applicants`    | Postulantes de una vacante   | Admin   |
| PUT    | `/applications/:id/status`                | Cambiar estado               | Admin   |

## 📜 Scripts
- `npm run dev` — Servidor en modo desarrollo (recarga automática)
- `npm run build` — Compila TypeScript a `dist/`
- `npm start` — Ejecuta la versión compilada
- `npm run db:seed` — Carga datos de ejemplo
- `npm run db:studio` — Abre Prisma Studio
