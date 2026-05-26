import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendInquiryNotification } from "@/lib/email";

const CreateSchema = z.object({
  businessId: z.string().min(1),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, retryAfterSeconds } = checkRateLimit(`inquiry:${ip}`, 3, 60 * 60 * 1000);

  if (!allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${retryAfterSeconds} seconds.` },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const { businessId, name, email, subject, message } = parsed.data;

  const business = await prisma.business.findUnique({
    where: { id: businessId, isPublished: true },
    select: { id: true, user: { select: { email: true, name: true } } },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const session = await auth();
  const customerId = session?.user?.id ?? null;

  const inquiry = await prisma.inquiry.create({
    data: { businessId, customerId, name, email, subject, message },
  });

  if (business.user.email) {
    await sendInquiryNotification({
      toEmail: business.user.email,
      toName: business.user.name ?? "there",
      fromName: name,
      fromEmail: email,
      subject,
      message,
    });
  }

  return NextResponse.json({ id: inquiry.id }, { status: 201 });
}
