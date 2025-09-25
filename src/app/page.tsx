"use client";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import CardSearch from "./components/CardSearch";
import CardLibrary from "./components/CardLibrary";
import BottomActionToast from "./components/BottomActionToast";
import Profile from "./components/Profile";
import Image from "next/image";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"search" | "library">("search");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastKind, setToastKind] = useState<
    "added" | "removed" | "error" | "info"
  >("info");

  const [toastTitle, setToastTitle] = useState<string>();
  const [toastDescription, setToastDescription] = useState<string>();

  if (status === "loading") {
    return <p className="flex justify-center mt-10">Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center mt-20">
        <h1 className="font-starborn text-3xl mb-6">Storycita</h1>
        <button
          onClick={() => signIn()}
          className="bg-purpleLight px-4 py-2 rounded-md hover:bg-purple-600 text-white"
        >
          Login with GitHub
        </button>
      </div>
    );
  }

  const handleToggle = async (
    imdbId: string,
    type: string,
    nextAdded: boolean
  ) => {
    const url = nextAdded ? "/api/media/import" : "/api/media/remove";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imdbId, type }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      setToastKind("error");
      setToastTitle("Error");
      setToastDescription(error ?? "Intenta nuevamente");
      setToastOpen(true);
      return;
    }

    if (nextAdded) {
      setToastKind("added");
      setToastTitle("Added to your library");
      setToastDescription("You can find it in your library");
    } else {
      setToastKind("removed");
      setToastTitle("Removed from your library");
      setToastDescription("The item was deleted successfully");
    }
    setToastOpen(true);
  };

  return (
    <main >
      <div className="flex justify-center">
        <h1 className="font-starborn text-3xl ">Storycita</h1>
      </div>
      <div className="bg-white h-2 mt-4 w-full"></div>
      <Profile />
      <div className="flex justify-center mt-10 gap-4">
        <button className="p-3 cursor-pointer" onClick={() => setActiveTab("search")}>
          Search
        </button>
        <Image
          src="/star.svg"
          alt="Star animation"
          width={20}
          height={20}
          className="animate-spin"
        />
        <button className="p-3 cursor-pointer" onClick={() => setActiveTab("library")}>
          My Library
        </button>
      </div>
      <BottomActionToast
        open={toastOpen}
        onOpenChange={setToastOpen}
        kind={toastKind}
        title={toastTitle}
        description={toastDescription}
      />

      <div className="justify-center">
        {activeTab === "search" && <CardSearch onToggle={handleToggle} />}
        {session && activeTab === "library" && (
          <CardLibrary userId={session.user!.id} />
        )}
      </div>
    </main>
  );
}
