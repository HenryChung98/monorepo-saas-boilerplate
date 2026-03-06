import React from "react";
import { NavBar } from "@/components/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <div className="min-h-screen min-w-full">{children}</div>
    </>
  );
}
