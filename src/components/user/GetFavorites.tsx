"use client";

import { User } from "@/types/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MangaFavorites from "../mangas/MangaFavorites";
import AddFavorites from "../mangas/AddFavorites";

interface CP {
  username: string;
}

export default function GetFavorites({ username }: CP) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);

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
    return <div>Loading...</div>; // Add a loading indicator
  }

  if (!user || !user.favorites) {
    return <div>No favorites found for this user.</div>; // Handle case where user or favorites are null
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between">
        <p className="font-medium  text-white">
          Mangás: ({user.favorites.length})
        </p>
        {isAuthenticatedUser ? <AddFavorites username={username} /> : null}
      </div>
      <div className="flex flex-row gap-1">
        {user.favorites.map((favorite: string) => (
          <MangaFavorites key={favorite} mangaId={favorite} />
        ))}
      </div>
    </div>
  );
}
