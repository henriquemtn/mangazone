import React, { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { Characters } from "@/types/types";
import AddPeoples from "../peoples/AddPeoples";

interface Props {
  characterId: string;
}

const CharacterFavorites: React.FC<Props> = ({ characterId }) => {
  const [character, setCharacter] = useState<Characters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get<Characters>(
          `https://api-mangazone.onrender.com/api/characters/${characterId}`
        );
        setCharacter(response.data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col items-center gap-2">
        <Skeleton className="w-[82px] h-[116px] rounded-md" />
        </div>
      </div>
    );
  }

  if (error) return <div>Error fetching character: {error}</div>;

  return (
    <div>
      {character ? (
        <div className="flex h-auto rounded items-start justify-between flex-col transition-all cursor-pointer">
          <div className="w-[82px]">
            {character.photoUrl ? (
              <Image
                src={character.photoUrl}
                alt={character.name}
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
        <div>No character found.</div>
      )}
    </div>
  );
};

export default CharacterFavorites;
