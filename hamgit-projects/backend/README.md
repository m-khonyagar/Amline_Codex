# Amline Backend

This is the backend for the Amline project. It is a RESTful API that provides endpoints for the frontend to interact with the database.

## Installation

Python 3.12.3 is required to run this project. You can download it from the [official website](https://www.python.org/downloads/release/python-3123/).

```bash
# Install necessary packages to build Python from source
sudo apt install -y build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev python3-openssl git libpq-dev python3-dev

# Extract the Python source code
tar -xf Python-3.12.3.tgz

# Build Python from source
cd Python-3.12.3
./configure --enable-optimizations
make -j 8
sudo make altinstall
```

psycopg 3 requires the `libpq5` and `libpq-dev` packages to be installed. You can install them with the following command:

```bash
sudo apt install -y libpq5 libpq-dev
```

To install the project dependencies, run the following commands:

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install poetry
poetry install --no-root
```

## TODO

- check 16 character serial validation
- snowflake
