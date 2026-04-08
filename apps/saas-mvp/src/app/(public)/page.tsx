import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="pb-16">
      <section className="container-page pt-8">
        <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="text-lg font-extrabold text-brand-700">همکار پلاس</div>
          <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
            <a href="#features">ویژگی‌ها</a>
            <a href="#how">نحوه کار</a>
            <a href="#pricing">قیمت‌گذاری</a>
            <a href="#faq">سوالات متداول</a>
          </nav>
          <div className="flex gap-2">
            <Link href="/login" className="btn-secondary">ورود</Link>
            <Link href="/signup" className="btn-primary">شروع رایگان</Link>
          </div>
        </header>
      </section>

      <section className="container-page mt-10 grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-black leading-tight text-slate-900">همه کارهای تیم، در یک پلتفرم فارسی و قابل اعتماد</h1>
          <p className="mt-4 text-slate-600">مدیریت پروژه، وظایف، همکاری تیمی و CRM را یکپارچه کنید. سریع‌تر تصمیم بگیرید و عملیات تیمی را شفاف پیش ببرید.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/signup" className="btn-primary">ایجاد حساب سازمانی</Link>
            <Link href="/dashboard" className="btn-secondary">مشاهده دموی محصول</Link>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-blue-50 via-white to-slate-50">
          <p className="text-sm font-semibold text-slate-500">پیش‌نمایش داشبورد مدیریتی</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["پروژه‌های فعال", "۱۲"],
              ["وظایف باز", "۴۸"],
              ["عقب‌افتاده", "۷"],
              ["معاملات در مذاکره", "۹"]
            ].map(([title, value]) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">{title}</p>
                <p className="mt-2 text-2xl font-extrabold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="container-page mt-16">
        <h2 className="text-2xl font-bold">ویژگی‌های کلیدی</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {["مدیریت پروژه و کانبان", "وظایف و زیرتسک", "کامنت و همکاری تیمی", "CRM سبک و پایپ‌لاین", "گزارش مدیریتی", "اعلان و Activity Log"].map((item) => (
            <article key={item} className="card text-sm text-slate-700">{item}</article>
          ))}
        </div>
      </section>

      <section id="how" className="container-page mt-16">
        <h2 className="text-2xl font-bold">نحوه کار</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["۱", "ساخت سازمان", "اعضا را دعوت کنید و نقش‌ها را تعیین کنید."],
            ["۲", "ایجاد پروژه", "ساختار کار را با لیست‌ها و وظایف مشخص کنید."],
            ["۳", "اجرا و پایش", "از داشبورد، اعلان‌ها و گزارش‌ها برای تصمیم‌گیری استفاده کنید."]
          ].map(([step, title, desc]) => (
            <div key={step} className="card">
              <span className="badge bg-brand-50 text-brand-700">مرحله {step}</span>
              <h3 className="mt-3 font-bold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="container-page mt-16">
        <h2 className="text-2xl font-bold">پلن‌ها</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="card"><h3 className="font-bold">شروع</h3><p className="mt-2 text-sm text-slate-600">مناسب تیم‌های کوچک - Placeholder</p></div>
          <div className="card border-brand-200"><h3 className="font-bold text-brand-700">حرفه‌ای</h3><p className="mt-2 text-sm text-slate-600">برای تیم‌های در حال رشد - Placeholder</p></div>
        </div>
      </section>

      <section id="faq" className="container-page mt-16">
        <h2 className="text-2xl font-bold">سوالات متداول</h2>
        <div className="mt-5 space-y-3">
          <div className="card"><h3 className="font-bold">آیا رابط کاربری کاملاً فارسی است؟</h3><p className="mt-2 text-sm text-slate-600">بله، همه صفحات و جریان‌ها RTL واقعی و فارسی هستند.</p></div>
          <div className="card"><h3 className="font-bold">آیا برای تیم‌های ایرانی مناسب است؟</h3><p className="mt-2 text-sm text-slate-600">تمرکز محصول روی فرایندها و تجربه کاربری تیم‌های ایرانی طراحی شده است.</p></div>
        </div>
      </section>

      <footer className="container-page mt-16 text-center text-sm text-slate-500">© 2026 همکار پلاس - همه حقوق محفوظ است.</footer>
    </main>
  );
}
