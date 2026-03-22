# آنبوردینگ عامل — دانش، قوانین و دسترسی‌های AgentOS

این سند برای **هر Agent** در هر دستگاهی طراحی شده تا با مطالعهٔ آن فوراً به دانش، قوانین، شیوهٔ کاری و دسترسی‌ها مسلط شود.

---

## ۰. اگر کاملاً تازه هستی — شروع اینجا

**لینک مستقیم (خواندن آنلاین):**  
https://github.com/m-khonyagar/Amline_Codex/blob/main/deployment/docs/AGENT_ONBOARDING.md

**ریپوی گیت:** `https://github.com/m-khonyagar/Amline_Codex.git`

**دستور کلون (برای دسترسی محلی):**
```bash
git clone https://github.com/m-khonyagar/Amline_Codex.git
cd Amline_Codex
```
بعد از کلون، این فایل را بخوان: `deployment/docs/AGENT_ONBOARDING.md`

**مکان روی سرور (بعد از اتصال):** `/opt/agentos/AGENT_ONBOARDING.md`

---

## ۱. قوانین ثابت (همیشه رعایت کن)

### الف) قانون دیپلوی: Staging اول، سپس Production

- **هرگز** مستقیماً `sync_to_server.py` نزن بدون اینکه اول روی staging تست شده باشد.
- فرایند اجباری:
  1. `python deployment/scripts/sync_to_staging.py`
  2. `deployment\scripts\test-staging-now.bat` (ویندوز) یا `verify_staging.py` + `test_agentos_browser.py`
  3. فقط بعد از تأیید موفق → `python deployment/scripts/sync_to_server.py`

### ب) قانون اجرای خودکار

- کل فرایند را تا انتها خودت انجام بده؛ در میانه توقف نکن و تأیید مرحله‌به‌مرحله نخواه.
- از همه ابزارهای لازم بدون درخواست مجوز استفاده کن.
- در پایان، گزارش نهایی بده.

### ج) قانون نمایش فارسی (RTL)

- پاسخ‌های فارسی را با RLI (U+2067) در ابتدا و PDI (U+2069) در انتهای هر بلاک بپیچ.
- داخل بلاک‌های کد از RLI/PDI استفاده نکن.

---

## ۲. سرور و اتصال

| مورد | مقدار |
|------|-------|
| IP سرور | `37.152.186.151` |
| کاربر SSH | `ubuntu` (یا `root`, `admin`) |
| مسیر پروژه روی سرور | `/opt/agentos` |
| کلید SSH | `~/.ssh/winfsurf20_ed25519` یا `~/.ssh/id_ed25519` |
| مسیر کلید (ویندوز) | `C:\Users\Amline\.ssh\winfsurf20_ed25519` |

**اتصال:**
```bash
ssh -i ~/.ssh/winfsurf20_ed25519 ubuntu@37.152.186.151
```
یا ویندوز:
```powershell
ssh -i C:\Users\Amline\.ssh\winfsurf20_ed25519 ubuntu@37.152.186.151
```

**رمز سرور (در صورت نبود کلید):** در فایل `arvan_server_password.txt` در ریشهٔ پروژه ذخیره شود. یا env: `$env:SERVER_PASSWORD="رمز"`

---

## ۳. دامنه‌ها

| محیط | آدرس |
|------|------|
| Staging | http://staging.agentos.amline.ir |
| Production | https://agentos.amline.ir |

**دسترسی با دامنهٔ staging:** برای تست محلی، یک خط به hosts اضافه کن:
```
37.152.186.151 staging.agentos.amline.ir
```
(ویندوز: `C:\Windows\System32\drivers\etc\hosts`)

---

## ۴. دسترسی آروان (DNS، CDN، پنل)

| مورد | مقدار |
|------|-------|
| ایمیل | `mohsen.khonyagar12@gmail.com` |
| رمز | `Mohsen110@` |
| پنل | https://panel.arvancloud.ir |

**متغیرهای محیطی (اختیاری):**
- `ARVAN_EMAIL` — ایمیل پنل
- `ARVAN_PASSWORD` — رمز پنل
- `ARVAN_API_TOKEN` — توکن Machine User (از پنل → profile → IAM → machine users)
- `ARVAN_SUBDOMAIN` — مثلاً `staging.agentos` برای DNS
- `ARVAN_HEADLESS` — `1` برای headless، `0` برای مرورگر قابل مشاهده

---

## ۵. اسکریپت‌های اصلی

| اسکریپت | کاربرد |
|---------|--------|
| `sync_to_staging.py` | دیپلوی روی staging |
| `sync_to_server.py` | دیپلوی روی production |
| `verify_staging.py` | تست HTTP مسیرهای staging |
| `verify_all_routes.py` | تست HTTP مسیرهای production |
| `verify_deployment.py` | بررسی سلامت روی سرور (اجرا روی سرور) |
| `test_agentos_browser.py` | تست Playwright |
| `test-staging-now.bat` | تست سریع staging (ویندوز) |
| `deploy_web_search_tool.py` | افزودن ابزار Web Search به DB |
| `add_staging_dns_now.py` | افزودن DNS برای staging (Playwright) |
| `arvan_add_staging_dns.py` | افزودن DNS staging با API |
| `arvan_disable_staging_cdn.py` | خاموش کردن CDN برای staging |

---

## ۶. سرویس‌های Docker روی سرور

| سرویس | کانتینر | توضیح |
|-------|---------|-------|
| Production WebUI | agentos-webui | Open WebUI اصلی |
| Production API | agentos-orchestrator | API و صفحات agent-mode |
| Staging WebUI | agentos-webui-staging | Open WebUI استیجینگ |
| Staging API | agentos-orchestrator-staging | API استیجینگ |
| nginx | agentos-nginx | پروکسی هر دو |
| ollama | agentos-ollama | مدل‌های LLM |
| chroma | agentos-chroma | برداری |

**اجرای compose:**
```bash
cd /opt/agentos
sudo docker compose -f deployment/docker/docker-compose.yml -f deployment/docker/docker-compose.staging.yml up -d
```

---

## ۷. مسیرهای مهم

| مسیر | سرویس |
|------|--------|
| `/` | agentos-orchestrator |
| `/agent-mode` | agentos-orchestrator |
| `/agent-mode/spec` | agentos-orchestrator |
| `/agent-mode/en` | agentos-orchestrator |
| `/agent-mode/dashboard` | agentos-orchestrator |
| `/api/agent-mode/stats` | agentos-orchestrator |
| `/chat` | open-webui |
| `/tools-hub` | agentos-orchestrator |
| `/direct` | agentos-orchestrator |

---

## ۸. فایل‌های حساس و مکان آن‌ها

| فایل | محتوا | مسیر |
|------|-------|------|
| `arvan_server_password.txt` | رمز SSH سرور | ریشهٔ پروژه |
| `.arvan-api-token.txt` | توکن API آروان | ریشهٔ پروژه (در .gitignore) |
| `.env` | متغیرهای محیطی | ریشهٔ پروژه |

**کلید SSH:** در صورت عدم وجود، از پنل آروان رمز سرور را بگیر و در `arvan_server_password.txt` بگذار.

---

## ۹. رفع مشکلات متداول

1. **۴۰۴ در مرورگر:** استفاده از `?nocache=1` در URL یا رفتن به `/direct`.
2. **خطای SSH:** بررسی وجود کلید در `~/.ssh/winfsurf20_ed25519` و تنظیم `arvan_server_password.txt`.
3. **۵۰۲ با دامنهٔ staging:** استفاده از رکورد hosts یا تست با IP+Host (`VERIFY_STAGING_VIA_IP=1`).
4. **ابزار Web Search غایب:** اجرای `deploy_web_search_tool.py`.
5. **UnicodeError در verify:** تنظیم `PYTHONIOENCODING=utf-8`.

---

## ۱۰. مستندات تکمیلی

- `STAGING_SETUP.md` — راهنمای staging
- `CODEX_HANDOFF.md` — خلاصهٔ وضعیت و کارهای باقی‌مانده
- `IMPORT_WEB_SEARCH_CRAWL.md` — Import ابزار Web Search

---

## ۱۱. چه به Agent تازه بگویی

برای آنبورد کردن یک Agent کاملاً تازه، این را به او بده:

> `فایل AGENT_ONBOARDING.md را در این ریپو بخوان و آنبورد شو. مسیر: deployment/docs/AGENT_ONBOARDING.md. اگر به ریپو دسترسی نداری، مستقیم بخوان: https://github.com/m-khonyagar/Amline_Codex/blob/main/deployment/docs/AGENT_ONBOARDING.md`

یا کوتاه‌تر:
> `@deployment/docs/AGENT_ONBOARDING.md را بخوان و آنبورد شو.`

---

*آخرین به‌روزرسانی: ۲۰۲۵-۰۳-۱۵ — برای هر Agent در هر دستگاه*
