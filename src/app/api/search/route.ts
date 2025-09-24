import { NextRequest, NextResponse } from 'next/server';
import { OMDbService } from "../../lib/omdb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    let results;
    switch (type) {
      case 'movie':
        results = await OMDbService.searchMovies(query, page);
        break;
      case 'series':
        results = await OMDbService.searchSeries(query, page);
        break;
      case 'all':
      default:
        results = await OMDbService.searchAll(query, page);
        break;
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}
