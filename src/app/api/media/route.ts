import { prisma } from "../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const media = await prisma.media.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const created = await prisma.media.create({ data });
  return NextResponse.json(created, { status: 201 });
}


