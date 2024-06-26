import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GetManga from '../mangas/GetManga';
interface Manga {
  _id: string;
  title: string;
  author: string;
  releaseDate: string;
  alternativeTitles: string[];
  genres: string[];
  imageUrl: string;
  publisherBy: string;
  synopsis: string;
  score: number;
}

interface MangaCollectionItem {
  mangaId: string;
  _id: string;
}

export default function GetMangaCollection({ username }: { username: string }) {
  const [mangaCollection, setMangaCollection] = useState<MangaCollectionItem[]>([]);

  useEffect(() => {
    const fetchMangaCollection = async () => {
      try {
        const collectionResponse = await axios.get<{ mangaCollection: MangaCollectionItem[] }>(
          `https://api-mangazone.onrender.com/api/user/${username}/mangaCollection`
        );

        setMangaCollection(collectionResponse.data.mangaCollection);
        console.log("MANGA COLECTION",mangaCollection)
      } catch (error: any) {
        console.error('Erro ao buscar coleção de mangás:', error.message);
      }
    };

    fetchMangaCollection();
  }, [username]);

  if (mangaCollection.length === 0) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex gap-2">
        {mangaCollection.map((mangaItem) => (
          <GetManga key={mangaItem._id} mangaId={mangaItem.mangaId} />
        ))}
      </div>
    </div>
  );
}
