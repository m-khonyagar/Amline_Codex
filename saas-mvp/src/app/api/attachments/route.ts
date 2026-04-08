import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getStorageDriver } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const projectId = String(form.get("projectId") ?? "");
  const taskId = String(form.get("taskId") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "فایل معتبر ارسال نشده است" }, { status: 400 });
  }

  if (!projectId && !taskId) {
    return NextResponse.json({ message: "باید پروژه یا وظیفه مشخص باشد" }, { status: 400 });
  }

  const driver = getStorageDriver();
  const uploaded = await driver.upload(file);

  const attachment = await prisma.attachment.create({
    data: {
      projectId: projectId || null,
      taskId: taskId || null,
      fileName: uploaded.fileName,
      fileUrl: uploaded.fileUrl,
      mimeType: uploaded.mimeType,
      sizeBytes: uploaded.sizeBytes
    }
  });

  await prisma.activityLog.create({
    data: {
      actorId: user.id,
      projectId: projectId || null,
      taskId: taskId || null,
      entityType: "Attachment",
      entityId: attachment.id,
      action: "ATTACHMENT_UPLOADED"
    }
  });

  return NextResponse.json({ data: attachment, message: "فایل با موفقیت آپلود شد" }, { status: 201 });
}
