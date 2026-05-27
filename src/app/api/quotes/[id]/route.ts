import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const PatchSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("send") }),
  z.object({ action: z.literal("accept") }),
  z.object({ action: z.literal("decline") }),
  z.object({
    action: z.literal("convert_to_invoice"),
    dueAt: z.string().datetime().optional(),
  }),
  z.object({
    action: z.literal("update"),
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    amountCents: z.number().int().min(1).optional(),
    expiresAt: z.string().datetime().nullable().optional(),
  }),
]);

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      business: { select: { name: true, slug: true } },
      customer: { select: { name: true, email: true } },
    },
  });
  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(quote);
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

  const quote = await prisma.quote.findUnique({
    where: { id },
    select: {
      id: true,
      businessId: true,
      status: true,
      title: true,
      description: true,
      amountCents: true,
      currency: true,
    },
  });
  if (!quote || quote.businessId !== business.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;

  if (data.action === "send") {
    if (quote.status !== "DRAFT") {
      return NextResponse.json({ error: "Only DRAFT quotes can be sent" }, { status: 400 });
    }
    const updated = await prisma.quote.update({ where: { id }, data: { status: "SENT" } });
    return NextResponse.json(updated);
  }

  if (data.action === "accept") {
    if (quote.status !== "SENT") {
      return NextResponse.json({ error: "Only SENT quotes can be accepted" }, { status: 400 });
    }
    const updated = await prisma.quote.update({ where: { id }, data: { status: "ACCEPTED" } });
    return NextResponse.json(updated);
  }

  if (data.action === "decline") {
    if (!["SENT", "ACCEPTED"].includes(quote.status)) {
      return NextResponse.json({ error: "Quote cannot be declined in current state" }, { status: 400 });
    }
    const updated = await prisma.quote.update({ where: { id }, data: { status: "DECLINED" } });
    return NextResponse.json(updated);
  }

  if (data.action === "convert_to_invoice") {
    if (quote.status !== "ACCEPTED") {
      return NextResponse.json({ error: "Only ACCEPTED quotes can be converted to invoices" }, { status: 400 });
    }
    const existing = await prisma.invoice.findUnique({ where: { quoteId: id } });
    if (existing) {
      return NextResponse.json({ error: "Invoice already exists for this quote" }, { status: 400 });
    }
    const invoice = await prisma.invoice.create({
      data: {
        businessId: business.id,
        quoteId: id,
        title: quote.title,
        description: quote.description,
        amountCents: quote.amountCents,
        currency: quote.currency,
        status: "DRAFT",
        dueAt: data.dueAt ? new Date(data.dueAt) : null,
      },
    });
    return NextResponse.json(invoice, { status: 201 });
  }

  if (data.action === "update") {
    if (quote.status !== "DRAFT") {
      return NextResponse.json({ error: "Only DRAFT quotes can be edited" }, { status: 400 });
    }
    const updated = await prisma.quote.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.amountCents !== undefined && { amountCents: data.amountCents }),
        ...(data.expiresAt !== undefined && { expiresAt: data.expiresAt ? new Date(data.expiresAt) : null }),
      },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
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

  const quote = await prisma.quote.findUnique({
    where: { id },
    select: { id: true, businessId: true, status: true },
  });
  if (!quote || quote.businessId !== business.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (quote.status !== "DRAFT") {
    return NextResponse.json({ error: "Only DRAFT quotes can be deleted" }, { status: 400 });
  }

  await prisma.quote.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
