"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Volume {
  _id: string;
  volumeNumber: number;
  releaseDate: string;
  chapters: string[];
  imageUrl: string;
  volumeName: string;
  price?: number;
  link?: string;
}

interface Manga {
  _id: string;
  imageUrl: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  volumes: Volume[];
}

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Manga[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api-mangazone.onrender.com/api/mangas?nome=${encodeURIComponent(
          searchTerm
        )}`
      );
      if (!response.ok) {
        throw new Error("Erro na busca");
      }
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Erro desconhecido", error);
      }
    }
  };

  return (
    <div className="z-50 relative w-full px-4 md:px-0 max-w-md">
      <div className="relative">
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Procure por mangás..."
          className="bg-[#1C212B] w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2  text-white hover:text-gray-500 focus:outline-none"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>
      {searchTerm && (
        <div className="absolute left-0 z-10 mt-2 w-full rounded-md bg-[#161A22] shadow-lg dark:bg-gray-800">
          <ul className="max-h-64 overflow-y-auto rounded-md py-1">
            {searchResults.length > 0 ? (
              searchResults.map((manga) => (
                <li
                  key={manga._id}
                  className="px-4 w-full py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <Link href={`/manga/${manga._id}`} prefetch={false}>
                    <div className="flex items-center">
                      <Image
                        src={manga.imageUrl || "/placeholder.svg"}
                        alt={manga.title}
                        height={40}
                        width={40}
                        className="mr-3 h-24 w-16 rounded-md object-cover"
                      />
                      <div>
                        <h3 className="font-medium  text-white">
                          {manga.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {manga.author}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-2  text-white dark:text-gray-200">
                Nenhum resultado encontrado
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
