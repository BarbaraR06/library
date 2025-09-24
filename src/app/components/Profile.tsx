"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Profile() {
  const { data: session, status } = useSession();

  const firstName =
    session?.user?.name?.trim()?.split(/\s+/)[0] ??
    session?.user?.email?.split("@")[0] ??
    "usuario";

  return (
    <div className="flex justify-end mt-4 items-center gap-2 mr-4">
      <span className="font-primary text-xl">Hola, {firstName ?? "usuario"}</span>
      <div className="bg-pink rounded-full p-1 cursor-pointer hover:bg-pinkDark">
      <Image src="/power.svg" alt="Log out" width={20} height={20} />
      </div>
    </div>
  );
}
