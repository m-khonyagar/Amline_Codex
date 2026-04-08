import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
});

export const signupSchema = z.object({
  fullName: z.string().min(3, "نام و نام خانوادگی الزامی است"),
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
});

export const projectSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(3, "نام پروژه باید حداقل ۳ کاراکتر باشد"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export const taskSchema = z.object({
  projectId: z.string().min(1),
  taskListId: z.string().optional(),
  assigneeId: z.string().optional(),
  title: z.string().min(3, "عنوان وظیفه کوتاه است"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  dueDate: z.string().optional()
});

export const dealSchema = z.object({
  workspaceId: z.string().min(1),
  customerId: z.string().optional(),
  projectId: z.string().optional(),
  title: z.string().min(3),
  value: z.coerce.number().positive("مبلغ باید مثبت باشد"),
  stage: z.enum(["LEAD", "CONTACTED", "NEGOTIATION", "CONTRACT", "WON", "LOST"])
});
