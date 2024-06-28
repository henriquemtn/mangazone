"use client";

import Navbar from "@/components/navbar/Navbar";
import GetPeoples from "@/components/peoples/GetPeoples";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ActionButtons from "@/components/user/ActionButtons";
import EditProfile from "@/components/user/EditProfile";
import GetCharacters from "@/components/user/GetCharacters";
import GetFavorites from "@/components/user/GetFavorites";
import GetFriends from "@/components/user/GetFriends";
import GetMangaCollection from "@/components/user/GetMangaCollection";
import { User } from "@/types/types";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function UserPage({ params }: any) {
  const username = params.username;
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
        console.log(user)
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  return (
    <div className="flex flex-col items-center gap-4 min-h-screen bg-[#22262F]">
      <Navbar />
      {isLoading ? (
        <p>Carregando...</p>
      ) : user ? (
        <div className="flex flex-col md:flex-row gap-1 container justify-start items-start mt-60">
          <div className="w-full md:w-1/4">
            <div className="h-full flex gap-2 flex-row justify-around items-center border rounded-t-md p-4">
              <div className="w-24 h-24">
                <Avatar>
                  <AvatarFallback>
                    {user.displayName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                  <AvatarImage src={user.photoURL} />
                </Avatar>
              </div>
              <div className="flex flex-col">
                <p className="font-medium text-base text-white">
                  {user.displayName}
                </p>
                <p className="text-[13px] text-white">@{user.username}</p>
              </div>
            </div>
            <div className="h-full border-x border-b p-4 rounded-b-md">
              {isAuthenticatedUser ? (
                <div className="w-full flex justify-around gap-2">
                  <Button variant="secondary" className="gap-2 w-2/3">
                    WishList
                  </Button>
                  <EditProfile />
                </div>
              ) : (
                <ActionButtons username={user.username} />
              )}
              <GetFriends username={user.username} />
              <hr />
              <p className="text-white p-2">{user.biography}</p>
              <p className="text-white p-2">Location: <span className="text-purple-500">{user.location}</span></p>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-3/4 border-[1px] rounded-md">
            <GetMangaCollection username={username} isAuthenticatedUser={isAuthenticatedUser} />
            <hr />
            <GetFavorites username={user.username} />
            <hr />
            <GetCharacters username={user.username} />
            <hr />
            <GetPeoples username={user.username} />
          </div>
        </div>
      ) : (
        <p>Usuário não encontrado</p>
      )}
    </div>
  );
}
