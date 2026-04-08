import hashlib
import hmac
import json
import urllib.parse

from core import helpers, settings
from core.exceptions import ValidationException


def verify_hash(data: str) -> tuple[str, str]:

    params = dict(urllib.parse.parse_qsl(data, keep_blank_values=True))
    if "hash" not in params:
        raise ValidationException(detail="No hash")
    received_hash = params.pop("hash")

    if "contact" in params:
        contact_json = json.loads(params["contact"])
        mobile = contact_json["phone"][2:]
        user_id = contact_json["user_id"]
        validated_mobile = helpers.validate_mobile_number(mobile)

    data_check_string = "\n".join(f"{k}={params[k]}" for k in sorted(params.keys()))
    secret_key = hmac.new(b"WebAppData", settings.EITAA_BOT_TOKEN.encode(), hashlib.sha256).digest()
    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(computed_hash, received_hash):
        raise ValidationException(detail="Invalid hash")
    return validated_mobile, str(user_id)
