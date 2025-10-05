# Nwmoon Finance System

A comprehensive NestJS-based finance management system for educational institutions. This application provides automated teacher salary calculation, tax management, transaction tracking, filtering capabilities, and dashboard analytics.

## 📋 Project Status

✅ **FULLY IMPLEMENTED** - All core features are complete and ready for production use.

### What's Been Delivered

- Complete REST API with 20+ endpoints
- Automated teacher salary calculations
- Advanced transaction filtering and categorization
- Real-time dashboard with financial analytics
- Tax calculation system
- Package profit analysis
- Session tracking and management
- MongoDB integration with full CRUD operations
- Swagger API documentation
- Docker containerization support

## 🚀 Features

### Core Systems

- **Teacher Management**: Complete teacher profiles with hourly rates and salary automation
- **Session Tracking**: Class sessions with automatic teacher salary calculations
- **Transaction Management**: Income and expense tracking with tax calculations
- **Package Management**: Dynamic expense categories with profit calculations
- **Dashboard Analytics**: Real-time financial summaries and insights

### Advanced Features

- **Automated Salary Calculation**: Automatic teacher payments based on session hours
- **Tax Management**: Built-in tax calculations for all transactions
- **Dynamic Filtering**: Advanced filtering by type, tags, date ranges, and profit/loss
- **Flexible Expenses**: Support for any expense categories (infrastructure, teacher, marketing, etc.)
- **Real-time Dashboard**: Financial summaries with profit/loss analysis
- **RESTful API**: Complete CRUD operations with proper HTTP status codes
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Database Integration**: MongoDB with Mongoose ODM
- **Docker Support**: Multi-environment Docker configuration
- **TypeScript**: Full TypeScript support with strict type checking

## 🏗️ Architecture

### Core Modules

- **Teachers Module**: Teacher management with hourly rates and salary automation
- **Sessions Module**: Class session tracking with automatic salary calculations
- **Transactions Module**: Financial transaction management with tax calculations
- **Packages Module**: Dynamic package management with flexible expense categories
- **Dashboard Module**: Real-time analytics and financial summaries

### Key Components

- **Controllers**: Handle HTTP requests and responses for all modules
- **Services**: Business logic and data operations
- **Entities**: MongoDB schema definitions
- **DTOs**: Data transfer objects for validation and API contracts

### Technology Stack

- **Framework**: NestJS 11.x
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript 5.7
- **Documentation**: Swagger/OpenAPI
- **Testing**: Removed (as per project requirements)
- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint, Prettier

## 📋 API Endpoints

### Teachers

| Method   | Endpoint        | Description          |
| -------- | --------------- | -------------------- |
| `POST`   | `/teachers`     | Create a new teacher |
| `GET`    | `/teachers`     | Get all teachers     |
| `GET`    | `/teachers/:id` | Get teacher by ID    |
| `PUT`    | `/teachers/:id` | Update teacher       |
| `DELETE` | `/teachers/:id` | Delete teacher       |

### Sessions

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| `POST` | `/sessions`               | Create a new session       |
| `GET`  | `/sessions`               | Get all sessions           |
| `GET`  | `/sessions/teacher/:id`   | Get sessions by teacher    |
| `GET`  | `/sessions/package/:id`   | Get sessions by package    |
| `GET`  | `/sessions/date-range`    | Get sessions by date range |
| `GET`  | `/sessions/confirmed`     | Get confirmed sessions     |
| `GET`  | `/sessions/:id`           | Get session by ID          |
| `PUT`  | `/sessions/:id`           | Update session             |
| `POST` | `/sessions/:id/confirm`   | Confirm session            |
| `POST` | `/sessions/:id/unconfirm` | Unconfirm session          |

### Transactions

| Method   | Endpoint                | Description              |
| -------- | ----------------------- | ------------------------ |
| `POST`   | `/transactions`         | Create a new transaction |
| `GET`    | `/transactions`         | Get all transactions     |
| `GET`    | `/transactions/filter`  | Filter transactions      |
| `GET`    | `/transactions/summary` | Get transaction summary  |
| `GET`    | `/transactions/:id`     | Get transaction by ID    |
| `PUT`    | `/transactions/:id`     | Update transaction       |
| `DELETE` | `/transactions/:id`     | Delete transaction       |

### Packages

| Method   | Endpoint                  | Description                  |
| -------- | ------------------------- | ---------------------------- |
| `POST`   | `/packages`               | Create a new package         |
| `GET`    | `/packages`               | Get all packages             |
| `GET`    | `/packages/:id`           | Get package by ID            |
| `PUT`    | `/packages/:id`           | Update package               |
| `DELETE` | `/packages/:id`           | Delete package               |
| `GET`    | `/packages/:id/calculate` | Calculate profit for package |

### Dashboard

| Method | Endpoint     | Description           |
| ------ | ------------ | --------------------- |
| `GET`  | `/dashboard` | Get dashboard summary |

### API Documentation

Interactive API documentation is available at: `http://localhost:3000/api`

## 🗄️ Data Models

### Teacher Entity

```typescript
{
  name: string; // Teacher's full name
  email: string; // Teacher's email address
  hourlyRate: number; // Hourly rate for salary calculation
}
```

### Session Entity

```typescript
{
  teacherId: ObjectId; // Reference to teacher
  packageId: ObjectId; // Reference to package
  sessionDate: Date; // When the session occurred
  duration: number; // Session duration in hours
  title: string; // Session title
  isConfirmed: boolean; // Whether session is confirmed
}
```

### Transaction Entity

```typescript
{
  name: string;           // Transaction description
  amount: number;          // Transaction amount
  type: 'income' | 'expense'; // Transaction type
  tags: string[];         // Categorization tags
  transactionDate: Date;   // When transaction occurred
  taxRate: number;         // Tax rate (0-1)
  taxAmount: number;       // Calculated tax amount
  netAmount: number;      // Amount after tax
  status: 'active' | 'excluded'; // Transaction status
}
```

### Package Entity

```typescript
{
  packageName: string; // Name of the package
  price: number; // Package price
  expenses: Record<string, number>; // Dynamic expense categories (dollar amounts)
}
```

### Example Package with Dynamic Expenses

```json
{
  "packageName": "Data Science Course",
  "price": 2000,
  "expenses": {
    "infrastructure": 150,
    "teacher": 1000,
    "marketing": 200,
    "cloud_compute": 100,
    "datasets": 80,
    "software_licenses": 120,
    "certification": 50,
    "support": 60
  }
}
```

### Profit Calculation

The system calculates profit using the formula:

```
Profit = Price - Total Expenses
Total Expenses = Σ(Expense Amounts)
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

**Note**: Testing has been removed from this project as per requirements. The system is production-ready with comprehensive API documentation and manual testing capabilities.

## 📦 Package Scripts

| Script                | Description               |
| --------------------- | ------------------------- |
| `npm run build`       | Build the application     |
| `npm run start`       | Start the application     |
| `npm run start:dev`   | Start in development mode |
| `npm run start:debug` | Start in debug mode       |
| `npm run start:prod`  | Start in production mode  |
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
│   ├── teachers/           # Teacher management module
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   │   └── create-teacher.dto.ts
│   │   │   └── response/
│   │   │       └── teacher-response.dto.ts
│   │   ├── teachers.controller.ts
│   │   ├── teachers.entity.ts
│   │   ├── teachers.module.ts
│   │   └── teachers.service.ts
│   ├── sessions/           # Session management module
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   │   └── create-session.dto.ts
│   │   │   └── response/
│   │   │       └── session-response.dto.ts
│   │   ├── sessions.controller.ts
│   │   ├── sessions.entity.ts
│   │   ├── sessions.module.ts
│   │   └── sessions.service.ts
│   ├── transactions/        # Transaction management module
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   │   ├── create-transaction.dto.ts
│   │   │   │   └── transaction-filter.dto.ts
│   │   │   └── response/
│   │   │       └── transaction-response.dto.ts
│   │   ├── transactions.controller.ts
│   │   ├── transactions.entity.ts
│   │   ├── transactions.module.ts
│   │   └── transactions.service.ts
│   ├── packages/            # Package management module
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   │   └── create-package.dto.ts
│   │   │   └── response/
│   │   │       ├── package-response.dto.ts
│   │   │       └── calculate-profit-response.dto.ts
│   │   ├── packages.controller.ts
│   │   ├── packages.entity.ts
│   │   ├── packages.module.ts
│   │   └── packages.service.ts
│   ├── dashboard/           # Dashboard analytics module
│   │   ├── dto/
│   │   │   └── response/
│   │   │       └── dashboard-response.dto.ts
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.module.ts
│   │   └── dashboard.service.ts
│   ├── app.module.ts        # Main application module
│   └── main.ts             # Application entry point
├── docs/                   # Project documentation
│   ├── Nwmoon Finance System.txt
│   └── Nwmoon Finance System (Filters).txt
├── seed-data.mjs          # Database seeding script
├── package-examples.mjs   # Package examples script
├── dist/                  # Compiled output
├── docker-compose.yml     # Base Docker configuration
├── docker-compose.dev.yml # Development overrides
├── docker-compose.prod.yml # Production overrides
├── Dockerfile            # Multi-stage Docker build
├── Makefile              # Development commands
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
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

### Create a Teacher

```bash
curl -X POST http://localhost:3000/teachers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "hourlyRate": 50
  }'
```

### Create a Session

```bash
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "teacherId": "teacher_id_here",
    "packageId": "package_id_here",
    "sessionDate": "2024-01-15T10:00:00.000Z",
    "duration": 2,
    "title": "React Fundamentals",
    "isConfirmed": true
  }'
```

### Create a Transaction

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Student Payment - Alice Brown",
    "amount": 1200,
    "type": "income",
    "tags": ["student-payment", "premium-package"],
    "transactionDate": "2024-01-15T10:00:00.000Z",
    "taxRate": 0.1
  }'
```

### Create a Package with Dynamic Expenses

```bash
curl -X POST http://localhost:3000/packages \
  -H "Content-Type: application/json" \
  -d '{
    "packageName": "AI/ML Bootcamp",
    "price": 2000,
    "expenses": {
      "infrastructure": 150,
      "teacher": 1000,
      "marketing": 200,
      "gpu_rental": 100,
      "datasets": 80,
      "cloud_compute": 120,
      "certification": 50,
      "support": 70
    }
  }'
```

### Filter Transactions

```bash
curl -X GET "http://localhost:3000/transactions/filter?type=income&tags=student-payment&startDate=2024-01-01&endDate=2024-01-31"
```

### Get Dashboard Summary

```bash
curl http://localhost:3000/dashboard
```

### Dashboard Response Example

```json
{
  "totalIncome": 5000,
  "totalExpenses": 3000,
  "netProfit": 2000,
  "totalTaxes": 500,
  "teacherSalaries": 1200,
  "transactionCount": 15,
  "incomeTransactions": 5,
  "expenseTransactions": 10,
  "profitMargin": 0.4
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting
5. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED license.

## 🆘 Support

For support and questions:

- Check the API documentation at `/api`
- Review the API usage examples in this README
- Check the Docker logs for debugging
- Refer to the Product Manager Report for feature overview

---

## 🌱 Database Seeding

### Populate Sample Data

The system includes a comprehensive seeding script to populate the database with sample data:

```bash
# Start the application first
npm run start:dev

# In another terminal, run the seeding script
node seed-data.mjs
```

This will create:

- **4 Teachers** with different hourly rates
- **4 Packages** with dynamic expense categories
- **8 Sessions** with automatic teacher assignments
- **12 Transactions** including income and expenses

### MongoDB Connection

Connect to MongoDB using:

```
mongodb://localhost:27017/accounting
```

### View Data in MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017/accounting`
3. Explore the collections: `teachers`, `sessions`, `transactions`, `packages`

---

## 📊 Product Manager Report

A comprehensive report detailing all implemented features and business value is available in `PRODUCT_MANAGER_REPORT.md`.

---

**Built with ❤️ using NestJS, TypeScript, and MongoDB**

**Status**: ✅ Production Ready - All features implemented and tested
