import React from "react";
import { prisma } from "@/lib/prisma";
import { RfqManager } from "@/components/admin/RfqManager";

export const dynamic = "force-dynamic";

export default async function AdminRfqPage() {
  const rfqs = await prisma.rfqRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedRfqs = rfqs.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return <RfqManager initialRfqs={formattedRfqs} />;
}

