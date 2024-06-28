"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import GetManga from "../mangas/GetManga";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DialogContentMangas from "../mangas/DialogContentMangas";

interface MangaCollectionItem {
  mangaId: string;
  _id: string;
  volumes: [];
}

interface CP {
  username: string;
  isAuthenticatedUser: boolean;
}

export default function GetMangaCollection({ username, isAuthenticatedUser }: CP) {
  const [mangaCollection, setMangaCollection] = useState<MangaCollectionItem[]>(
    []
  );

  useEffect(() => {
    const fetchMangaCollection = async () => {
      console.log("usenarme", username)
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
            <Dialog key={mangaItem._id}>
              <DialogTrigger>
                <GetManga
                  mangaId={mangaItem.mangaId}
                  inCollection={mangaItem.volumes.length}
                />
              </DialogTrigger>
              <DialogContentMangas
                volumesLength={mangaItem.volumes.length}
                mangaId={mangaItem.mangaId}
                username={username}
                isAuthenticatedUser={isAuthenticatedUser}
              />
            </Dialog>
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
