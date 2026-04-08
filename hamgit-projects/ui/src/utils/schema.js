import { z } from 'zod'

const mobileNumberSchema = z
  .string({
    required_error: 'شماره موبایل الزامی است.',
  })
  .trim()
  .min(1, 'شماره موبایل الزامی است.')
  .max(11, 'شماره موبایل حداکثر می‌تواند 11 رقم باشد')
  .regex(/^0?9\d{9}|^9\d{9}$/, 'شماره موبایل وارد شده اشتباه است.')

const ibanSchema = z
  .string()
  .min(1, { message: 'این گزینه اجباریه' })
  .min(24, { message: 'شماره اشتباه است' })
  .max(24, { message: 'شماره اشتباه است' })

const nationalCodeSchema = z
  .string()
  .min(1, { message: 'این گزینه اجباریه' })
  .min(10, { message: 'کد ملی اشتباه است' })
  .max(10, { message: 'کد ملی اشتباه است' })

const addressSchema = z
  .string()
  .min(1, { message: 'این گزینه اجباریه' })
  .max(500, { message: 'آدرس باید کمتر از 500 کاراکتر باشد' })

const stringSchema = z.string().trim().min(1, { message: 'این گزینه اجباریه' })

export { mobileNumberSchema, ibanSchema, nationalCodeSchema, addressSchema, stringSchema }
