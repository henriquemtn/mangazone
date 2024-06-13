"use client";

import MangaSearchById from "@/app/_components/mangapage/MangaSearchById";
import Navbar from "@/components/navbar/Navbar";
import React from "react";

export default function MangaPage({ params }: any) {
  const id = params.id;

  console.log("ID:", id); // Exibe o id no console para depuração

  return (
    <div>
      <Navbar />
      <MangaSearchById mangaUrl={`http://localhost:3000/api/mangas/${id}`} />
    </div>
  );
}
