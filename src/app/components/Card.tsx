"use client";
import { useState, useEffect } from "react";
import CruzIcon from "../icons/CruzIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MediaStatusType =
  | "WISHLIST"
  | "WATCHING"
  | "COMPLETED"
  | "DROPPED"
  | "PAUSED";

export interface LibraryCardMedia {
  id: string;
  title: string;
  year?: number;
  posterUrl?: string;
  imdbRating?: number;
  type: "MOVIE" | "SERIES" | "BOOK";
  seriesDetails?: { seasons?: number; episodes?: number };
  movieDetails?: { runtimeMinutes?: number; director?: string };
  bookDetails?: { author?: string; pages?: number };
}

export interface LibraryCardItem {
  id: string; // id del status
  status: MediaStatusType;
  rating?: number | null;
  progress?: number | null;
  currentSeason?: number | null;
  currentEpisode?: number | null;
  currentPage?: number | null;
  totalPages?: number | null;
  notes?: string;
  media: LibraryCardMedia;
}

interface LibraryCardProps {
  item: LibraryCardItem;
  onUpdate: (
    mediaId: string,
    updates: Partial<LibraryCardItem>
  ) => Promise<void> | void;
  onRemove: (mediaId: string, title: string) => Promise<void> | void;
}

export default function Card({ item, onUpdate, onRemove }: LibraryCardProps) {
  // notas locales (draft), para no disparar updates en cada keypress
  const [notesDraft, setNotesDraft] = useState(item.notes ?? "");

  useEffect(() => {
    setNotesDraft(item.notes ?? "");
  }, [item.notes, item.media.id]);

  return (
    <div className="relative border-2 border-purpleLight rounded-md m-2 p-4">
      <button
        onClick={() => onRemove(item.media.id, item.media.title)}
        className="absolute top-2 right-2 p-1 rounded-full cursor-pointer"
        title="Remove from library"
      >
        <CruzIcon className="w-3 h-3" />
      </button>

      <div className="flex gap-4">
        {item.media.posterUrl && (
          <img
            src={item.media.posterUrl}
            alt={item.media.title}
            className="w-20 h-[120px] object-cover rounded-xl"
          />
        )}

        <div className="flex-1">
          <h3 className="mb-2 font-semibold">{item.media.title}</h3>
          <p className="mb-2 text-gray-600">
            {item.media.year} • {item.media.type}
            {item.media.imdbRating && ` • ⭐ ${item.media.imdbRating}`}
          </p>

          <div className="flex flex-col gap-2 md:flex-row ">
            <Select
              value={item.status}
              onValueChange={(value) =>
                onUpdate(item.media.id, { status: value as MediaStatusType })
              }
            >
              <SelectTrigger className="w-48 rounded-lg text-gray-900 bg-pink">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-pink rounded-lg text-dark">
                <SelectItem value="WISHLIST" className="text-purpleDark">
                  Wishlist
                </SelectItem>
                <SelectItem value="WATCHING" className="text-purpleDark">
                  Watching
                </SelectItem>
                <SelectItem value="COMPLETED" className="text-purpleDark">
                  Completed
                </SelectItem>
                <SelectItem value="PAUSED" className="text-purpleDark">
                  Paused
                </SelectItem>
                <SelectItem value="DROPPED" className="text-purpleDark">
                  Dropped
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={item.rating?.toString() ?? ""}
              onValueChange={(value) =>
                onUpdate(item.media.id, {
                  rating: value === "" ? null : parseInt(value, 10),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className="bg-pink rounded-lg text-dark">
                <SelectItem value="none" className="text-purpleDark">
                  No rating
                </SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <SelectItem
                    className="text-purpleDark "
                    key={n}
                    value={n.toString()}
                  >
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SERIES */}
          {item.media.type === "SERIES" && item.media.seriesDetails && (
            <div className="mb-2">
              <label className="text-sm">Season:</label>
              <input
                type="number"
                min={1}
                max={item.media.seriesDetails.seasons || 999}
                value={item.currentSeason ?? ""}
                onChange={(e) =>
                  onUpdate(item.media.id, {
                    currentSeason: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-16 mx-2 p-1 rounded border-purpleLight border-2"
              />
              <label className="text-sm">Episode:</label>
              <input
                type="number"
                min={1}
                value={item.currentEpisode ?? ""}
                onChange={(e) =>
                  onUpdate(item.media.id, {
                    currentEpisode: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-16 mx-2 p-1 border rounded"
              />
            </div>
          )}

          {/* BOOKS */}
          {item.media.type === "BOOK" && (
            <div className="mb-2">
              <label className="text-sm">Page:</label>
              <input
                type="number"
                min={1}
                max={item.media.bookDetails?.pages || 999}
                value={item.currentPage ?? ""}
                onChange={(e) =>
                  onUpdate(item.media.id, {
                    currentPage: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-20 mx-2 p-1 rounded border-purpleLight border-2"
              />
              {item.media.bookDetails?.pages && (
                <span className="text-sm text-gray-600">
                  / {item.media.bookDetails.pages}
                </span>
              )}
            </div>
          )}

          <textarea
            placeholder="Notes..."
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            onBlur={() => onUpdate(item.media.id, { notes: notesDraft })}
            className="w-full h-16 p-1 mt-2 rounded border-purpleLight border-2"
          />
        </div>
      </div>
    </div>
  );
}
