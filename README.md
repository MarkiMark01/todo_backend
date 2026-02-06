### TODO REST API (NestJS + Prisma + PostgreSQL)

A robust and scalable task management API built with NestJS. This project follows clean architecture principles (Controller/Service pattern) and is fully containerized for easy deployment.

---

### Key Features

- **Full CRUD Support**: Create, read, update, and delete tasks with ease.
- **Advanced Task Filtering**: Filter tasks by status (`todo`, `in_progress`, `done`) and title search (`q` parameter).
- **Optimized Pagination**: Built-in pagination logic with configurable limits (default: 10, max: 50).
- **Data Integrity**: Strict input validation and sanitization using `class-validator`.
- **Centralized Error Handling**: Unified error response format across the entire API.
- **Request Logging**: Real-time HTTP request monitoring with `morgan` middleware.

---

### Environment Configuration (.env)

Create a `.env` file in the root directory. Use the following configuration for local development and testing:
```bash
PORT=3000

# Connection string for local testing and development:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo_db?schema=public"

# Connection string for Docker Compose setup:
DATABASE_URL="postgresql://postgres:postgres@db:5432/todo_db?schema=public"

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=todo_db
```

### Installation & Running

Option 1: Quick Run via Docker (Recommended)

### Build and start all services
```bash
docker-compose up --build
```

Migrations are applied automatically. The API will be available at http://localhost:3000.

### Option 2: Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Sync database schema and generate Prisma client
```bash
npx prisma migrate dev --name init
```

### 3. Start the application in development mode
```bash
npm run start:dev
```

### Running Tests

Ensure your PostgreSQL instance is running on localhost before executing tests and use this connection string for local testing:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo_db?schema=public"

# Connection string for Docker Compose setup:
# DATABASE_URL="postgresql://postgres:postgres@db:5432/todo_db?schema=public"
```
### Run End-to-End (e2e) tests
```bash
npm run test:e2e
```

### API Examples (cURL)

1. Create a New Task
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Implement API", "description": "Finish the task management module"}'
```

2. Get List (with filters and pagination)
```bash
curl "http://localhost:3000/tasks?status=todo&q=API&page=1&limit=10"
```

3. Update Task Status

```bash
curl -X PATCH http://localhost:3000/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

4. Delete a Task   
```bash
   curl -X DELETE http://localhost:3000/tasks/<TASK_ID>
```
   ### Project Structure
- **src/tasks** — Business logic: controllers, services, and DTOs.

- **src/common** — Global exception filters and shared utilities.

- **prisma/** — Database schema definitions and migrations.

- **test/** — E2E test suites (Jest & Supertest).
