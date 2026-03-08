import { numberSeparator } from '@/utils/number'

export const templateGenerator = (data) => {
  const templates = {
    buyer: `اَملاین | قراردادهای آنلاین املاک
فایل خرید
بودجه: ${numberSeparator(data?.budget || data?.deposit) || 'ندارد'} تومان
متراژ: ${data?.area || 'ندارد'} متر
محله: ${data?.district?.name || 'ندارد'}
در صورت داشتن فایل فروشنده، همین امروز برای همکاری تماس بگیرید:
02532048000
یا از طریق واتساپ پیام دهید:
https://wa.me/989127463726`,

    seller: `اَملاین | قراردادهای آنلاین املاک
فایل فروش
قیمت پیشنهادی: ${numberSeparator(data?.price || data?.deposit) || 'ندارد'} تومان
متراژ: ${data?.area || 'ندارد'} متر
محله: ${data?.district?.name || 'ندارد'}
در صورت داشتن فایل خریدار، همین امروز برای همکاری تماس بگیرید:
02532048000
یا از طریق واتساپ پیام دهید:
https://wa.me/989127463726`,

    tenant: `اَملاین | قراردادهای آنلاین املاک
فایل مستاجر
بودجه رهن: ${data?.deposit ? numberSeparator(data?.deposit) + ' تومان' : 'ندارد'}
اجاره ماهانه: ${data?.rent ? numberSeparator(data?.rent) + ' تومان' : 'ندارد'}
متراژ موردنیاز: ${data?.area ? data?.area + ' متر' : 'ندارد'}
محله: ${data?.districts?.map((d) => d.name).join(' - ') || 'ندارد'}
در صورت داشتن فایل رهن و اجاره، همین امروز برای همکاری تماس بگیرید:
02532048000
یا از طریق واتساپ پیام دهید:
https://wa.me/989127463726`,

    landlord: `اَملاین | قراردادهای آنلاین املاک
فایل رهن و اجاره
رهن: ${data?.deposit ? numberSeparator(data?.deposit) + ' تومان' : 'ندارد'}
اجاره ماهانه: ${data?.rent ? numberSeparator(data?.rent) + ' تومان' : 'ندارد'}
متراژ: ${data?.area ? data?.area + ' متر' : 'ندارد'}
محله: ${data?.district?.name || 'ندارد'}
در صورت داشتن فایل مستاجر، همین امروز برای همکاری تماس بگیرید:
02532048000
یا از طریق واتساپ پیام دهید:
https://wa.me/989127463726`,
  }

  switch (data?.role) {
    case 'tenant':
      return templates.tenant
    case 'landlord':
      return templates.landlord
    case 'buyer':
      return templates.buyer
    case 'seller':
      return templates.seller
    default:
      return templates.tenant
  }
}
