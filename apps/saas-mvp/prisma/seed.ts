import { PrismaClient, DealStage, ProjectStatus, Role, TaskPriority, TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.taskTag.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.taskList.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash("12345678", 10);

  const owner = await prisma.user.create({
    data: { email: "owner@hamkar.app", fullName: "علی رضایی", passwordHash: hash }
  });

  const admin = await prisma.user.create({
    data: { email: "admin@hamkar.app", fullName: "سارا محمدی", passwordHash: hash }
  });

  const member = await prisma.user.create({
    data: { email: "member@hamkar.app", fullName: "مهدی حسینی", passwordHash: hash }
  });

  const org = await prisma.organization.create({
    data: {
      name: "گروه توسعه آریا",
      slug: "aria-group"
    }
  });

  await prisma.membership.createMany({
    data: [
      { userId: owner.id, organizationId: org.id, role: Role.OWNER },
      { userId: admin.id, organizationId: org.id, role: Role.ADMIN },
      { userId: member.id, organizationId: org.id, role: Role.MEMBER }
    ]
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: "عملیات اصلی",
      slug: "main-ops",
      organizationId: org.id
    }
  });

  const project = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: "راه‌اندازی پلتفرم فروش آنلاین",
      description: "تحلیل، طراحی و پیاده‌سازی نسخه اولیه فروش B2B",
      status: ProjectStatus.ACTIVE,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }
  });

  await prisma.projectMember.createMany({
    data: [
      { projectId: project.id, userId: owner.id, role: Role.OWNER },
      { projectId: project.id, userId: admin.id, role: Role.ADMIN },
      { projectId: project.id, userId: member.id, role: Role.MEMBER }
    ]
  });

  const todoList = await prisma.taskList.create({
    data: { projectId: project.id, name: "در حال انجام", order: 1 }
  });

  const tagUrgent = await prisma.tag.create({
    data: { workspaceId: workspace.id, name: "فوری", color: "#d92d20" }
  });

  const task = await prisma.task.create({
    data: {
      projectId: project.id,
      taskListId: todoList.id,
      assigneeId: admin.id,
      title: "طراحی جریان ثبت سفارش",
      description: "تعریف کامل فرایند ثبت سفارش و تایید مالی",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2)
    }
  });

  await prisma.taskTag.create({ data: { taskId: task.id, tagId: tagUrgent.id } });
  await prisma.subtask.createMany({
    data: [
      { taskId: task.id, title: "ترسیم فلو در فیگما", done: true },
      { taskId: task.id, title: "تایید با تیم فروش", done: false }
    ]
  });

  await prisma.comment.create({
    data: {
      taskId: task.id,
      authorId: owner.id,
      content: "لطفاً نسخه نهایی تا پایان روز آماده شود. @سارا"
    }
  });

  const customer = await prisma.customer.create({
    data: {
      workspaceId: workspace.id,
      name: "شرکت پارس تجهیز",
      company: "پارس تجهیز",
      email: "info@parstajhiz.ir",
      phone: "02188776655"
    }
  });

  await prisma.lead.createMany({
    data: [
      { workspaceId: workspace.id, name: "نیلوفر اکبری", company: "رویش افزار", source: "وب‌سایت" },
      { workspaceId: workspace.id, name: "احسان قاسمی", company: "رسا صنعت", source: "معرفی" }
    ]
  });

  await prisma.deal.createMany({
    data: [
      {
        workspaceId: workspace.id,
        customerId: customer.id,
        projectId: project.id,
        title: "قرارداد توسعه سامانه CRM",
        value: 950000000,
        stage: DealStage.NEGOTIATION
      },
      {
        workspaceId: workspace.id,
        title: "خدمات پشتیبانی سالانه",
        value: 280000000,
        stage: DealStage.CONTACTED
      }
    ]
  });

  await prisma.notification.createMany({
    data: [
      {
        workspaceId: workspace.id,
        userId: admin.id,
        title: "وظیفه جدید به شما تخصیص یافت",
        body: "وظیفه طراحی جریان ثبت سفارش به شما واگذار شد",
        type: "TASK_ASSIGNED"
      },
      {
        workspaceId: workspace.id,
        userId: owner.id,
        title: "نظر جدید ثبت شد",
        body: "برای وظیفه طراحی جریان ثبت سفارش یک نظر جدید ثبت شد",
        type: "COMMENT_ADDED"
      }
    ]
  });

  await prisma.activityLog.createMany({
    data: [
      {
        actorId: owner.id,
        organizationId: org.id,
        workspaceId: workspace.id,
        projectId: project.id,
        entityType: "Project",
        entityId: project.id,
        action: "PROJECT_CREATED",
        metadata: { projectName: project.name }
      },
      {
        actorId: admin.id,
        organizationId: org.id,
        workspaceId: workspace.id,
        projectId: project.id,
        taskId: task.id,
        entityType: "Task",
        entityId: task.id,
        action: "TASK_STATUS_CHANGED",
        metadata: { from: "TODO", to: "IN_PROGRESS" }
      }
    ]
  });

  console.log("Seed completed successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
