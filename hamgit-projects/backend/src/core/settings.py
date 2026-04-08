from os import getenv
from pathlib import Path

from dotenv import load_dotenv

from core.types import (
    AmlineURLs,
    BaleURLs,
    ElasticSearchConfig,
    ZohalConfig,
    JWTConfig,
    KaveNegarConfig,
    KenarDivarURLs,
    MinioConfig,
    RedisConfig,
    SMSTemplates,
    EitaaTemplates,
    TelegramURLs,
    TSMSConfig,
    TsmsURLs,
    VoipConfig,
    VoipURL
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent

IS_PRODUCTION = getenv("IS_PRODUCTION", "False") == "True"
if IS_PRODUCTION:
    load_dotenv(BASE_DIR / ".env.production")
else:
    load_dotenv(BASE_DIR / ".env.staging")

EMPTY_STRING, ZERO = str(), int()

DEBUG = getenv("APP_DEBUG", "False") == "True"

APP_NAME = (getenv("APP_NAME", EMPTY_STRING),)
APP_URL = (getenv("APP_URL", EMPTY_STRING),)
APP_VERSION = getenv("APP_VERSION", ZERO)
APP_ENV = getenv("APP_ENV", EMPTY_STRING)

CLI_PASSWORD = getenv("CLI_PASSWORD", EMPTY_STRING)

SECRET_KEY = getenv("SECRET_KEY", EMPTY_STRING)

DATABASE_URL = getenv("DATABASE_URL", EMPTY_STRING)
VOIP_DATABASE_URL = getenv("VOIP_DATABASE_URL", EMPTY_STRING)

PDF_GENERATOR_SERVICE_URL = getenv("PDF_GENERATOR_SERVICE_URL", EMPTY_STRING)

minio_config = MinioConfig(
    endpoint=getenv("MINIO_ENDPOINT", EMPTY_STRING),
    access_key=getenv("MINIO_ACCESS_KEY", EMPTY_STRING),
    secret_key=getenv("MINIO_SECRET_KEY", EMPTY_STRING),
    public_bucket=getenv("MINIO_PUBLIC_BUCKET", EMPTY_STRING),
    private_bucket=getenv("MINIO_PRIVATE_BUCKET", EMPTY_STRING),
    url_expire_minutes=int(getenv("MINIO_URL_EXPIRE_MINUTES", ZERO)),
)

jwt_config = JWTConfig(
    secret_key=getenv("JWT_SECRET", EMPTY_STRING),
    algorithm=getenv("JWT_ALGORITHM", EMPTY_STRING),
    access_expire=int(getenv("JWT_ACCESS_EXPIRE", ZERO)),
    refresh_expire=int(getenv("JWT_REFRESH_EXPIRE", ZERO)),
)

redis_config = RedisConfig(
    host=getenv("REDIS_HOST", EMPTY_STRING),
    port=int(getenv("REDIS_PORT", ZERO)),
    password=getenv("REDIS_PASSWORD", EMPTY_STRING),
    db=int(getenv("REDIS_DB", ZERO)),
)

elastic_config = ElasticSearchConfig(
    host=getenv("ELASTIC_SEARCH_HOST", EMPTY_STRING),
    port=int(
        getenv("ELASTIC_SEARCH_PORT", ZERO),
    ),
    password=getenv("ELASTIC_PASSWORD", EMPTY_STRING),
)

zohal_config = ZohalConfig(
    uri=getenv("ZOHAL_URI", EMPTY_STRING),
    secret=getenv("ZOHAL_SECRET", EMPTY_STRING),
)

kavenegar_config = KaveNegarConfig(
    api_key=getenv("KAVENEGAR_API_KEY", EMPTY_STRING),
)

tsms_config = TSMSConfig(
    username=getenv("TSMS_USERNAME", EMPTY_STRING),
    password=getenv("TSMS_PASSWORD", EMPTY_STRING),
    sender_number=getenv("TSMS_SENDER_NUMBER", EMPTY_STRING),
    ding_sender_number=getenv("TSMS_DING_SENDER_NUMBER", EMPTY_STRING),
)

VOIP_OTP_URL = VoipURL(
    send_message="https://voip.amline.ir/otpdial?"
    + "mobile={mobile}&"
    + "digits={otp}&"
    + "service_id={id}"
)

voip_config = VoipConfig(
    auth=getenv("VOIP_AUTH",EMPTY_STRING),
    service_id=getenv("VOIP_SERVICE_ID",EMPTY_STRING )    
)



sms_templates = SMSTemplates(
    otp_template=getenv("KAVENEGAR_OTP_TEMPLATE", EMPTY_STRING),
    sign_contact_otp_template=getenv("KAVENEGAR_SIGN_CONTRACT_OTP_TEMPLATE", EMPTY_STRING),
    invitation_to_landlord_template=getenv("KAVENEGAR_INVITATION_TO_LANDLORD_TEMPLATE", EMPTY_STRING),
    invitation_to_tenant_template=getenv("KAVENEGAR_INVITATION_TO_TENANT_TEMPLATE", EMPTY_STRING),
    counter_party_signed_template=getenv("KAVENEGAR_COUNTER_PARTY_SIGNED_TEMPLATE", EMPTY_STRING),
    counter_party_rejected_template=getenv("KAVENEGAR_COUNTER_PARTY_REJECTED_TEMPLATE", EMPTY_STRING),
    edit_requested_template=getenv("KAVENEGAR_EDIT_REQUESTED_TEMPLATE", EMPTY_STRING),
    custom_payment_template=getenv("KAVENEGAR_CUSTOM_PAYMENT_TEMPLATE", EMPTY_STRING),
    wallet_charge_template=getenv("KAVENEGAR_WALLET_CHARGE_TEMPLATE", EMPTY_STRING),
    invoice_link_template=getenv("KAVENEGAR_INVOICE_LINK_TEMPLATE", EMPTY_STRING),
)

eitaa_templates = EitaaTemplates(
    eitaa_yar_informing_title=getenv("EITAA_YAR_INFORMING_TITLE", EMPTY_STRING),
    eitaa_yar_informing_text=getenv("EITAA_YAR_INFORMING_TEXT", EMPTY_STRING),
)

kenar_divar_urls = KenarDivarURLs(
    post_info="https://open-api.divar.ir/v1/open-platform/finder/post/",
    user_token="https://oauth.divar.ir/oauth2/token",
    user_info="https://open-api.divar.ir/v1/open-platform/users",
)

bale_urls = BaleURLs(
    auth_token="https://safir.bale.ai/api/v2/auth/token", send_otp="https://safir.bale.ai/api/v2/send_otp"
)

tsms_urls = TsmsURLs(
    send_message="https://tsms.ir/url/tsmshttp.php?"
    + "from={sender_number}&"
    + "to={mobile}&"
    + "username={username}&"
    + "password={password}&"
    + "message={text_message}"
)

telegram_urls = TelegramURLs(send_message="https://api.telegram.org/bot{token}/sendMessage")

amline_urls = AmlineURLs(
    production_api="https://api.amline.ir/",
    staging_api="https://amline-backend-staging.darkube.app/",
    production_frontend="https://app.amline.ir/",
    # staging_frontend="https://staging.amline.ir/",
    staging_frontend="https://test.amline.ir/",
    contract_payments="contracts/{contract_id}/payment-history",
    contract="contracts/{contract_id}",
)
AMLINE_FRONTEND_URL = amline_urls.staging_frontend if DEBUG else amline_urls.production_frontend
AMLINE_API_URL = amline_urls.staging_api if DEBUG else amline_urls.production_api

SNOWFLAKE_MACHINE_ID = getenv("SNOWFLAKE_MACHINE_ID", 1)

ALLOWED_ORIGINS: list[str] = [
    "https://amline.ir",
    "https://app.amline.ir",
    "https://api.amline.ir",
    "https://admin.amline.ir",
    "https://admin-panel.amline.ir",
    "https://staging.amline.ir",
    "https://staging-admin.amline.ir",
    "https://new-admin.amline.ir",
    "http://localhost:3000",
    "http://192.168.1.13:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:8000",
    "https://amline.darkube.app",
    "https://amline-admin.darkube.app",
    "https://amline-admin.liara.run",
    "https://amline.liara.run",
    "https://test.app.amline.ir",
    "https://test.api.amline.ir",
    "https://test.admin.amline.ir",
    "http://test.app.amline.ir",
    "http://test.api.amline.ir",
    "http://test.admin.amline.ir", 
]

AMLINE_UID = getenv("AMLINE_UID", EMPTY_STRING)

HOST_PANEL_URL = getenv("HOST_PANEL_URL", EMPTY_STRING)
HOST_PANEL_TOKEN = getenv("HOST_PANEL_TOKEN", EMPTY_STRING)
HOST_PANEL_PROJECT = getenv("HOST_PANEL_PROJECT", EMPTY_STRING)

ZARINPAL_TOKEN = getenv("ZARINPAL_TOKEN", EMPTY_STRING)
ZARINPAL_ENDPOINT = getenv("ZARINPAL_ENDPOINT", EMPTY_STRING)
ZARINPAL_CALL_BACK_URL = getenv("ZARINPAL_CALL_BACK_URL", EMPTY_STRING)

PARSIAN_TOKEN = getenv("PARSIAN_TOKEN", EMPTY_STRING)
PARSIAN_ENDPOINT = getenv("PARSIAN_ENDPOINT", EMPTY_STRING)
PARSIAN_CALL_BACK_URL = getenv("PARSIAN_CALL_BACK_URL", EMPTY_STRING)

BANK_GATEWAY_REDIRECT_URL = getenv("BANK_GATEWAY_REDIRECT_URL", EMPTY_STRING)

WE_CAN_SMS_TOKEN = getenv("WE_CAN_SMS_TOKEN", EMPTY_STRING)
SAHAR_SMS_TOKEN = getenv("SAHAR_SMS_TOKEN", EMPTY_STRING)

MAIL_USERNAME = getenv("MAIL_USERNAME", EMPTY_STRING)
MAIL_PASSWORD = getenv("MAIL_PASSWORD", EMPTY_STRING)
MAIL_FROM = getenv("MAIL_FROM", EMPTY_STRING)
MAIL_PORT = getenv("MAIL_PORT", EMPTY_STRING)
MAIL_SERVER = getenv("MAIL_SERVER", EMPTY_STRING)
MAIL_STARTTLS = getenv("MAIL_STARTTLS", EMPTY_STRING)
MAIL_SSL_TLS = getenv("MAIL_SSL_TLS", EMPTY_STRING)

SENTRY_DSN = getenv("SENTRY_DSN", EMPTY_STRING)

DISCOUNT_SALT = getenv("DISCOUNT_SALT", EMPTY_STRING)

RABBITMQ_URI = f"""
amqp://{getenv("RABBITMQ_USER")}:
{getenv("RABBITMQ_PASSWORD")}@{getenv("RABBITMQ_HOST")}:
{getenv("RABBITMQ_PORT")}
"""

TELEGRAM_BOT_TOKEN = getenv("TELEGRAM_BOT_TOKEN", EMPTY_STRING)
SMS_QUEUE = getenv("SMS_QUEUE", EMPTY_STRING)
KENAR_DIVAR_API_KEY = getenv("KENAR_DIVAR_API_KEY", EMPTY_STRING)
KENAR_DIVAR_APP_SLUG = getenv("KENAR_DIVAR_APP_SLUG", EMPTY_STRING)
KENAR_DIVAR_CLIENT_SECRET = getenv("KENAR_DIVAR_CLIENT_SECRET", EMPTY_STRING)
KENAR_DIVAR_REDIRECT_URI = getenv("KENAR_DIVAR_REDIRECT_URI", EMPTY_STRING)

BALE_CLIENT_ID = getenv("BALE_CLIENT_ID", EMPTY_STRING)
BALE_CLIENT_SECRET = getenv("BALE_CLIENT_SECRET", EMPTY_STRING)

TELEGRAM_BOT_TOKEN = getenv("TELEGRAM_BOT_TOKEN", EMPTY_STRING)
TELEGRAM_CHANNEL_ID = "@amline_amn"

ADMIN_MOBILE = "09109664596"
KHONYAGAR_MOBILE = "09127463726"
AMLINE_CRM_USER_ID = 123456789

EITAA_BOT_TOKEN = getenv("EITAA_BOT_TOKEN", EMPTY_STRING)
EITAA_YAR_TOKEN = getenv("EITAA_YAR_TOKEN", EMPTY_STRING)
EITAA_SIGN_NOTIFY_CHANNEL = getenv("EITAA_SIGN_NOTIFY_CHANNEL", EMPTY_STRING)

AMLINE_AI_URL = "https://chabroknet.de01.lexoya.com/ai/langchain"
