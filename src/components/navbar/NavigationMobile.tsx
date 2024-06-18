"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";
import { auth } from "@/firebase/firebaseConfig";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";

export function NavigationMobile() {
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

  const handleProfileNavigate = () => {
    if (user) {
      router.push(`/user/${user.uid}`);
    } else {
      toast.error("Faça login para acessar.", {
        duration: 4000,
        position: "top-center",
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
    }
  };

  return (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="nothing">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="grid gap-4 py-4">
            <div className="w-full border-b-[1px] pb-2">
              <Link href="/">Início</Link>
            </div>
            <div className="w-full border-b-[1px] pb-2">
              <Link href="#" onClick={handleProfileNavigate}>
                Meu Perfil
              </Link>
            </div>
            <div className="w-full border-b-[1px] pb-2">
              <Link href="#">Melhores Ofertas</Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
