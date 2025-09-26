"use client";
import { useState } from "react";
import { OMDbSearchResult } from "../lib/omdb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EstrellaIcon from "../icons/EstrellaIcon";
import CheckIcon from "../icons/CheckIcon";

type ToggleFn = (
  imdbId: string,
  type: string,
  nextAdded: boolean
) => Promise<void>;
type SimpleFn = (imdbId: string, type: string) => Promise<void>;

interface MediaSearchProps {
  onToggle?: ToggleFn;
  onImport?: SimpleFn;
  onRemove?: SimpleFn;
  initiallyAddedIds?: string[];
}

export default function CardSearch({
  onToggle,
  onImport,
  onRemove,
  initiallyAddedIds,
}: MediaSearchProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [results, setResults] = useState<OMDbSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // ids agregados a la librería (estado UI)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  // id que está procesando (add/remove)
  const [pendingId, setPendingId] = useState<string | null>(null);
  // id que dispara la animación "ping" al agregar
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({ q: query, type });
      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      setResults(data.Search || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    search();
  };

  const handleToggle = async (imdbId: string, mediaType: string) => {
    const isCurrentlyAdded = addedIds.has(imdbId);
    const nextAdded = !isCurrentlyAdded;

    setPendingId(imdbId);


    setAddedIds((prev) => {
      const copy = new Set(prev);
      nextAdded ? copy.add(imdbId) : copy.delete(imdbId);
      return copy;
    });

    if (nextAdded) {
      setJustAddedId(imdbId);
      setTimeout(
        () => setJustAddedId((id) => (id === imdbId ? null : id)),
        600
      );
    }

    try {
      if (typeof onToggle === "function") {
        await onToggle(imdbId, mediaType, nextAdded);
      } else if (nextAdded && typeof onImport === "function") {
        await onImport(imdbId, mediaType);
      } else if (!nextAdded && typeof onRemove === "function") {
        await onRemove(imdbId, mediaType);
      } else {
        console.warn(
          "CardSearch: no se recibió onToggle ni (onImport/onRemove). Revirtiendo UI."
        );
        throw new Error("No handler provided");
      }
    } catch (error) {
      console.error("Toggle error:", error);
      setAddedIds((prev) => {
        const copy = new Set(prev);
        isCurrentlyAdded ? copy.add(imdbId) : copy.delete(imdbId);
        return copy;
      });
      setJustAddedId(null);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="mt-10">
      <form
        onSubmit={handleSubmit}
        className="flex md:max-w-3xl mx-auto items-center justify-center flex-col md:flex-row gap-4"
      >
        {/* input search */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          autoComplete="off"
          aria-label="Buscar"
          className="rounded-3xl border border-pink  px-10 py-2  placeholder:text-light focus:outline-none bg-white/20 placeholder:text-white text-white "
        />

        {/* filter */}
        <div className="flex gap-1 justify-around">
          <div className="flex">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-40 rounded-lg text-gray-900 bg-pink">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-pink rounded-lg text-dark ">
                <SelectItem value="all" className="text-purpleDark">
                  All
                </SelectItem>
                <SelectItem value="movie" className="text-purpleDark">
                  Movies
                </SelectItem>
                <SelectItem value="series" className="text-purpleDark">
                  Series
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* button search */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-lg py-2 px-6 disabled:opacity-60 disabled:cursor-not-allowed "
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4  mx-auto gap-2 mt-4">
          {results.map((item, index) => {
            const isAdded = addedIds.has(item.imdbID);
            const isPending = pendingId === item.imdbID;
            const showPing = justAddedId === item.imdbID;

            return (
              <div
                key={`${item.imdbID}-${index}`} 
                className="mb-6 flex-col flex items-center justify-center "
              >
                {item.Poster !== "N/A" && (
                  <div className="relative">
                    <img
                      src={item.Poster}
                      alt={item.Title}
                      className="rounded-2xl w-[260px] h-[450px] items-center justify-center"
                    />
                    <div className="absolute bottom-2 right-2">
                      <button
                        onClick={() => handleToggle(item.imdbID, item.Type)}
                        disabled={isPending}
                        aria-label={
                          isAdded ? "Remove from library" : "Add to library"
                        }
                        className={[
                          "relative inline-flex items-center justify-center",
                          "w-10 h-10 rounded-full border",
                          isAdded
                            ? "bg-emerald-500 border-emerald-600 text-white"
                            : "bg-transparent border-emerald-600 text-emerald-600",
                          "transition-all duration-200",
                          isPending
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:scale-105 active:scale-95",
                          "focus:outline-none focus:ring-2 focus:ring-emerald-400/60",
                        ].join(" ")}
                      >
                        {showPing && (
                          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/40 animate-ping" />
                        )}

                        {/* Ícono */}
                        <span
                          className={[
                            "transition-transform duration-200",
                            isAdded ? "scale-110" : "scale-100",
                          ].join(" ")}
                        >
                          {isAdded ? (
                            <CheckIcon className="w-5 h-5" aria-label="check" />
                          ) : (
                            <EstrellaIcon className="w-5 h-5" aria-label="estrella" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex mt-2 w-[250px] justify-center">
                  <div className="">
                    <h3 className="font-semibold text-center">{item.Title}</h3>
                    <p className="text-sm opacity-80 text-center">
                      {item.Year} • {item.Type}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
