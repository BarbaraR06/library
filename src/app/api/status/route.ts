import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { LibraryStatus } from '@prisma/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const items = await prisma.mediaStatus.findMany({ 
    where: { userId: session.user.id },
    include: {
      media: {
        include: {
          seriesDetails: true,
          movieDetails: true,
          bookDetails: true,
        },
      },
    },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const body = await req.json();
  const updateData: any = {
    rating: body.rating,
    progress: body.progress,
    currentSeason: body.currentSeason,
    currentEpisode: body.currentEpisode,
    currentPage: body.currentPage,
    totalPages: body.totalPages,
    notes: body.notes,
    ...(body.status && { status: body.status as LibraryStatus }),
  };

  const createData: any = {
    userId: session.user.id,
    mediaId: body.mediaId,
    status: (body.status as LibraryStatus) ?? 'WISHLIST',
    rating: body.rating,
    progress: body.progress,
    currentSeason: body.currentSeason,
    currentEpisode: body.currentEpisode,
    currentPage: body.currentPage,
    totalPages: body.totalPages,
    notes: body.notes,
  };

  const created = await prisma.mediaStatus.upsert({
    where: { userId_mediaId: { userId: session.user.id, mediaId: body.mediaId } },
    update: updateData,
    create: createData,
    include: {
      media: {
        include: {
          seriesDetails: true,
          movieDetails: true,
          bookDetails: true,
        },
      },
    },
  });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const body = await req.json();
  const { mediaId } = body;
  
  if (!mediaId) {
    return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
  }

  try {
    await prisma.mediaStatus.delete({
      where: {
        userId_mediaId: {
          userId: session.user.id,
          mediaId: mediaId,
        },
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from library:', error);
    return NextResponse.json({ error: 'Failed to remove from library' }, { status: 500 });
  }
}

