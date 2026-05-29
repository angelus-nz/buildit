import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const certSchema = z.object({
  name: z.string().min(1).max(100),
  issuingBody: z.string().max(100).optional(),
  certNumber: z.string().max(50).optional(),
  expiresAt: z.string().datetime({ offset: true }).optional().or(z.literal("")),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!business) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const certifications = await prisma.certification.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ certifications });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!business) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = certSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, issuingBody, certNumber, expiresAt } = parsed.data;

  const certification = await prisma.certification.create({
    data: {
      businessId: business.id,
      name,
      issuingBody: issuingBody || null,
      certNumber: certNumber || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json({ certification }, { status: 201 });
}
