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
import { Token, User } from "@/types/types";

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
      router.push(`/u/${user.id}`);
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

        // Styling
        style: {},
        className: "",

        // Custom Icon
        icon: "⚠️",

        // Change colors of success/error/loading icon
        iconTheme: {
          primary: "#000",
          secondary: "#fff",
        },

        // Aria
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      });
      return "#"; // Evitar navegação
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="flex gap-4 items-center">
      <div
        onClick={handleListNavigate}
        className="hidden md:flex items-center gap-1 cursor-pointer"
      >
        <ClipboardList color="#181818" />
        <p className="font-medium text-[14px] text-[#181818]">Minha Lista</p>
      </div>

      <div
        onClick={handleProfileNavigate}
        className="hidden md:flex items-center gap-1 cursor-pointer"
      >
        <LibraryBig color="#181818" />
        <p className="font-medium text-[14px] text-[#181818]">Meus Mangás</p>
      </div>

      {isLoading ? (
        <Skeleton className="flex h-10 w-10 rounded-full" />
      ) : user ? (
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center justify-center gap-1">
              <Avatar>
                <AvatarFallback>
                  {user.displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
                <AvatarImage src={user.photoURL} />
              </Avatar>
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
              <CircleUserRound className="w-7 h-7" color="#181818" />
              <p className="hidden md:block font-medium text-[14px] text-[#181818]">
                Entre ou cadastre-se
              </p>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <LoginForm />
          </PopoverContent>
        </Popover>
      )}
      <Link href="/reviews">
        <MessageCircleMore className="hidden md:flex" />
      </Link>
    </div>
  );
}
