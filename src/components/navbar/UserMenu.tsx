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
import AuthForm from "@/app/_components/auth/AuthForm";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Buscar dados do Firestore usando o uid
      const fetchUserData = async () => {
        const db = getFirestore();
        const userRef = doc(db, "users", parsedUser.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const firestoreUserData = docSnap.data() as User;
            setUser(firestoreUserData);
          } else {
            console.error("Documento do usuário não encontrado");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    signOut(auth);
    sessionStorage.removeItem("user");
    window.location.reload();
  };

  const handleProfileNavigate = () => {
    if (user) {
      router.push(`/user/${user.uid}`);
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

  const handleListNavigate = () => {
    if (user) {
      router.push(`/user/${user.uid}/list`);
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

  return (
    <div className="flex gap-4 items-center">
      <div
        onClick={handleListNavigate}
        className="flex items-center gap-1 cursor-pointer"
      >
        <ClipboardList color="#181818" />
        <p className="font-medium text-[14px] text-[#181818]">Minha Lista</p>
      </div>

      <div
        onClick={handleProfileNavigate}
        className="flex items-center gap-1 cursor-pointer"
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
            <div className="flex gap-1">
              <CircleUserRound color="#181818" />
              <p className="font-medium text-[14px] text-[#181818]">
                Entre ou cadastre-se
              </p>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <AuthForm />
          </PopoverContent>
        </Popover>
      )}
      <MessageCircleMore />
    </div>
  );
}
