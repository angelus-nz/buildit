import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const CreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  amountCents: z.number().int().min(1),
  currency: z.string().length(3).default("NZD"),
  dueAt: z.string().datetime().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "TRADESMAN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!business) {
    return NextResponse.json({ error: "No business profile" }, { status: 403 });
  }

  const invoices = await prisma.invoice.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    include: {
      quote: {
        select: {
          id: true,
          customer: { select: { name: true, email: true } },
        },
      },
    },
  });

  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "TRADESMAN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!business) {
    return NextResponse.json({ error: "No business profile" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const { title, description, amountCents, currency, dueAt } = parsed.data;

  const invoice = await prisma.invoice.create({
    data: {
      businessId: business.id,
      title,
      description,
      amountCents,
      currency,
      dueAt: dueAt ? new Date(dueAt) : null,
      status: "DRAFT",
    },
  });

  return NextResponse.json(invoice, { status: 201 });
}
