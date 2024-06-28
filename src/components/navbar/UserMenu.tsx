"use client";

import {
  CircleUserRound,
  ClipboardList,
  LibraryBig,
  MessageCircleMore,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoginForm from "../auth/LoginForm";
import { User } from "@/types/types";
import Cookies from "js-cookie";

export default function UserMenu() {
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

  const handleProfileNavigate = () => {
    if (user) {
      router.push(`/u/${user.username}`);
    } else {
      toast("Faça login para acessar. ", {
        duration: 4000,
        position: "top-center",
        style: {},
        className: "",
        icon: "⚠️",
        iconTheme: {
          primary: "#000",
          secondary: "#fff",
        },
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      });
      return "#";
    }
  };

  const handleListNavigate = () => {
    if (user) {
      router.push(`/u/${user.id}/list`);
    } else {
      toast("Faça login para acessar. ", {
        duration: 4000,
        position: "top-center",
        style: {},
        className: "",
        icon: "⚠️",
        iconTheme: {
          primary: "#000",
          secondary: "#fff",
        },
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      });
      return "#";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    Cookies.remove("token");
    window.location.reload();
  };

  return (
    <div className="flex gap-4 items-center">
      <div
        onClick={handleListNavigate}
        className="hidden md:flex items-center gap-1 cursor-pointer"
      >
        <ClipboardList color="#FFFFFF" />
        <p className="font-medium text-[14px] text-white">Minha Lista</p>
      </div>

      <div
        onClick={handleProfileNavigate}
        className="hidden md:flex items-center gap-1 cursor-pointer"
      >
        <LibraryBig color="#FFFFFF" />
        <p className="font-medium text-[14px] text-white">Meu Perfil</p>
      </div>

      {isLoading ? (
        <Skeleton className="flex h-10 w-10 rounded-full" />
      ) : user ? (
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center justify-center gap-1">
              <div className="w-10 h-10 border rounded-full">
                <Avatar>
                  <AvatarFallback>
                    {user.displayName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                  <AvatarImage src={user.photoURL} />
                </Avatar>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Button onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </PopoverContent>
        </Popover>
      ) : (
        <Popover>
          <PopoverTrigger>
            <div className="flex gap-1 items-center">
              <CircleUserRound className="w-7 h-7" color="#FFFFFF" />
              <p className="hidden md:block font-medium text-[14px] text-white">
                Entre ou cadastre-se
              </p>
            </div>
          </PopoverTrigger>
          <PopoverContent className="bg-[#1C212B] ">
            <LoginForm />
          </PopoverContent>
        </Popover>
      )}
      <Link href="/reviews">
        <MessageCircleMore color="white" className="hidden md:flex" />
      </Link>
    </div>
  );
}
