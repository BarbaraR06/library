import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imdbId } = await req.json();
    if (!imdbId) {
      return NextResponse.json({ error: "imdbId is required" }, { status: 400 });
    }

    const media = await prisma.media.findUnique({ where: { externalId: imdbId } });
    if (!media) {
      return NextResponse.json({ ok: true });
    }

    await prisma.mediaStatus.delete({
      where: { userId_mediaId: { userId: session.user.id, mediaId: media.id } },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Remove error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Remove failed" },
      { status: 500 }
    );
  }
}
