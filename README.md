# SaaS Boilerplate

## Shared
pnpm add zod

## Web
pnpm add next-themes
pnpm add zod react-hook-form @hookform/resolvers
pnpm add @tanstack/react-query
pnpm add @tanstack/react-query-devtools

## API
nest new api 
pnpm add bcrypt jsonwebtoken @nestjs/jwt @nestjs/passport passport passport-jwt
pnpm add -D @types/bcrypt @types/jsonwebtoken @types/passport-jwt
pnpm add zod

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- Zod
- React Hook Form
- TanStack Query

### Backend

- NestJS
- Drizzle ORM
- REST API

### Database

- PostgreSQL

### Deployment

### Monitoring



<!-- ### Setup

pnpm install 

web env
```txt
NEXT_PUBLIC_API_URL=http://localhost:3001
```

api env
```txt
DATABASE_URL="postgresql://user:1234@localhost:5432/test"
PORT=3001
JWT_SECRET=
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
NODE_ENV=development
```

docker

docker-compose up -d
docker-compose down -v 
docker-compose down --rmi all

cd api
npx drizzle-kit studio -->