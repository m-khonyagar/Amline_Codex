run:
	@cd src && uvicorn main:app --reload

run_network:
	@cd src && uvicorn main:app --host 0.0.0.0 --port 8000 --reload

run_production:
	@cd src && IS_PRODUCTION=True uvicorn main:app --reload

install:
	@poetry lock
	poetry install --no-root

activate-run:
	@bash -c 'source .venv/bin/activate && cd src && uvicorn main:app --reload'

migrations:
	@read -p "Enter migrations message: " message; \
	alembic revision --autogenerate -m "$$message"

migrate:
	@alembic upgrade head

undo-migrate:
	@alembic downgrade -1
	@echo "You should remove migrations file"

pre-commit:
	git add .
	@pre-commit run -a

commit-and-push:
	@git add .
	@read -p "Enter commit message: " message; \
	git commit -m "$$message"; \
	git push -u origin `git rev-parse --abbrev-ref HEAD`

undo-commit:
	@git reset --soft HEAD~1

deploy:
	@liara deploy --debug  --app="amline-backend-api" --port 80 --platform docker


superuser:
	@read -p "Enter mobile number: " mobile; \
	read -p "Enter cli password: " password; \
	cd src && python -m cli $$mobile $$password

build:
	@docker build -t amline-backend .

docker-run:
	@docker run --rm -p 80:80 --env-file .env amline-backend
