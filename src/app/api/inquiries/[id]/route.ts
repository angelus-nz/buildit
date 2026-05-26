import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const PatchSchema = z.union([
  z.object({ action: z.literal("read") }),
  z.object({ action: z.literal("reply"), reply: z.string().min(1).max(5000) }),
]);

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session || session.user.role !== "TRADESMAN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!business) {
    return NextResponse.json({ error: "No business profile" }, { status: 403 });
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    select: { id: true, businessId: true },
  });
  if (!inquiry || inquiry.businessId !== business.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (parsed.data.action === "read") {
    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status: "READ" },
    });
    return NextResponse.json(updated);
  }

  const updated = await prisma.inquiry.update({
    where: { id },
    data: { reply: parsed.data.reply, status: "REPLIED" },
  });
  return NextResponse.json(updated);
}
