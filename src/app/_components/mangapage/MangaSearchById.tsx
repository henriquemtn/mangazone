"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Image from "next/image";


interface Volume {
  _id: string;
  volumeNumber: number;
  releaseDate: string;
  chapters: string[];
  imageUrl: string;
  volumeName: string;
  price?: number;
  link?: string;
}

interface Manga {
  _id: string;
  imageUrl: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  volumes: Volume[];
}

interface CP {
  mangaUrl: string;
}

export default function MangaSearchById({ mangaUrl }: CP) {
  const [manga, setManga] = useState<Manga | null>(null);
  const router = useRouter();
  const [user, setUser] = useState<User| null>(null);
  const [isLoading, setIsLoading] = useState(true);


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


  const handleAddToCollection = async () => {
    try {
      const userId = "userId"; // Aqui você deve substituir pelo userId do usuário logado
      const response = await fetch(`https://apimangazone.onrender.com/api/users/${user?.uid}/mangasCollections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mangaId: manga?._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar o manga à coleção");
      }

      // O manga foi adicionado com sucesso à coleção
      toast.success(`${manga?.title} foi adicionado à sua coleção`);
    } catch (error) {
      console.error("Erro ao adicionar o manga à coleção:", error);
      toast.error("Erro ao adicionar o manga à coleção. Por favor, tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await fetch(mangaUrl);
        if (!response.ok) {
          throw new Error("Erro ao buscar o manga");
        }
        const data = await response.json();
        setManga(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("Erro desconhecido", error);
        }
      }
    };

    fetchManga();
  }, [mangaUrl]);

  if (!manga) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className="w-full mt-36">
      <section className="bg-gray-100 dark:bg-gray-950 py-12 md:py-16 lg:py-20">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {manga.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl mb-6">
                By {manga.author}
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Explore the captivating world of {manga.title}. Dive into the
                adventures crafted by {manga.author}.
              </p>
              <Button onClick={handleAddToCollection} className="">Adicionar a Minha Coleção</Button>
            </div>
            <div className="hidden md:block">
              <Image
                src={manga.imageUrl || "/placeholder.svg"}
                alt={manga.title}
                width={200}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container max-w-6xl px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
            Available Volumes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {manga.volumes.map((volume) => (
              <Link
                key={volume._id}
                href={volume.link || "#"}
                className="group"
                prefetch={false}
              >
                <div className="bg-white dark:bg-gray-950 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl">
                  <img
                    src={volume.imageUrl || "/placeholder.svg"}
                    alt={`Volume ${volume.volumeNumber} Cover`}
                    width={300}
                    height={450}
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">
                      {volume.volumeName}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Volume {volume.volumeNumber}
                    </p>
                    <p className="text-[#6B57F1] dark:text-gray-400 mb-4">
                      R$ {volume.price}
                    </p>
                    <div className="flex flex-row gap-1">
                      <Button
                        onClick={() => router.push(volume.link || "#")}
                        className="flex gap-1 items-center"
                        variant="outline"
                        size="sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="16"
                          height="16   "
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#FFB300"
                            d="M39.6,39c-4.2,3.1-10.5,5-15.6,5c-7.3,0-13.8-2.9-18.8-7.4c-0.4-0.4,0-0.8,0.4-0.6c5.4,3.1,11.5,4.9,18.3,4.9c4.6,0,10.4-1,15.1-3C39.7,37.7,40.3,38.5,39.6,39z M41.1,36.9c-0.5-0.7-3.5-0.3-4.8-0.2c-0.4,0-0.5-0.3-0.1-0.6c2.3-1.7,6.2-1.2,6.6-0.6c0.4,0.6-0.1,4.5-2.3,6.3c-0.3,0.3-0.7,0.1-0.5-0.2C40.5,40.4,41.6,37.6,41.1,36.9z"
                          ></path>
                          <path
                            fill="#37474F"
                            d="M36.9,29.8c-1-1.3-2-2.4-2-4.9v-8.3c0-3.5,0-6.6-2.5-9c-2-1.9-5.3-2.6-7.9-2.6C19,5,14.2,7.2,13,13.4c-0.1,0.7,0.4,1,0.8,1.1l5.1,0.6c0.5,0,0.8-0.5,0.9-1c0.4-2.1,2.1-3.1,4.1-3.1c1.1,0,3.2,0.6,3.2,3v3c-3.2,0-6.6,0-9.4,1.2c-3.3,1.4-5.6,4.3-5.6,8.6c0,5.5,3.4,8.2,7.8,8.2c3.7,0,5.9-0.9,8.8-3.8c0.9,1.4,1.3,2.2,3,3.7c0.4,0.2,0.9,0.2,1.2-0.1l0,0c1-0.9,2.9-2.6,4-3.5C37.4,30.9,37.3,30.3,36.9,29.8z M27,22.1L27,22.1c0,2-0.1,6.9-5,6.9c-3,0-3-3-3-3c0-4.5,4.2-5,8-5V22.1z"
                          ></path>
                        </svg>
                        <p>Comprar na amazon</p>
                      </Button>
                      <Button size="sm">
                        <PlusCircleIcon />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
