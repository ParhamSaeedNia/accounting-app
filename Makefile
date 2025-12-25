.PHONY: dev prod watch install build clean

# Development - runs both frontend and backend with hot reload
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Production build and run
prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

# Watch mode for development
watch:
	docker compose watch

# Install dependencies for both frontend and backend
install:
	cd backend && npm install
	cd frontend && npm install

# Build both projects
build:
	cd backend && npm run build
	cd frontend && npm run build

# Clean up
clean:
	docker-compose down -v
	rm -rf backend/dist backend/node_modules
	rm -rf frontend/dist frontend/node_modules

# Stop all containers
stop:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Backend only
backend:
	cd backend && npm run start:dev

# Frontend only
frontend:
	cd frontend && npm run dev

# Run both locally (without Docker)
local:
	@echo "Starting backend and frontend..."
	@cd backend && npm run start:dev & cd frontend && npm run dev
