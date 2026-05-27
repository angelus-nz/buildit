import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import councilsData from "@/data/councils.json";

const validConsentTypeIds = new Set(
  councilsData.councils.flatMap((c) => c.consentTypes.map((t) => t.id)),
);

const CreateSchema = z.object({
  name: z.string().min(1).max(100),
  consentTypeId: z
    .string()
    .refine((v) => validConsentTypeIds.has(v), { message: "Invalid consent type" })
    .optional()
    .nullable(),
  formData: z.record(z.string(), z.string()),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const templates = await prisma.consentApplicationTemplate.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ templates });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const template = await prisma.consentApplicationTemplate.create({
    data: {
      userId: session.user.id,
      name: parsed.data.name,
      consentTypeId: parsed.data.consentTypeId ?? null,
      formData: parsed.data.formData,
    },
  });

  return NextResponse.json({ template }, { status: 201 });
}
