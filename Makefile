.PHONY: help start stop restart logs build clean status

help:
	@echo "CRM Risk Manager - Docker Commands"
	@echo ""
	@echo "Available commands:"
	@echo "  make start    - Start all services"
	@echo "  make stop     - Stop all services"
	@echo "  make restart  - Restart all services"
	@echo "  make logs     - Show logs from all services"
	@echo "  make build    - Build all services"
	@echo "  make clean    - Remove all containers and volumes"
	@echo "  make status   - Show status of all services"

start:
	@echo "Starting CRM Risk Manager..."
	docker-compose up -d
	@echo "Services started successfully!"
	@echo "Frontend: http://localhost:5175"
	@echo "Backend: http://localhost:8080"
	@echo "Python API: http://localhost:8001"

stop:
	@echo "Stopping CRM Risk Manager..."
	docker-compose down
	@echo "Services stopped successfully!"

restart: stop start

logs:
	docker-compose logs -f

build:
	@echo "Building all services..."
	docker-compose build
	@echo "Build completed!"

clean:
	@echo "Cleaning up..."
	docker-compose down -v
	docker system prune -f
	@echo "Cleanup completed!"

status:
	docker-compose ps
