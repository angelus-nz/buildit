import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { BusinessCategory } from "@prisma/client";

const onboardSchema = z.object({
  businessName: z.string().min(2).max(100),
  category: z.nativeEnum(BusinessCategory),
  bio: z.string().max(1000).optional(),
  phone: z.string().max(30).optional(),
  website: z.string().url().optional().or(z.literal("")),
  suburb: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().length(2).default("NZ"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "TRADESMAN") {
    return NextResponse.json({ error: "Only tradesmen can create a profile" }, { status: 403 });
  }

  const existing = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "Profile already exists" }, { status: 409 });
  }

  const body = await req.json();
  const parsed = onboardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { businessName, category, bio, phone, website, suburb, city, state, country } = parsed.data;

  const slug = generateUniqueSlug(businessName);

  const business = await prisma.business.create({
    data: {
      userId: session.user.id,
      name: businessName,
      slug,
      category,
      bio,
      phone,
      website: website || null,
      suburb,
      city,
      state,
      country,
    },
  });

  return NextResponse.json({ business }, { status: 201 });
}
