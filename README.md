# Accounting Packages API

A NestJS-based REST API for managing accounting packages with profit calculation capabilities. This application provides a complete solution for tracking packages, their expenses, and calculating profit margins.

## 🚀 Features

- **Package Management**: Create, read, update, and delete accounting packages
- **Profit Calculation**: Calculate profit margins based on package prices and expense percentages
- **RESTful API**: Full CRUD operations with proper HTTP status codes
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Database Integration**: MongoDB with Mongoose ODM
- **Docker Support**: Multi-environment Docker configuration
- **TypeScript**: Full TypeScript support with strict type checking
- **Validation**: Request validation using class-validator
- **Testing**: Jest testing framework with e2e tests

## 🏗️ Architecture

### Core Components

- **Controller**: `PackagesController` - Handles HTTP requests and responses
- **Service**: `PackagesService` - Business logic and data operations
- **Entity**: `Package` - MongoDB schema definition
- **DTO**: `CreatePackageDto` - Data transfer object for validation

### Technology Stack

- **Framework**: NestJS 11.x
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript 5.7
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint, Prettier

## 📋 API Endpoints

| Method   | Endpoint                  | Description                  |
| -------- | ------------------------- | ---------------------------- |
| `POST`   | `/packages`               | Create a new package         |
| `GET`    | `/packages`               | Get all packages             |
| `GET`    | `/packages/:id`           | Get package by ID            |
| `PUT`    | `/packages/:id`           | Update package               |
| `DELETE` | `/packages/:id`           | Delete package               |
| `GET`    | `/packages/:id/calculate` | Calculate profit for package |

### API Documentation

Interactive API documentation is available at: `http://localhost:3000/api`

## 🗄️ Data Model

### Package Entity

```typescript
{
  packageName: string; // Name of the package
  price: number; // Package price
  expenses: Record<string, number>; // Expense percentages by category
}
```

### Example Package

```json
{
  "packageName": "Premium Package",
  "price": 1000,
  "expenses": {
    "infrastructure": 10,
    "teacher": 50,
    "marketing": 20
  }
}
```

### Profit Calculation

The system calculates profit using the formula:

```
Profit = Price - Total Expenses
Total Expenses = Σ(Price × Expense Percentage / 100)
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- MongoDB
- Docker & Docker Compose (optional)

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd accounting-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   export MONGODB_URI=mongodb://localhost:27017/accounting
   ```

4. **Start MongoDB**

   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # Or using local MongoDB installation
   mongod
   ```

5. **Run the application**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

### Docker Development

1. **Start all services**

   ```bash
   make dev
   # or
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

2. **Access the application**
   - API: http://localhost:3000
   - Swagger UI: http://localhost:3000/api
   - MongoDB Express: http://localhost:8081

## 🐳 Docker Configuration

### Development Environment

- **Hot Reload**: File watching with automatic rebuilds
- **Volume Mounting**: Source code mounted for live updates
- **MongoDB**: Local MongoDB instance
- **Mongo Express**: Web-based MongoDB admin interface

### Production Environment

- **Multi-stage Build**: Optimized production image
- **Production Dependencies**: Only production packages included
- **Environment Variables**: Production configuration

### Available Commands

```bash
# Development
make dev

# Production
make prod

# Watch mode
make watch
```

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Test Structure

- **Unit Tests**: `*.spec.ts` files
- **E2E Tests**: `test/` directory
- **Coverage**: Generated in `coverage/` directory

## 📦 Package Scripts

| Script                | Description               |
| --------------------- | ------------------------- |
| `npm run build`       | Build the application     |
| `npm run start`       | Start the application     |
| `npm run start:dev`   | Start in development mode |
| `npm run start:debug` | Start in debug mode       |
| `npm run start:prod`  | Start in production mode  |
| `npm run test`        | Run unit tests            |
| `npm run test:e2e`    | Run e2e tests             |
| `npm run test:cov`    | Run tests with coverage   |
| `npm run lint`        | Run ESLint                |
| `npm run format`      | Format code with Prettier |

## 🔧 Configuration

### Environment Variables

| Variable      | Default                                | Description               |
| ------------- | -------------------------------------- | ------------------------- |
| `MONGODB_URI` | `mongodb://localhost:27017/accounting` | MongoDB connection string |
| `NODE_ENV`    | `development`                          | Environment mode          |

### TypeScript Configuration

- **Target**: ES2023
- **Module**: CommonJS
- **Strict Mode**: Enabled
- **Decorators**: Enabled for NestJS

### ESLint Configuration

- **TypeScript**: Full TypeScript support
- **Prettier**: Integrated formatting
- **Custom Rules**: Relaxed for development flexibility

## 📁 Project Structure

```
accounting-app/
├── src/
│   ├── packages/
│   │   ├── dto/
│   │   │   └── request/
│   │   │       └── create-package.dto.ts
│   │   ├── packages.controller.ts
│   │   ├── packages.entity.ts
│   │   ├── packages.module.ts
│   │   └── packages.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── dist/                    # Compiled output
├── docker-compose.yml       # Base Docker configuration
├── docker-compose.dev.yml   # Development overrides
├── docker-compose.prod.yml  # Production overrides
├── Dockerfile              # Multi-stage Docker build
├── Makefile                # Development commands
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Deployment

### Production Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start with Docker Compose**

   ```bash
   make prod
   ```

3. **Environment Configuration**
   - Set `NODE_ENV=production`
   - Configure production MongoDB URI
   - Set up proper logging and monitoring

### Environment-Specific Configurations

- **Development**: Hot reload, debug mode, local MongoDB
- **Production**: Optimized build, production MongoDB, monitoring

## 🔍 API Usage Examples

### Create a Package

```bash
curl -X POST http://localhost:3000/packages \
  -H "Content-Type: application/json" \
  -d '{
    "packageName": "Premium Course",
    "price": 1000,
    "expenses": {
      "infrastructure": 10,
      "teacher": 50,
      "marketing": 20
    }
  }'
```

### Calculate Profit

```bash
curl http://localhost:3000/packages/{id}/calculate
```

### Response Example

```json
{
  "packageName": "Premium Course",
  "price": 1000,
  "expenses": {
    "infrastructure": 100,
    "teacher": 500,
    "marketing": 200
  },
  "totalExpenses": 800,
  "profit": 200
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED license.

## 🆘 Support

For support and questions:

- Check the API documentation at `/api`
- Review the test files for usage examples
- Check the Docker logs for debugging

---

**Built with ❤️ using NestJS, TypeScript, and MongoDB**
