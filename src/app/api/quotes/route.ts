import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const CreateSchema = z.object({
  customerEmail: z.string().email(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  amountCents: z.number().int().min(1),
  currency: z.string().length(3).default("NZD"),
  expiresAt: z.string().datetime().optional(),
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

  const quotes = await prisma.quote.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      invoice: { select: { id: true, status: true } },
    },
  });

  return NextResponse.json(quotes);
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

  const { customerEmail, title, description, amountCents, currency, expiresAt } = parsed.data;

  const customer = await prisma.user.findUnique({
    where: { email: customerEmail },
    select: { id: true },
  });
  if (!customer) {
    return NextResponse.json(
      { error: "Customer not found. The email must belong to a registered user." },
      { status: 404 },
    );
  }

  const quote = await prisma.quote.create({
    data: {
      businessId: business.id,
      customerId: customer.id,
      title,
      description,
      amountCents,
      currency,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      status: "DRAFT",
    },
    include: {
      customer: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(quote, { status: 201 });
}
