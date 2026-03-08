from dataclasses import dataclass


@dataclass
class AuthExcTrans:
    invalid_otp_code: str = "کد وارد شده نامعتبر است"
    otp_expired: str = "کد وارد شده منقضی شده است"
    invalid_token: str = "توکن نامعتبر است"
    unauthorized_access: str = "دسترسی غیر مجاز"
    user_does_not_exist: str = "کاربر وجود ندارد"
    refresh_token_does_not_exist: str = "توکن رفرش وجود ندارد"
    missing_authorization_header: str = "هدر احراز هویت یافت نشد"
    invalid_authorization_header: str = "هدر احراز هویت نامعتبر است"
    token_revoked: str = "توکن ورودی غیر فعال شده است"
    logged_out_successfully: str = "با موفقیت خارج شدید"
