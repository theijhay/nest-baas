# NestJS Backend-as-a-Service (Mini Supabase/Strapi Clone)

This project is a dynamic **Backend-as-a-Service (BaaS)** platform built with NestJS, PostgreSQL, and TypeORM. Inspired by tools like **Supabase** and **Strapi**


⚙️ Setup & Installation
📦 Requirements

Before getting started, ensure you have:

- Node.js v18 or higher
- PostgreSQL installed and running
- Yarn package manager (npm install -g yarn)

📁 Clone the Repository

git clone https://github.com/your-username/nest-baas.git
```bash
cd nest-baas
```

📦 Install Dependencies

```bash
yarn install
```

🔐 Environment Setup
opy the example environment file:

```bash
cp .env.example .env
```
Edit the .env file and provide your own values:

```json
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/nestbaas
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1d
PORT=3000
```

🧱 Database Migration
All database schema is managed using TypeORM migrations.

#### (Optional) Drop all tables — dev use only
```bash
yarn db:drop
```

#### Generate initial migration (only needed once after defining entities)
```bash
yarn db:create src/migrations/InitSchema
```

#### Run all migrations to apply schema
```bash
yarn db:migrate
```
🚀 Start the App

```bash
yarn start:dev
```

The server will be running on:

http://localhost:3000

📖 API Documentation (Swagger)

After starting the server, visit:

http://localhost:3000/api

You’ll find full interactive Swagger docs to test your endpoints.