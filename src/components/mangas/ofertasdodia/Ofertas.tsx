"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import amazonOffers from "@/app/db/amazon-offers";

interface Oferta {
  imageUrl: string;
  title: string;
  author: string;
  price: string;
  discount: string;
  link: string;
}

export default function OfertasDoDia() {
  const [mangas, setMangas] = useState<Oferta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMangas(amazonOffers.products); 
      setIsLoading(false);
    }, 2000);
  }, []);

  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  const handleClickManga = (link: string) => {
    window.location.href = link;
  };

  return (
    <div className="pb-20 w-full p-2 md:px-64">
      {isLoading ? (
        <div className="grid grid-cols-8 gap-4">
            {[...Array(16)].map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <Skeleton className="w-[168px] h-[268px] rounded-md" />
                <Skeleton className="w-[168px] h-6 rounded-md" />
                <Skeleton className="w-[168px] h-4 rounded-md" />
                <Skeleton className="w-[168px] h-4 rounded-md" />
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
          {mangas.map((manga, index) => (
            <div
              onClick={() => handleClickManga(manga.link)}
              key={index}
              className="flex h-auto rounded items-start justify-between flex-col transition-all cursor-pointer"
            >
              <div className="w-[168px]">
                <img
                  src={manga.imageUrl}
                  alt={manga.title}
                  className="w-full rounded-md h-[268px] pb-2"
                />
                <h1 className="font-bold text-white text-[14px]">
                  {truncateTitle(manga.title, 35)}
                </h1>
                <span className="text-white text-[12px]">
                  {manga.author}
                </span>
              </div>
              <div className="flex flex-row gap-1 items-center mt-2">
                <span className="text-[#17A400] font-semibold text-xl">
                  {manga.price}
                </span>
                {manga.discount && (
                  <span className="text-[11px] text-white line-through">
                    {manga.discount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}