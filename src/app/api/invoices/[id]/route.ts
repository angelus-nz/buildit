import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const PatchSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("send") }),
  z.object({ action: z.literal("mark_paid") }),
  z.object({ action: z.literal("cancel") }),
  z.object({
    action: z.literal("update"),
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    amountCents: z.number().int().min(1).optional(),
    dueAt: z.string().datetime().nullable().optional(),
  }),
]);

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
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

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      quote: {
        select: {
          id: true,
          customer: { select: { name: true, email: true } },
        },
      },
    },
  });
  if (!invoice || invoice.businessId !== business.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(invoice);
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

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    select: { id: true, businessId: true, status: true },
  });
  if (!invoice || invoice.businessId !== business.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;

  if (data.action === "send") {
    if (invoice.status !== "DRAFT") {
      return NextResponse.json({ error: "Only DRAFT invoices can be sent" }, { status: 400 });
    }
    const updated = await prisma.invoice.update({ where: { id }, data: { status: "SENT" } });
    return NextResponse.json(updated);
  }

  if (data.action === "mark_paid") {
    if (!["SENT", "OVERDUE"].includes(invoice.status)) {
      return NextResponse.json({ error: "Invoice cannot be marked paid in current state" }, { status: 400 });
    }
    const updated = await prisma.invoice.update({
      where: { id },
      data: { status: "PAID", paidAt: new Date() },
    });
    return NextResponse.json(updated);
  }

  if (data.action === "cancel") {
    if (invoice.status === "PAID") {
      return NextResponse.json({ error: "Paid invoices cannot be cancelled" }, { status: 400 });
    }
    const updated = await prisma.invoice.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    return NextResponse.json(updated);
  }

  if (data.action === "update") {
    if (invoice.status !== "DRAFT") {
      return NextResponse.json({ error: "Only DRAFT invoices can be edited" }, { status: 400 });
    }
    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.amountCents !== undefined && { amountCents: data.amountCents }),
        ...(data.dueAt !== undefined && { dueAt: data.dueAt ? new Date(data.dueAt) : null }),
      },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
