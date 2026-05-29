import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Returns paid invoices where the current customer has no review yet
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      status: "PAID",
      review: null,
      quote: { customerId: session.user.id },
    },
    orderBy: { paidAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      amountCents: true,
      currency: true,
      paidAt: true,
      business: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          category: true,
        },
      },
    },
  });

  return NextResponse.json(invoices);
}
