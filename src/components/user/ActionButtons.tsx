"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  GiftIcon,
  ImagesIcon,
  MessageCircleIcon,
  UserCheck,
  UserPlus,
} from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";
import { User } from "@/types/types";

interface CP {
  username: string;
}

export default function ActionButtons({ username }: CP) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataUsername, setDataUsername] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setDataUsername(parsedUser.username);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (dataUsername) {
          const response = await axios.get(
            `https://api-mangazone.onrender.com/api/user/${dataUsername}`
          );
          console.log("Dados do usuário atualizados:", response.data);
          setUser(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const tokenFromCookie = Cookies.get("token");
    if (tokenFromCookie) {
      const cleanedToken = tokenFromCookie.replace(/"/g, "");
      setToken(cleanedToken);
      fetchUserData();
    } else {
      console.error("Token de autenticação ausente, acesso negado");
      setIsLoading(false);
    }
  }, [username, dataUsername]);

  // Function to add friend
  const addFriend = async () => {
    try {
      if (!token) {
        console.error("Token de autenticação ausente, acesso negado");
        return;
      }

      await axios.put(
        "http://localhost:3000/api/user/addFriend",
        {
          friendId: username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Amigo adicionado com sucesso!");
      toast.success("Amigo adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar amigo:", error);
      toast.error("Erro ao adicionar amigo!");
    }
  };

  // Function to remove friend
  const removeFriend = async () => {
    try {
      if (!token) {
        console.error("Token de autenticação ausente, acesso negado");
        return;
      }

      await axios.put(
        "http://localhost:3000/api/user/removeFriend",
        {
          friendId: username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Amigo removido com sucesso!");
      toast.success("Amigo removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover amigo:", error);
      toast.error("Erro ao remover amigo!");
    }
  };

  return (
    <div className="w-full flex justify-around gap-1">
      <Button className="w-1/4" variant="secondary">
        <MessageCircleIcon size={22} />
      </Button>
      <Button className="w-1/4" variant="secondary">
        <ImagesIcon size={22} />
      </Button>
      {user && username && (
        <>
          {user.friends && user.friends.includes(username) ? (
            <Button
              onClick={removeFriend}
              className="w-1/4"
              variant="secondary"
            >
              <UserCheck size={22} /> 
            </Button>
          ) : (
            <Button onClick={addFriend} className="w-1/4" variant="secondary">
              <UserPlus size={22} />
            </Button>
          )}
        </>
      )}
      <Button className="w-1/4" variant="secondary">
        <GiftIcon size={22} />
      </Button>
    </div>
  );
}
