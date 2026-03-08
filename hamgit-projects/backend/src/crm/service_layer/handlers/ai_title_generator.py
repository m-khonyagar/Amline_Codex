import httpx

from core import settings
from core.exceptions import NotFoundException, ValidationException
from crm.domain.entities.landlord_file import LandlordFile
from crm.domain.entities.tenant_file import TenantFile
from crm.service_layer.handlers.file_match_handlers.statics import ai_dumps
from unit_of_work import UnitOfWork

system_message = """
نقش شما: مولد تیتر آگهی املاک برای انتشار در «دیوار».
هدف: تولید دقیقاً یک تیتر بسیار کوتاه، حرفه‌ای و جذاب برای هر فایل ملکی.
قالب ثابت هر تیتر (حداکثر ۵۰ کاراکتر)
[متراژ]متر [تعدادخواب] – [محله] – [مزیت‌کلیدی]
قواعد مهم:
فقط یک تیتر تولید شود (نه بیشتر).
طول تیتر ≤ ۵۰ کاراکتر (با فاصله‌ها).
حداقل یک مزیت کلیدی (از بین: پارکینگ، آسانسور، انباری، مستر، بالکن، دو نبش، نوساز/کم‌سن، فول‌امکانات، نورگیر).
اگر مزیت‌ها زیاد بود، فقط ۱ مورد مهم را بیاور.
از اعداد فارسی استفاده کن (۱۲۳۴۵…).
بدون ایموجی، شماره تماس، لینک، قیمت، علائم اضافی.
بدون هرگونه تبعیض/شرط خلاف قانون یا سیاست دیوار.
اگر محله موجود نبود، از شهر استفاده کن.
اگر متراژ یا خواب نبود، همان بخش را حذف کن ولی ساختار را حفظ کن.
به هیچ عنوان اطلاعاتی رو خودت به تیتر اضافه نکن و فقط از اطلاعات فایل استفاده کن.
ورودی نمونه: فایل جیسون
خروجی نمونه:
"۱۱۵متر ۲خواب – شهرک قدس – پارکینگ"
"""


def ai_title_generator_handler(uow: UnitOfWork, file_id: int):
    landlord_file: LandlordFile | None = uow.session.query(LandlordFile).filter(LandlordFile.id == file_id).first()
    tenant_file: TenantFile | None = uow.session.query(TenantFile).filter(TenantFile.id == file_id).first()
    if landlord_file:
        file = ai_dumps(landlord_file.dumps())
    elif tenant_file:
        file = ai_dumps(tenant_file.dumps())
    else:
        raise NotFoundException(detail="file_not_found")
    response = httpx.post(
        settings.AMLINE_AI_URL, json={"system_message": system_message, "human_message": str(file)}, timeout=120
    )
    response_json = response.json()
    message = response_json.get("message")
    if not message:
        raise ValidationException(detail=response_json.get("error"))
    return message
