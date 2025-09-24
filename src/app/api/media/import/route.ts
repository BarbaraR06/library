import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { prisma } from "../../../lib/prisma";
import { OMDbService, type OMDbSeriesDetails } from "../../../lib/omdb";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imdbId, type } = await req.json();

    if (!imdbId || !type) {
      return NextResponse.json({ error: 'imdbId and type are required' }, { status: 400 });
    }

    // Check if media already exists
    const existingMedia = await prisma.media.findUnique({
      where: { externalId: imdbId },
    });

    if (existingMedia) {
      // Ensure a default status for this user
      await prisma.mediaStatus.upsert({
        where: { userId_mediaId: { userId: session.user.id, mediaId: existingMedia.id } },
        update: {},
        create: { userId: session.user.id, mediaId: existingMedia.id, status: 'WISHLIST' },
      });
      return NextResponse.json(existingMedia);
    }

    // Fetch details from OMDb
    let omdbData;
    if (type === 'movie') {
      omdbData = await OMDbService.getMovieDetails(imdbId);
    } else if (type === 'series') {
      omdbData = await OMDbService.getSeriesDetails(imdbId);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Create media record
    const media = await prisma.media.create({
      data: {
        type: type.toUpperCase() as 'MOVIE' | 'SERIES',
        title: omdbData.Title,
        description: omdbData.Plot,
        year: parseInt(omdbData.Year),
        externalId: imdbId,
        posterUrl: omdbData.Poster !== 'N/A' ? omdbData.Poster : null,
        imdbRating: omdbData.imdbRating !== 'N/A' ? parseFloat(omdbData.imdbRating) : null,
        ...(type === 'series' && (() => {
          const s = (omdbData as OMDbSeriesDetails).totalSeasons;
          return {
            seriesDetails: {
              create: {
                episodes: s ? parseInt(s) * 10 : null, 
                seasons: s ? parseInt(s) : null,
              },
            },
          };
        })()),
        ...(type === 'movie' && {
          movieDetails: {
            create: {
              runtimeMinutes: omdbData.Runtime !== 'N/A' ? 
                parseInt(omdbData.Runtime.replace(/\D/g, '')) : null,
              director: omdbData.Director !== 'N/A' ? omdbData.Director : null,
            },
          },
        }),
        sourceMeta: {
          create: {
            source: 'omdb',
            externalId: imdbId,
            data: omdbData as any,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
        },
        // Create default library status for the current user
        statuses: {
          create: {
            userId: session.user.id,
            status: 'WISHLIST',
          },
        },
      },
      include: {
        seriesDetails: true,
        movieDetails: true,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 }
    );
  }
}





