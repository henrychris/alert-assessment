# User and Role Management System

This project is a simple **user and role management system** built with **NestJS** and **Prisma ORM**, supporting JWT-based authentication, role-based access control (RBAC), and REST API endpoints for user and role management.

## Features

- User registration and login with JWT-based authentication.
- Role-based access control (RBAC) with dynamic permissions.
- Prisma ORM for interacting with the SQL database.
- Global and local guards for authentication and role validation.
- RESTful API with CRUD operations for users and roles.

## Tech Stack

- **Language:** TypeScript  
- **Framework:** NestJS  
- **Database:** PostgreSQL  
- **ORM:** Prisma  

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v16.x or later)
- **npm**
- **Docker** (optional, for containerized database)
- **Prisma CLI**  

  ```bash
  npm install prisma --save-dev
  ```

---

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/henrychris/alert-assessment.git
   cd alert-assessment
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**  
   Create a `.env` file in the project root:

   ```properties
   PORT=0000
   DATABASE_URL=""
   JWT_SECRET=""
   ```

4. **Set Up Prisma and Database**  
   Optionally, set up a postgres database with this command:

   ```bash
   docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432  -d postgres:16.1
   ```

   Connect to the database and create a new database named 'mydb'.
   Use `postgresql://postgres:mysecretpassword@localhost:5432/mydb?schema=public` as DATABASE_URL.

   Run the following commands to generate the Prisma client and migrate the schema:

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Start the Application**

   ```bash
   npm run start:dev
   ```

## Database Schema

Prisma schema with **User**, **Role**, and a many-to-many relation between them.

```prisma
model User {
  id           Int      @id @default(autoincrement())
  firstName    String
  lastName     String
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  roles        Role[]   @relation("UserRoles")
}

model Role {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  permissions String[]
  users       User[]   @relation("UserRoles")
}
```

---

## API Endpoints

- **POST** `/auth/register` – Register a new user.  
- **POST** `/auth/login` – Authenticate a user and return a JWT.  
- **POST** `/users/assign-role` – Assign a role to a user.  
- **GET** `/users` – Fetch all users with their roles.  
- **DELETE** `/users/:id` – Delete a user (Admin-only).

---

## Authentication & Authorization

1. **JWT Authentication**  
   - On successful login, a JWT token is issued.
   - Token is required in the `Authorization` header for all non-auth routes:

     ```text
     Authorization: Bearer <token>
     ```

2. **Role-Based Access Control (RBAC)**  
   - Admin-only routes are protected by the `RolesGuard`.
   - Use the `@Roles()` decorator to specify the allowed Role:

     ```typescript
     @Roles(Role.Admin)
     @UseGuard(RolesGuard)
     @Get('admin')
     getAdminData() {
       return 'This is admin data';
     }
     ```

---

## Testing

1. **Run Tests**

   ```bash
   npm run test
   ```
