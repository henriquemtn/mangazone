import React, { useState, useEffect } from "react";
import axios from "axios";
import { Artist } from "@/types/types";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";

interface Props {
  artistId: string;
}

const PeopleFavorites: React.FC<Props> = ({ artistId }) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get<Artist>(
          `https://api-mangazone.onrender.com/api/artists/${artistId}`
        );
        setArtist(response.data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="w-[160px] h-[260px] rounded-md" />
        </div>
      </div>
    );
  }

  if (error) return <div>Error fetching artist: {error}</div>;

  return (
    <div>
      {artist ? (
        <div className="flex h-auto rounded items-start justify-between flex-col transition-all cursor-pointer">
          <div className="w-[82px]">
            {artist.photoUrl ? (
              <Image
                src={artist.photoUrl}
                alt={artist.name}
                 width={82}
                height={116}
                className="w-full border rounded-sm h-[116px] object-cover shadow-md hover:scale-105 transition-all "
              />
            ) : (
              <div className="w-full rounded-md h-[200px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600">Imagem não disponível</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>No artist found.</div>
      )}
    </div>
  );
};

export default PeopleFavorites;
