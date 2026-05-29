import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BusinessCategory } from "@prisma/client";

const updateSchema = z.object({
  businessName: z.string().min(2).max(100).optional(),
  category: z.nativeEnum(BusinessCategory).optional(),
  bio: z.string().max(1000).optional(),
  phone: z.string().max(30).optional(),
  website: z.string().url().optional().or(z.literal("")),
  suburb: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().length(2).optional(),
  isPublished: z.boolean().optional(),
  // Trust signals
  lbpNumber: z.string().max(50).optional().or(z.literal("")),
  nzbn: z.string().max(13).optional().or(z.literal("")),
  insuranceCarrier: z.string().max(100).optional().or(z.literal("")),
  insuranceExpiry: z.string().datetime({ offset: true }).optional().or(z.literal("")),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ business });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const {
    businessName, category, bio, phone, website, suburb, city, state, country, isPublished,
    lbpNumber, nzbn, insuranceCarrier, insuranceExpiry,
  } = parsed.data;

  const business = await prisma.business.update({
    where: { id: existing.id },
    data: {
      ...(businessName !== undefined && { name: businessName }),
      ...(category !== undefined && { category }),
      ...(bio !== undefined && { bio }),
      ...(phone !== undefined && { phone }),
      ...(website !== undefined && { website: website || null }),
      ...(suburb !== undefined && { suburb }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(country !== undefined && { country }),
      ...(isPublished !== undefined && { isPublished }),
      ...(lbpNumber !== undefined && { lbpNumber: lbpNumber || null }),
      ...(nzbn !== undefined && { nzbn: nzbn || null }),
      ...(insuranceCarrier !== undefined && { insuranceCarrier: insuranceCarrier || null }),
      ...(insuranceExpiry !== undefined && {
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
      }),
    },
  });

  return NextResponse.json({ business });
}
