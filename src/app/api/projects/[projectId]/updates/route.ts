import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createUpdateSchema = z.object({
  body: z.string().min(1).max(5000),
  photoUrls: z.array(z.string().url()).max(10).default([]),
  photoCaptions: z.array(z.string().max(200)).default([]),
});

interface Params {
  params: Promise<{ projectId: string }>;
}

async function getOwnedProject(userId: string, projectId: string) {
  const business = await prisma.business.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!business) return null;

  return prisma.project.findFirst({
    where: { id: projectId, businessId: business.id },
    select: { id: true },
  });
}

export async function GET(_req: Request, { params }: Params) {
  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId, isPublic: true },
    select: { id: true },
  });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updates = await prisma.projectUpdate.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
    },
  });

  return NextResponse.json({ updates });
}

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const project = await getOwnedProject(session.user.id, projectId);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = createUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { body: updateBody, photoUrls, photoCaptions } = parsed.data;

  const update = await prisma.projectUpdate.create({
    data: {
      projectId,
      body: updateBody,
      photos: {
        create: photoUrls.map((url, i) => ({
          projectId,
          url,
          caption: photoCaptions[i] ?? null,
          sortOrder: i,
        })),
      },
    },
    include: { photos: true },
  });

  return NextResponse.json({ update }, { status: 201 });
}
