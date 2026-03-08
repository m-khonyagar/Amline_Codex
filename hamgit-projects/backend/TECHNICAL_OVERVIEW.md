# Amline Backend – Technical Overview

## 1. System Overview

- Container-ready FastAPI service exposing REST APIs for account, advertisement, contract, CRM, and financial domains.
- Domain-driven layout inside each module (`domain`, `service_layer`, `adapters`, `entrypoints`) to isolate business logic from I/O.
- SQLAlchemy + PostgreSQL (via `psycopg`) with Alembic migrations for persistence; Redis and MinIO provide caching and file storage.
- Observability comes from Sentry and Loguru-based logging.
- Runs with Uvicorn for local development or Gunicorn via Docker for production deployments.

## 2. Module Summaries

- `account/`: user, organization, and access control flows (adapters for persistence/external services, HTTP entrypoints, business services).
- `advertisement/`: property/advert inventory handling, including listings, saved ads, visits, and associated assets.
- `contract/`: purchase/rental contract lifecycle, clauses, pricing, and supporting documents.
- `crm/`: lead management, calls, visits, label/tag handling, and related analytics.
- `financial/`: pricing models, settlements, discount codes, invoices, and payments.
- `core/`: cross-cutting infrastructure (config, logging, db, messaging) shared across modules.
- `shared/`: reusable utilities, DTOs, schemas, validators, enums, and helpers.
- `tests/`: unit, integration, and e2e suites organized around API layers.

Each module mirrors the same sub-structure (`domain`, `service_layer`, `adapters`, `entrypoints`) to keep business logic isolated from I/O and interface concerns.
Domain entities remain raw Python classes (e.g., `contract/domain/entities/contract.py`) and are mapped to SQLAlchemy table definitions (`contract/adapters/orm/data_models/contract_data_model.py`) through explicit mapper registrations (`contract/adapters/orm/mappers.py`).

## 3. Database Structure Overview

Alembic migrations (`alembic/versions/`) enumerate the persisted entities. Detectable domains include:

- **Accounts & Identity**: users, roles, labels, organizations, family members, avatars.
- **Properties & Advertisements**: property records, ads, saved ads, wanted ads, price history, visit requests, extra fields, attachments.
- **Contracts**: contract clauses, subclauses, PR contracts, settlement tracking, discount handling.
- **CRM Activities**: calls (types/statuses), visit scheduling, tasks, tenant/realtor metadata.
- **Files**: `new_files` tables with type metadata and links from other modules.
- **Financials**: discount codes, settlements, invoices, dynamic pricing, payment channels.

Relationships can be inferred from migration names referencing foreign-key adjustments (e.g., ads → files, visit requests → ads, users → labels). PostgreSQL is the authoritative datastore, while Redis is used for caching/ephemeral state and MinIO for binary assets.

## 4. External Services & Dependencies

Listed in `pyproject.toml` and configs:

- **Datastores**: PostgreSQL (`psycopg`), Redis (`redis`), MinIO (`minio`), optional MySQL ingestion (`pymysql`).
- **Messaging & Scheduling**: RabbitMQ (`aio-pika`), APScheduler.
- **Observability**: Sentry (`sentry-sdk[fastapi]`), Loguru logging.
- **Identity & Security**: JWT (`pyjwt`), Snowflake ID generation (`snowflake-id`).
- **Media & Files**: `python-magic`, `python-multipart`, `openpyxl`, `pandas` for import/export.
- **Notifications & Integrations**: `kavenegar` SMS, HTTP clients (`httpx`, `aiohttp`, `requests`).
- **Deployment**: Uvicorn, Gunicorn, Typer CLI, Alembic migrations, poetry packaging.

## 5. Infrastructure & Deployment Notes

- Docker image (`python:3.12.3-bookworm`) installs Poetry, copies dependencies, and runs `poetry run gunicorn --config gunicorn.conf.py main:app` on port 80.
- Gunicorn binds to `0.0.0.0:80` and logs to stdout/stderr via the provided config.
- Environment variables are loaded via `python-dotenv`; actual values are expected in a local `.env` (not versioned).
- Makefile targets document operational commands for building, running, and maintaining the service.

This document intentionally stays at a high level, focusing on architectural insights derived directly from the repository layout and configuration files.
