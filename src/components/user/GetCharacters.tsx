"use client";

import { User } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CharacterFavorites from "../characters/CharacterFavorites";
import AddCharacters from "../characters/AddCharacters";

interface CP {
  username: string;
}

export default function GetCharacters({ username }: CP) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authenticatedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (authenticatedUser && authenticatedUser.username === username) {
      setIsAuthenticatedUser(true);
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://api-mangazone.onrender.com/api/user/${username}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.characters) {
    return <div>No characters found for this user.</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between">
        <p className="font-medium text-white">
          Personagens: ({user.characters.length})
        </p>
        {isAuthenticatedUser ? (
          <AddCharacters username={username} />
        ) : (
          null
        )}
      </div>
      <div className="flex flex-row gap-1">
        {user.characters.map((characters: string) => (
          <CharacterFavorites key={characters} characterId={characters} />
        ))}
      </div>
    </div>
  );
}
