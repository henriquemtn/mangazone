"use client";

import { User } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PeopleFavorites from "./PeopleFavorites";
import { AddPeoples } from "./AddPeoples";

interface CP {
  username: string;
}

export default function GetPeoples({ username }: CP) {
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
    return <div>Loading...</div>; // Add a loading indicator
  }

  if (!user || !user.people) {
    return <div>No People found for this user.</div>; // Handle case where user or favorites are null
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between">
        <p className="font-medium  text-white">
          Artistas: ({user.people.length})
        </p>
        {isAuthenticatedUser ? <AddPeoples /> : null}
      </div>
      <div className="flex flex-row gap-1">
        {user.people.map((people: string) => (
          <PeopleFavorites key={people} artistId={people} />
        ))}
      </div>
    </div>
  );
}
