FROM hub.cr.parmincloud.ir/library/python:3.12-slim AS base
WORKDIR /app
ENV DEBIAN_FRONTEND=noninteractive

RUN --mount=type=cache,target=/var/cache/apt \
    --mount=type=cache,target=/var/lib/apt \
    echo "deb http://repo.iut.ac.ir/debian/ trixie main" >> /etc/apt/sources.list && \
    echo "deb http://repo.iut.ac.ir/debian/ trixie-updates main" >> /etc/apt/sources.list

FROM base AS python-base
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv"

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"
RUN apt-get update && \
    apt-get install -y libpq-dev libpq5 && \
    apt-get install -y libmagic1 libmagic-dev

FROM python-base AS builder-base

RUN apt-get update && \
    apt-get install -y libpq-dev libpq5 curl build-essential && \
    pip install poetry -i https://pypi.parmincloud.ir/simple/

WORKDIR $PYSETUP_PATH

COPY ./poetry.toml ./pyproject.toml ./poetry.lock ./

RUN poetry install --only main --no-root

FROM python-base AS production

COPY --from=builder-base $VENV_PATH $VENV_PATH
COPY ./src /app
COPY ./gunicorn.conf.py ./README.md /app/
COPY --chmod=0775 docker-entrypoint.sh /docker-entrypoint.sh
EXPOSE 80
WORKDIR /app/

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["python3", "-m", "gunicorn", "--config", "gunicorn.conf.py", "main:app"]