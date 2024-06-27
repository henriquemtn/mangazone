import React, { useEffect, useState } from "react";
import axios from "axios";
import GetManga from "../mangas/GetManga";

interface MangaCollectionItem {
  mangaId: string;
  _id: string;
}

export default function GetMangaCollection({ username }: { username: string }) {
  const [mangaCollection, setMangaCollection] = useState<MangaCollectionItem[]>(
    []
  );

  useEffect(() => {
    const fetchMangaCollection = async () => {
      try {
        const collectionResponse = await axios.get<{
          mangaCollection: MangaCollectionItem[];
        }>(
          `https://api-mangazone.onrender.com/api/user/${username}/mangaCollection`
        );

        setMangaCollection(collectionResponse.data.mangaCollection);
      } catch (error: any) {
        console.error("Erro ao buscar coleção de mangás:", error.message);
      }
    };

    fetchMangaCollection();
  }, [username]);

  return (
      <div className="container mx-auto">
        <div className="flex gap-2 items-center justify-start">
          {mangaCollection.length > 0 ? (
            mangaCollection.map((mangaItem) => (
              <GetManga key={mangaItem._id} mangaId={mangaItem.mangaId} />
            ))
          ) : (
            <div className="flex gap-2 items-center justify-center h-full">
              <hr />
              <div className="">
                <p className="text-white">
                  O usuário ainda não adicionou nenhum mangá à sua coleção.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
