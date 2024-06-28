"use client";

import { User } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ShowUser from "./ShowUser";

interface CP {
  username: string;
}

export default function GetFriends({ username }: CP) {
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

  if (!user || !user.friends) {
    return <div>No friends found for this user.</div>; // Handle case where user or favorites are null
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="font-medium text-white">Amigos: ({user.friends.length})</p>
      <div className="flex gap-1">
        {user.friends.map((friends: string) => (
          <ShowUser key={friends} username={friends} />
        ))}
      </div>
    </div>
  );
}
