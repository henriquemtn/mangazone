"use client";

import Navbar from "@/components/navbar/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EditProfile from "@/components/user/EditProfile";
import GetMangaCollection from "@/components/user/GetMangaCollection";
import { User } from "@/types/types";
import axios from "axios";
import {
  Edit,
  GiftIcon,
  ImagesIcon,
  MessageCircleIcon,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function UserPage({ params }: any) {
  const username = params.username;
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

  return (
    <div className="min-h-screen">
      <Navbar />
      {isLoading ? (
        <p>Carregando...</p>
      ) : user ? (
        <div className="flex container justify-start items-center mt-60">
          <div className="w-1/4">
            <div className="h-full flex gap-2 flex-row justify-around items-center border p-4">
              <div className="w-24 h-24">
                <Avatar>
                  <AvatarFallback>
                    {user.displayName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                  <AvatarImage src={user.photoURL} />
                </Avatar>
              </div>
              <div className="flex flex-col">
                <p className="font-medium text-base">{user.displayName}</p>
                <p className="text-[13px]">@{user.username}</p>
              </div>
            </div>
            <div className="h-full border p-4">
              {isAuthenticatedUser ? (
                <div className="w-full flex justify-around gap-2">
                  <Button variant="outline" className="gap-2 w-2/3">
                    Minha Coleção
                  </Button>
                  <EditProfile />
                </div>
              ) : (
                <div className="w-full flex justify-around gap-1">
                  <Button className="w-1/4" variant="outline">
                    <MessageCircleIcon size={22} />
                  </Button>
                  <Button className="w-1/4" variant="outline">
                    <ImagesIcon size={22} />
                  </Button>
                  <Button className="w-1/4" variant="outline">
                    <UserPlus size={22} />
                  </Button>
                  <Button className="w-1/4" variant="outline">
                    <GiftIcon size={22} />
                  </Button>
                </div>
              )}
              <div className="mt-2">
                <p>{user.biography}</p>
                <p>{user.friends}</p>
                <p>Mangás: {user.mangaCollection?.length ?? 0}</p>
                <p>Volumes: {user.mangaCollection?.length ?? 0}</p>
              </div>
            </div>
          </div>
          <GetMangaCollection username={user.username} />
        </div>
      ) : (
        <p>Usuário não encontrado</p>
      )}
    </div>
  );
}
