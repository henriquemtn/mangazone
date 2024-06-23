"use client";

import Navbar from "@/components/navbar/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center mt-60">
        {isLoading ? (
          <p>Carregando...</p>
        ) : user ? (
          <div>
            <Avatar>
              <AvatarFallback>
                {user.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarImage src={user.photoURL} />
            </Avatar>
            <p>{user.displayName}</p>
            <p>@{user.username}</p>
          </div>
        ) : (
          <p>Usuário não encontrado</p>
        )}
      </div>
    </div>
  );
}
