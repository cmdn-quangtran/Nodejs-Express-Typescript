# Node.js Express TypeScript DDD Project

A modern backend project built with Node.js, Express, and TypeScript following Domain-Driven Design (DDD) principles and Clean Architecture.

## 🏗️ Architecture

This project follows DDD and Clean Architecture principles with the following layers:

### Domain Layer (`/src/domain/`)
- Core business logic and rules
- Domain entities and value objects
- Repository interfaces
- Domain services

### Application Layer (`/src/use-case/`)
- Use cases implementation
- Business workflow orchestration
- No direct dependency on infrastructure

### Infrastructure Layer (`/src/infrastructure/`)
- Repository implementations
- Database access (Prisma & Kysely)
- External services integration
- Logging, caching implementations

### Interface Layer (`/src/handler/`)
- HTTP request handlers
- API routes and controllers
- Request/Response transformations

## 🔄 Inversion of Control (IoC)

The project implements IoC using InversifyJS to manage dependencies and maintain loose coupling between components.

### IoC Container Structure

```typescript
// Service identifiers
export const USER_REPOSITORY = "USER_REPOSITORY";
export const REGISTER_USER_USE_CASE = "REGISTER_USER_USE_CASE";
// ... other service identifiers
```

### Dependency Registration

```typescript
const container = new Container();

// Register services with different scopes
container
  .bind<UserRepository>(USER_REPOSITORY)
  .to(UserRepositoryImpl)
  .inSingletonScope();

container
  .bind<RegisterUserUseCase>(REGISTER_USER_USE_CASE)
  .to(RegisterUserUseCaseImpl)
  .inSingletonScope();
```

### Key IoC Features

1. **Dependency Injection**
   - Constructor injection for required dependencies
   - Interface-based injection for loose coupling
   - Automatic dependency resolution

2. **Lifecycle Management**
   - Singleton scope for shared services
   - Transient scope for per-request instances
   - Dynamic value binding for context-dependent services

3. **Service Organization**
   - Environment variables
   - Infrastructure services (Database, Redis, S3)
   - Repositories
   - Use Cases
   - Cross-cutting concerns (Logging, Monitoring)

4. **Usage Example**
```typescript
class RegisterUserUseCaseImpl {
  constructor(private readonly deps: {
    userRepository: UserRepository;
    logger: Logger;
  }) {}

  async execute(input: RegisterUserInput): Promise<User> {
    this.deps.logger.info("Registering new user", { input });
    // Implementation
    return this.deps.userRepository.create(input);
  }
}

class UserRepositoryImpl {
  constructor(private readonly deps: {
    dbClient: Kysely<DB>;
    redisClient: RedisClient;
    logger: Logger;
  }) {}

  async create(user: User): Promise<User> {
    this.deps.logger.info("Creating user in database", { user });
    // Implementation using dbClient
  }
}
```

## 🛠️ Technical Stack

- **Runtime**: Node.js 20.11.1
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 15
- **ORM/Query Builder**: 
  - Prisma (Primary ORM)
  - Kysely (Query Builder)
- **Caching**: Redis
- **API Documentation**: OpenAPI/Swagger
- **Authentication**: OAuth 2.0 JWT Bearer
- **Dependency Injection**: InversifyJS
- **Object Storage**: AWS S3
- **Logging**: Pino Logger

## 🚀 Getting Started

### Prerequisites

- Node.js 20.11.1
- NPM 10.5.0
- Docker and Docker Compose

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-name]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment:
```bash
cd server
npm run config:local  # Copy environment configuration
```

4. Start infrastructure services:
```bash
npm run docker:up
```

5. Run database migrations:
```bash
npm run db:migrate:dev
```

6. Start the development server:
```bash
npm run local
```

## 📦 Project Structure

```
server/
├── src/
│   ├── domain/          # Domain entities, interfaces
│   ├── use-case/        # Application use cases
│   ├── infrastructure/  # External services, repositories
│   ├── handler/         # API handlers
│   ├── di-container/    # Dependency injection setup
│   └── util/           # Shared utilities
├── prisma/             # Database schema and migrations
└── docker-compose.yaml # Infrastructure services
```

## 🔧 Development

### Available Scripts

- `npm run build`: Build the project
- `npm run local`: Run in development mode
- `npm run validate`: Run all validations
- `npm run fix`: Fix linting and formatting issues
- `npm run codegen`: Generate API types and Prisma client
- `npm run docker:up`: Start Docker services
- `npm run docker:down`: Stop Docker services

### Code Quality

- ESLint with Airbnb configuration
- Prettier for code formatting
- TypeScript in strict mode
- Automated validation scripts
