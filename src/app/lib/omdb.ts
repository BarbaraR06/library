import axios from 'axios';

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

export interface OMDbSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OMDbMovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface OMDbSeriesDetails extends OMDbMovieDetails {
  totalSeasons: string;
}

export class OMDbService {
  private static async makeRequest(params: Record<string, string>) {
    if (!OMDB_API_KEY) {
      throw new Error('OMDB_API_KEY not configured');
    }

    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        ...params,
      },
    });

    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'OMDb API error');
    }

    return response.data;
  }

  static async searchMovies(query: string, page = 1): Promise<{
    Search: OMDbSearchResult[];
    totalResults: string;
    Response: string;
  }> {
    return this.makeRequest({
      s: query,
      type: 'movie',
      page: page.toString(),
    });
  }

  static async searchSeries(query: string, page = 1): Promise<{
    Search: OMDbSearchResult[];
    totalResults: string;
    Response: string;
  }> {
    return this.makeRequest({
      s: query,
      type: 'series',
      page: page.toString(),
    });
  }

  static async getMovieDetails(imdbId: string): Promise<OMDbMovieDetails> {
    return this.makeRequest({
      i: imdbId,
      type: 'movie',
      plot: 'full',
    });
  }

  static async getSeriesDetails(imdbId: string): Promise<OMDbSeriesDetails> {
    return this.makeRequest({
      i: imdbId,
      type: 'series',
      plot: 'full',
    });
  }

  static async searchAll(query: string, page = 1): Promise<{
    Search: OMDbSearchResult[];
    totalResults: string;
    Response: string;
  }> {
    return this.makeRequest({
      s: query,
      page: page.toString(),
    });
  }
}
