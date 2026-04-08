# The number of worker processes for handling requests.
workers = 2

# The type of worker class to use.
worker_class = "uvicorn.workers.UvicornWorker"

# The host and port to bind.
bind = "0.0.0.0:80"

# Log level
loglevel = "info"

# Access log - records incoming requests
accesslog = "-"

# Error log - records gunicorn server errors
errorlog = "-"
