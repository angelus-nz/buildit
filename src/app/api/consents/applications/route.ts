import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import councilsData from "@/data/councils.json";

const validCouncilIds = new Set(councilsData.councils.map((c) => c.id));
const validConsentTypeIds = new Set(
  councilsData.councils.flatMap((c) => c.consentTypes.map((t) => t.id)),
);

const CreateSchema = z.object({
  councilId: z.string().refine((v) => validCouncilIds.has(v), { message: "Invalid council" }),
  consentTypeId: z
    .string()
    .refine((v) => validConsentTypeIds.has(v), { message: "Invalid consent type" }),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  siteAddress: z.string().max(300).optional(),
  formData: z.record(z.string(), z.string()).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.consentApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { correspondenceLogs: { orderBy: { date: "desc" } } },
  });

  return NextResponse.json({ applications });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const { councilId, consentTypeId, title, description, siteAddress, formData } = parsed.data;

  const application = await prisma.consentApplication.create({
    data: {
      userId: session.user.id,
      councilId,
      consentTypeId,
      title,
      description,
      siteAddress,
      ...(formData !== undefined && { formData }),
    },
  });

  return NextResponse.json({ id: application.id }, { status: 201 });
}
