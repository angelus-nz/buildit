import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const UpdateSchema = z.object({
  status: z.enum(["DRAFT", "SUBMITTED", "PROCESSING", "APPROVED", "DECLINED"]).optional(),
  referenceNumber: z.string().max(100).optional(),
  notes: z.string().max(5000).optional(),
  submittedAt: z.string().datetime().optional().nullable(),
  decidedAt: z.string().datetime().optional().nullable(),
});

const AddLogSchema = z.object({
  action: z.literal("add_log"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  summary: z.string().min(1).max(500),
});

const BodySchema = z.union([AddLogSchema, UpdateSchema]);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const application = await prisma.consentApplication.findUnique({
    where: { id, userId: session.user.id },
    include: { correspondenceLogs: { orderBy: { date: "desc" } } },
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ application });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.consentApplication.findUnique({
    where: { id, userId: session.user.id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  if ("action" in parsed.data) {
    const log = await prisma.consentCorrespondenceLog.create({
      data: {
        consentApplicationId: id,
        date: new Date(parsed.data.date),
        summary: parsed.data.summary,
      },
    });
    return NextResponse.json({ log }, { status: 201 });
  }

  const { status, referenceNumber, notes, submittedAt, decidedAt } = parsed.data;

  const updated = await prisma.consentApplication.update({
    where: { id },
    data: {
      ...(status !== undefined && { status }),
      ...(referenceNumber !== undefined && { referenceNumber }),
      ...(notes !== undefined && { notes }),
      ...(submittedAt !== undefined && { submittedAt: submittedAt ? new Date(submittedAt) : null }),
      ...(decidedAt !== undefined && { decidedAt: decidedAt ? new Date(decidedAt) : null }),
    },
    include: { correspondenceLogs: { orderBy: { date: "desc" } } },
  });

  return NextResponse.json({ application: updated });
}
