import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!business) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const cert = await prisma.certification.findFirst({
    where: { id, businessId: business.id },
    select: { id: true },
  });

  if (!cert) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.certification.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
