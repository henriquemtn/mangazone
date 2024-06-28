"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Manga, User, Volume } from "@/types/types";
import { Skeleton } from "../ui/skeleton";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";

interface Props {
  mangaId: string;
  volumesLength: number;
  username: string;
  isAuthenticatedUser: boolean;
}

const DialogContentMangas: React.FC<Props> = ({
  mangaId,
  volumesLength,
  username,
  isAuthenticatedUser,
}) => {
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingVolumes, setLoadingVolumes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [dataUsername, setDataUsername] = useState<string | null>(null);
  const [userFromPage, setUserFromPage] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await axios.get(
          `https://api-mangazone.onrender.com/api/mangas/${mangaId}`
        );
        setManga(response.data);
        setLoading(false);
        setLoadingVolumes(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
        setLoadingVolumes(false);
      }
    };

    fetchManga();
  }, [mangaId]);

  useEffect(() => {
    console.log("o user é o da pagina", isAuthenticatedUser);
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://api-mangazone.onrender.com/api/user/${username}`
        );
        setUserFromPage(response.data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchUser();
  }, [username]);

  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");
    if (tokenFromCookie) {
      const cleanedToken = tokenFromCookie.replace(/"/g, "");
      setToken(cleanedToken);
    }
  }, [dataUsername]);

  const handleLink = (volumeLink: string | undefined) => {
    if (volumeLink) {
      router.push(volumeLink);
    } else {
      router.push("#");
    }
  };

  const addVolumeToManga = async (volumeId: string) => {
    if (!token) {
      toast.error("Você precisa estar logado para adicionar volumes.");
      return;
    }

    try {
      await axios.put(
        "https://api-mangazone.onrender.com/api/user/addVolumeToManga",
        {
          mangaId,
          volumeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Volume adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar volume:", error);
      toast.error("Erro ao adicionar volume!");
    }
  };

  const removeVolumeToManga = async (mangaId: string, volumeId: string) => {
    const tokenFromCookie = Cookies.get("token");
    if (tokenFromCookie) {
      const cleanedToken = tokenFromCookie.replace(/"/g, "");
      setToken(cleanedToken);
    }

    if (!token) {
      toast.error("Você precisa estar logado para remover volumes.");
      return;
    }

    try {
      await axios.put(
        "https://api-mangazone.onrender.com/api/user/removeVolumeFromManga",
        {
          mangaId,
          volumeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Volume removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover volume:", error);
      toast.error("Erro ao remover volume!");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="w-[160px] h-[260px] rounded-md" />
          <Skeleton className="w-[160px] h-[14px] rounded-md" />
          <Skeleton className="w-[160px] h-[12px] rounded-md" />
        </div>
      </div>
    );
  }

  if (error) return <div>Error fetching manga: {error}</div>;

  return (
    <div>
      {manga ? (
        <DialogContent className="bg-[#22262F]">
          <DialogHeader>
            <DialogTitle className="text-white">{manga.title}</DialogTitle>
            <hr />
            <DialogDescription>
              <div className="flex justify-between gap-1">
                <div className="w-1/2">
                  <p>{manga.synopsis}</p>
                </div>
                <div className="w-1/2 flex items-start text-white justify-end">
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-xl">
                      Coleção:{" "}
                      <span className="font-bold text-yellow-500 text-2xl">
                        {volumesLength}
                      </span>
                      /
                      <span className="font-bold text-xl">
                        {manga.volumes.length}
                      </span>
                    </p>
                    <Badge
                      className="text-green-500  border-green-500"
                      variant="outline"
                    >
                      Completa
                    </Badge>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-7 gap-4">
            {loadingVolumes
              ? Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <Skeleton className="w-[125px] h-[175px] rounded-md" />
                    <Skeleton className="w-[125px] h-[14px] rounded-md" />
                    <Skeleton className="w-[125px] h-[12px] rounded-md" />
                  </div>
                ))
              : manga.volumes.map((volume: Volume) => (
                  <div
                    key={volume._id}
                    className="hover:scale-105 flex h-auto rounded items-center gap-1 justify-between flex-col transition-all cursor-pointer"
                  >
                    <Image
                      src={volume.image || "/placeholder.svg"}
                      alt={`Volume ${volume.number} Cover`}
                      width={125}
                      onClick={() => handleLink(volume.linkAmazon)}
                      height={175}
                    />
                    <h1 className="text-white text-[16px]">
                      Volume{" "}
                      <span className="text-yellow-500 font-bold">
                        #{volume.number}
                      </span>
                    </h1>
                    {userFromPage &&
                    userFromPage.mangaCollection &&
                    userFromPage.mangaCollection.some((item) =>
                      item.volumes.includes(volume._id.toString())
                    ) ? (
                      <div className="gap-1 flex-col flex items-center">
                        <Badge
                          className="text-green-500  border-green-500"
                          variant="outline"
                        >
                          Adquirido
                        </Badge>
                        <div className="flex flex-col gap-1">
                          <Button
                            className="text-white w-full text-[12px] items-center gap-1 bg-[#1C212B] border-white"
                            variant="outline"
                            onClick={() => addVolumeToManga(volume._id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="16"
                              height="16"
                              viewBox="0,0,250,250"
                              style={{ fill: "#FFFFFF" }}
                            >
                              <g
                                fill="#ffffff"
                                fill-rule="nonzero"
                                stroke="none"
                                strokeWidth="1"
                                strokeLinecap="butt"
                                strokeLinejoin="miter"
                                strokeMiterlimit="10"
                                strokeDasharray=""
                                strokeDashoffset="0"
                                fontFamily="none"
                                fontWeight="none"
                                fontSize="none"
                                textAnchor="none"
                                style={{ mixBlendMode: "normal" }}
                              >
                                <g transform="scale(5.12,5.12)">
                                  <path d="M25.3125,3c-6.10156,0 -12.82031,2.3125 -14.21875,9.8125c-0.19922,0.80078 0.40625,1.17969 0.90625,1.28125l6.1875,0.59375c0.60156,0 1.01953,-0.58594 1.21875,-1.1875c0.5,-2.60156 2.69531,-3.90625 5.09375,-3.90625c1.30078,0 2.79297,0.51953 3.59375,1.71875c0.89844,1.30078 0.71875,3.09375 0.71875,4.59375v0.90625c-3.69922,0.39844 -8.5,0.6875 -12,2.1875c-4,1.69922 -6.8125,5.20703 -6.8125,10.40625c0,6.60156 4.19922,9.90625 9.5,9.90625c4.5,0 7,-1.11719 10.5,-4.71875c1.19922,1.69922 1.58594,2.51172 3.6875,4.3125c0.5,0.30078 1.10156,0.17969 1.5,-0.21875v0.125c1.30078,-1.10156 3.60547,-3.21094 4.90625,-4.3125c0.5,-0.30078 0.39844,-1 0,-1.5c-1.19922,-1.60156 -2.40625,-2.90625 -2.40625,-5.90625v-9.90625c0,-4.19922 0.32031,-8.10156 -2.78125,-11c-2.5,-2.39844 -6.49219,-3.1875 -9.59375,-3.1875zM27,22h1.6875v1.40625c0,2.39844 0.10547,4.48828 -1.09375,6.6875c-1,1.80078 -2.60547,2.90625 -4.40625,2.90625c-2.39844,0 -3.875,-1.79297 -3.875,-4.59375c0,-4.69922 3.6875,-6.10547 7.6875,-6.40625zM44.59375,36.59375c-1.60156,0 -3.50781,0.40625 -4.90625,1.40625c-0.39844,0.30078 -0.375,0.6875 0.125,0.6875c1.60156,-0.19922 5.17578,-0.67969 5.875,0.21875c0.60156,0.80078 -0.67969,4.17969 -1.28125,5.78125c-0.19922,0.5 0.19531,0.61328 0.59375,0.3125c2.69922,-2.30078 3.40625,-6.99219 2.90625,-7.59375c-0.30078,-0.5 -1.71094,-0.8125 -3.3125,-0.8125zM2.1875,37.5c-0.30078,0 -0.49219,0.51172 -0.09375,0.8125c6,5.39844 13.91406,8.6875 22.8125,8.6875c6.30078,0 13.58594,-1.98828 18.6875,-5.6875c0.80078,-0.60156 0.11328,-1.61719 -0.6875,-1.21875c-5.69922,2.39844 -11.80469,3.59375 -17.40625,3.59375c-8.30078,0 -16.3125,-2.30078 -22.8125,-6c-0.19922,-0.19922 -0.39844,-0.1875 -0.5,-0.1875z"></path>
                                </g>
                              </g>
                            </svg>
                            Comprar
                          </Button>
                          {isAuthenticatedUser ? (
                            <Button
                              className="text-white w-full text-[12px] items-center gap-1 bg-[#1C212B] border-white"
                              variant="outline"
                              onClick={() =>
                                removeVolumeToManga(mangaId, volume._id)
                              }
                            >
                              <Trash2Icon size={16} />
                              Remover
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div className="gap-1 flex-col flex items-center">
                        <Badge
                          className="text-red-500 border-red-500"
                          variant="outline"
                        >
                          Não Adquirido
                        </Badge>
                        <div className="flex flex-col gap-1">
                          <Button
                            className="text-white w-full text-[12px] items-center gap-1 bg-[#1C212B] border-white"
                            variant="outline"
                            onClick={() => addVolumeToManga(volume._id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="16"
                              height="16"
                              viewBox="0,0,250,250"
                              style={{ fill: "#FFFFFF" }}
                            >
                              <g
                                fill="#ffffff"
                                fill-rule="nonzero"
                                stroke="none"
                                strokeWidth="1"
                                strokeLinecap="butt"
                                strokeLinejoin="miter"
                                strokeMiterlimit="10"
                                strokeDasharray=""
                                strokeDashoffset="0"
                                fontFamily="none"
                                fontWeight="none"
                                fontSize="none"
                                textAnchor="none"
                                style={{ mixBlendMode: "normal" }}
                              >
                                <g transform="scale(5.12,5.12)">
                                  <path d="M25.3125,3c-6.10156,0 -12.82031,2.3125 -14.21875,9.8125c-0.19922,0.80078 0.40625,1.17969 0.90625,1.28125l6.1875,0.59375c0.60156,0 1.01953,-0.58594 1.21875,-1.1875c0.5,-2.60156 2.69531,-3.90625 5.09375,-3.90625c1.30078,0 2.79297,0.51953 3.59375,1.71875c0.89844,1.30078 0.71875,3.09375 0.71875,4.59375v0.90625c-3.69922,0.39844 -8.5,0.6875 -12,2.1875c-4,1.69922 -6.8125,5.20703 -6.8125,10.40625c0,6.60156 4.19922,9.90625 9.5,9.90625c4.5,0 7,-1.11719 10.5,-4.71875c1.19922,1.69922 1.58594,2.51172 3.6875,4.3125c0.5,0.30078 1.10156,0.17969 1.5,-0.21875v0.125c1.30078,-1.10156 3.60547,-3.21094 4.90625,-4.3125c0.5,-0.30078 0.39844,-1 0,-1.5c-1.19922,-1.60156 -2.40625,-2.90625 -2.40625,-5.90625v-9.90625c0,-4.19922 0.32031,-8.10156 -2.78125,-11c-2.5,-2.39844 -6.49219,-3.1875 -9.59375,-3.1875zM27,22h1.6875v1.40625c0,2.39844 0.10547,4.48828 -1.09375,6.6875c-1,1.80078 -2.60547,2.90625 -4.40625,2.90625c-2.39844,0 -3.875,-1.79297 -3.875,-4.59375c0,-4.69922 3.6875,-6.10547 7.6875,-6.40625zM44.59375,36.59375c-1.60156,0 -3.50781,0.40625 -4.90625,1.40625c-0.39844,0.30078 -0.375,0.6875 0.125,0.6875c1.60156,-0.19922 5.17578,-0.67969 5.875,0.21875c0.60156,0.80078 -0.67969,4.17969 -1.28125,5.78125c-0.19922,0.5 0.19531,0.61328 0.59375,0.3125c2.69922,-2.30078 3.40625,-6.99219 2.90625,-7.59375c-0.30078,-0.5 -1.71094,-0.8125 -3.3125,-0.8125zM2.1875,37.5c-0.30078,0 -0.49219,0.51172 -0.09375,0.8125c6,5.39844 13.91406,8.6875 22.8125,8.6875c6.30078,0 13.58594,-1.98828 18.6875,-5.6875c0.80078,-0.60156 0.11328,-1.61719 -0.6875,-1.21875c-5.69922,2.39844 -11.80469,3.59375 -17.40625,3.59375c-8.30078,0 -16.3125,-2.30078 -22.8125,-6c-0.19922,-0.19922 -0.39844,-0.1875 -0.5,-0.1875z"></path>
                                </g>
                              </g>
                            </svg>
                            Comprar
                          </Button>
                          {isAuthenticatedUser ? (
                            <Button
                              className="text-white w-full text-[12px] items-center gap-1 bg-[#1C212B] border-white"
                              variant="outline"
                              onClick={() => addVolumeToManga(volume._id)}
                            >
                              <PlusCircleIcon size={16} />
                              Adicionar
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </DialogContent>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default DialogContentMangas;
