import React, { useState, useEffect } from "react";
import axios from "axios";
import { Manga } from "@/types/types";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

interface Props {
  mangaId: string;
}

const GetManga: React.FC<Props> = ({ mangaId }) => {
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await axios.get(
          `https://api-mangazone.onrender.com/api/mangas/${mangaId}`
        );
        setManga(response.data); // Assuming the API returns manga details in response.data
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchManga();
  }, [mangaId]);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="w-[160px] h-[260px] rounded-md" />
          <Skeleton className="w-[160px] h-[14px] rounded-md" />
          <Skeleton className="w-[160px] h-[12px] rounded-md" />
        </div>
      </div>
    );
  }

  if (error) return <div>Error fetching manga: {error}</div>;

  return (
    <div>
      {manga ? (
        <div className="flex h-auto rounded items-start justify-between flex-col transition-all cursor-pointer py-4">
          <div className="w-[160px]">
            <img
              src={manga.imageUrl}
              alt={manga.title}
              className="w-full rounded-md h-[260px] pb-2"
            />
            <div className="flex justify-between">
              <Badge variant="outline">
                <p className="text-green-500">
                  1 <span className="text-white"> / 71</span>
                </p>
              </Badge>

              <Badge variant="outline">
                <p className="text-white">Colecionando</p>
              </Badge>
            </div>
          </div>
        </div>
      ) : (
        <div>No manga found.</div>
      )}
    </div>
  );
};

export default GetManga;
