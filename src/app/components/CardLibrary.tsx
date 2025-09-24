"use client";
import { useState, useEffect } from "react";
import LibraryCard, {
  LibraryCardItem,
  MediaStatusType,
} from "./Card"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MediaLibraryProps {
  userId: string;
}

export default function CardLibrary({ userId }: MediaLibraryProps) {
  const [items, setItems] = useState<LibraryCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchLibrary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLibrary = async () => {
    try {
      const response = await fetch("/api/status");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching library:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (itemId: string, updates: Partial<LibraryCardItem>) => {
    try {
      const response = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, mediaId: itemId }),
      });
      if (response.ok) await fetchLibrary();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const removeFromLibrary = async (mediaId: string, title: string) => {
    if (!confirm(`¿Estás seguro de que quieres quitar "${title}" de tu biblioteca?`)) return;
    try {
      const response = await fetch("/api/status", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId }),
      });
      if (response.ok) await fetchLibrary();
      else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error removing from library:", error);
      alert("Error al quitar de la biblioteca");
    }
  };

  const filteredItems =
    filter === "all" ? items : items.filter((it) => it.status === (filter.toUpperCase() as MediaStatusType));

  if (loading) return <h1 className="mt-10 flex justify-center">Loading...</h1>;

  return (
    <div className="flex flex-col mx-4">
      <h2 className="text-2xl font-bold max-w-screen-md mx-auto mt-8 mb-8 font-secondary">
        My Library
      </h2>

      <div className="mb-4 max-w-screen-md mx-auto">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48 rounded-lg text-gray-900 bg-pink">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-pink rounded-lg text-dark">
            <SelectItem value="all" className="text-purpleDark">All</SelectItem>
            <SelectItem value="WISHLIST" className="text-purpleDark">Wishlist</SelectItem>
            <SelectItem value="WATCHING" className="text-purpleDark">Watching</SelectItem>
            <SelectItem value="COMPLETED" className="text-purpleDark">Completed</SelectItem>
            <SelectItem value="PAUSED" className="text-purpleDark">Paused</SelectItem>
            <SelectItem value="DROPPED" className="text-purpleDark">Dropped</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-screen-lg mx-auto lg:gap-x-60 gap-2">
        {filteredItems.map((item) => (
          <LibraryCard
            key={item.id}
            item={item}
            onUpdate={updateStatus}
            onRemove={removeFromLibrary}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-gray-600 mt-8">
          {filter === "all" ? "Your library is empty" : `No results for ${filter}`}
        </p>
      )}
    </div>
  );
}
