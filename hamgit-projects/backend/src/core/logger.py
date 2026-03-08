import logging

import sentry_sdk


class Logger:
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)

    def debug(self, message):
        self.logger.debug(message)

    def info(self, message):
        self.logger.info(message)

    def warning(self, message):
        self.logger.warning(message)

    def error(self, message, exc: Exception | None = None):
        self.logger.error(message)
        if exc:
            sentry_sdk.capture_exception(exc)
            self.logger.error(exc)


# import logging

# import sentry_sdk
# from sentry_sdk.integrations.logging import LoggingIntegration

# SENTRY_DSN = "https://21ab78db800fb425c2e12dc9e8e4c3fd@sentry.hamravesh.com/6766"


# # Initialize Sentry
# sentry_sdk.init(
#     dsn=SENTRY_DSN,
#     integrations=[LoggingIntegration(level=logging.ERROR, event_level=logging.ERROR)],
#     traces_sample_rate=1.0,
#     attach_stacktrace=True,
# )

# # Configure logging
# logging.basicConfig(level=logging.ERROR, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

# # Test error logging
# logger = logging.getLogger(__name__)
# logger.error("This is a test error message")
