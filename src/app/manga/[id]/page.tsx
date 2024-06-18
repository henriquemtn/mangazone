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
      <MangaSearchById mangaUrl={`https://api-mangazone.onrender.com/api/mangas/${id}`} />
    </div>
  );
}
