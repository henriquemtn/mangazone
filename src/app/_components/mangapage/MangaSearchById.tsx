"use client";

import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Characters, User } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Volume {
  _id: string;
  number: number;
  date: string;
  chapters: string;
  image: string;
  volumeName: string;
  price?: number;
  linkAmazon?: string;
}

interface Manga {
  _id: string;
  imageUrl: string;
  title: string;
  alternativeTitles: string;
  author: string;
  synopsis: string;
  genres: string[];
  publisherBy: string;
  score: number;
  releaseDate: string;
  characters: Characters[];
  volumes: Volume[];
}

interface CP {
  mangaUrl: string;
}

export default function MangaSearchById({ mangaUrl }: CP) {
  const [manga, setManga] = useState<Manga | null>(null);
  const [inCollection, setInCollection] = useState(false);
  let token = Cookies.get("token");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await fetch(mangaUrl);
        if (!response.ok) {
          throw new Error("Erro ao buscar o manga");
        }
        const data = await response.json();
        setManga(data);
        if (user) {
          checkInCollection(data._id);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("Erro desconhecido", error);
        }
      }
    };

    fetchManga();
  }, [mangaUrl, user]);

  const handleAddToCollection = async () => {
    console.log(token);

    if (token) {
      token = JSON.parse(token);
    } else {
      throw new Error("Token de autenticação ausente, acesso negado");
    }

    try {
      const response = await axios.post(
        "https://api-mangazone.onrender.com/api/user/addMangaToCollection",
        { mangaId: manga?._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.message);
      toast.success("Mangá adicionado a sua Coleção");
      if (user && manga?._id) {
        checkInCollection(manga._id);
      }
    } catch (error: any) {
      console.error("Erro ao adicionar mangá à coleção:", error.message);
      toast.error("Erro ao adicionar mangá à coleção!");
    }
  };

  const handleLink = (volumeLink: string | undefined) => {
    if (volumeLink) {
      router.push(volumeLink);
    } else {
      router.push('#');
    }
  };

  const checkInCollection = async (mangaId: string) => {
    try {
      const response = await axios.get<boolean>(
        `https://api-mangazone.onrender.com/api/user/${user?.username}/checkMangaInCollection/${mangaId}`
      );

      setInCollection(response.data);
    } catch (error: any) {
      console.error("Erro ao verificar se o mangá está na coleção:", error.message);
    }
  };

  if (!manga) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="w-full mt-40">
      <section className="bg-[#22262F] dark:bg-gray-950 py-12 md:py-16 lg:py-20">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="flex flex-row gap-8 justify-between items-center">
            <div className="flex-col flex w-3/4">
              <h1 className="text-3xl text-white md:text-4xl lg:text-5xl font-bold mb-4">
                {manga.title}
              </h1>
              <p className="text-gray-300 dark:text-gray-400 text-lg md:text-xl mb-6">
                By {manga.author}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {manga.genres.map((genre, index) => (
                  <Badge
                    key={index}
                    className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-sm"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-300 dark:text-gray-300 leading-relaxed mb-6">
                {manga.synopsis}
              </p>
            </div>
            <div className="w-1/4 flex justify-center items-center md:block">
              <Image
                src={manga.imageUrl || "/placeholder.svg"}
                alt={manga.title}
                width={250}
                height={350}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {!inCollection && (
              <Button onClick={handleAddToCollection}>
                Adicionar a Coleção
              </Button>
            )}
            {inCollection && (
              <Button className="gap-2 text-white" variant="secondary" disabled>
                Adicionado a coleção
                <CheckCircle color="white" size={14} />
              </Button>
            )}
          </div>
        </div>
      </section>
      <hr />
      <section className="bg-[#22262F] py-12 md:py-16 lg:py-20">
        <div className="container flex max-w-6xl px-4 mx-auto">
          <div className="w-2/3 container max-w-6xl px-4 mx-auto">
            <h2 className="text-white text-2xl md:text-3xl lg:text-3xl font-medium mb-8">
              Volumes adicionados: {manga.volumes.length}
            </h2>
            <div className="w-full text-white">
              <Table>
                <TableCaption>
                  A list of volumes for {manga.title}.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Volume</TableHead>
                    <TableHead>Capa</TableHead>
                    <TableHead>Titulo</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Comprar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manga.volumes
                    .sort((a, b) => a.number - b.number)
                    .map((volume) => (
                      <TableRow key={volume._id}>
                        <TableCell className="font-medium">
                          {volume.number}
                        </TableCell>
                        <TableCell>
                          <Image
                            src={volume.image || "/placeholder.svg"}
                            alt={`Volume ${volume.number} Cover`}
                            width={100}
                            height={150}
                          />
                        </TableCell>
                        <TableCell>
                          {manga.title} Vol. {volume.number}
                        </TableCell>
                        <TableCell>R$ {volume.price}</TableCell>
                        <TableCell>
                          <Button
                          onClick={() => handleLink(volume.linkAmazon)}
                            variant="secondary"
                            className="items-center gap-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="16"
                              height="16"
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
                            Comprar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="w-1/3">
            <div className="flex w-full items-center justify-between">
              <h1 className="text-white">Total de Personagens: {manga.characters.length}</h1>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {manga.characters.map((character) => (
                <div
                  key={character._id}
                  className="items-center flex  flex-col border rounded-lg my-4"
                >
                  <Image
                    src={
                      character.photoUrl?.startsWith("http")
                        ? character.photoUrl
                        : "https://i.pinimg.com/564x/09/21/fc/0921fc87aa989330b8d403014bf4f340.jpg"
                    }
                    alt={character.name}
                    className="w-[150px] h-[150px] rounded-t-lg mb-4 object-cover"
                    width={150}
                    height={150}
                  />
                  <h3 className="text-base text-center font-medium mb-2">
                    {character.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
