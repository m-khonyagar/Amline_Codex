# Using Python base image version 3.12
FROM python:3.12

# Upgrade pip
RUN pip install --upgrade pip

ENV PYTHONUNBUFFERED=1

# Create working directory /app
WORKDIR /app

COPY ./requirements.txt .

# Install project dependencies from requirements.txt
RUN pip install -r requirements.txt

# Copy all project files to the working directory
COPY ./src .

# Set the command to run the project using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]