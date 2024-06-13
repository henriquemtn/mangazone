"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCheckIcon, CheckIcon, PlusCircleIcon } from "lucide-react";
import toast from "react-hot-toast";

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

interface MangaCollectionProps {
  userId: string;
}

const MangaCollection: React.FC<MangaCollectionProps> = ({ userId }) => {
  const [mangaCollections, setMangaCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMangaId, setSelectedMangaId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    console.log("userId:", userId);
    fetchMangaCollections();
  }, [userId]);

  useEffect(() => {
    console.log("mangaCollections:", mangaCollections);
  }, [mangaCollections]);

  const fetchMangaCollections = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}/mangasCollections`
      );
      const collections = response.data;

      const promises = collections.map(async (collection: any) => {
        try {
          const mangaResponse = await axios.get(
            `http://localhost:3000/api/mangas/${collection.mangaId}`
          );
          const manga = mangaResponse.data;

          return {
            ...manga,
            collectionVolumes: collection.volumes,
          };
        } catch (error) {
          console.error(
            `Erro ao buscar manga com id ${collection.mangaId}:`,
            error
          );
          throw new Error(`Erro ao buscar manga com id ${collection.mangaId}`);
        }
      });

      const updatedMangas = await Promise.all(promises);
      setMangaCollections(updatedMangas);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error("Erro ao buscar as mangaCollections:", error);
      setError("O Usuário ainda não adicionou nenhum mangá à coleção.");
      setIsLoading(false);
    }
  };

  const handleMangaClick = (mangaId: string) => {
    setSelectedMangaId(mangaId);
    setIsDialogOpen(true);
  };

  const handleDeleteManga = async (mangaId: string) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/users/${userId}/mangasCollections/${mangaId}`
      );
      setMangaCollections((prevMangas) =>
        prevMangas.filter((manga) => manga._id !== mangaId)
      );
      setIsDialogOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
      } else {
        console.error("Error deleting manga:", error);
      }
    }
  };

  const handleAddVolume = async (mangaId: string, volumesToAdd: string[]) => {
    try {
      const mangaToUpdate = mangaCollections.find(
        (manga) => manga._id === mangaId
      );
      if (!mangaToUpdate) {
        throw new Error(`Mangá com ID ${mangaId} não encontrado na coleção.`);
      }

      const existingVolumes = new Set(mangaToUpdate.collectionVolumes);
      volumesToAdd.forEach((volumeId) => existingVolumes.add(volumeId));

      const updatedVolumes = Array.from(existingVolumes);

      await axios.put(
        `http://localhost:3000/api/users/${userId}/mangas/${mangaId}/volumes`,
        {
          volumes: updatedVolumes,
        }
      );

      const updatedMangaCollections = mangaCollections.map((manga) => {
        if (manga._id === mangaId) {
          return {
            ...manga,
            collectionVolumes: updatedVolumes,
          };
        }
        return manga;
      });

      setMangaCollections(updatedMangaCollections);
      toast.success("Volume adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar volumes:", error);
      toast.error("Erro ao adicionar volume");
    }
  };

  const handleRemoveVolume = async (mangaId: string, volumesToRemove: string[]) => {
    try {
      const mangaToUpdate = mangaCollections.find(
        (manga) => manga._id === mangaId
      );
      if (!mangaToUpdate) {
        throw new Error(`Mangá com ID ${mangaId} não encontrado na coleção.`);
      }

      const updatedVolumes = mangaToUpdate.collectionVolumes.filter(
        (volumeId: string) => !volumesToRemove.includes(volumeId)
      );

      await axios.delete(
        `http://localhost:3000/api/users/${userId}/mangas/${mangaId}/volumes`,
        {
          data: {
            volumes: volumesToRemove,
          },
        }
      );

      const updatedMangaCollections = mangaCollections.map((manga) => {
        if (manga._id === mangaId) {
          return {
            ...manga,
            collectionVolumes: updatedVolumes,
          };
        }
        return manga;
      });

      setMangaCollections(updatedMangaCollections);
      toast.success("Volume removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover volumes:", error);
      toast.error("Erro ao remover volume");
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {mangaCollections.length === 0 ? (
        <div>Nenhuma coleção encontrada.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mangaCollections.map((manga) => (
            <div key={manga._id} onClick={() => handleMangaClick(manga._id)}>
              <div className="flex h-auto w-[240px] rounded items-start border justify-between flex-col transition-all cursor-pointer">
                <img
                  src={manga.imageUrl || "/placeholder.svg"}
                  alt={`${manga.title} Cover`}
                  width={200}
                  height={350}
                  className="w-full h-[350px] object-cover"
                />
                <div className="p-1">
                  <h3 className="text-lg font-bold mb-2">{manga.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    Autor: {manga.author}
                  </p>
                </div>
                <div className="flex justify-between z-20 w-full rounded-t-md p-2">
                  <p className="font-medium">
                    Volumes: {manga.collectionVolumes.length}/
                    {manga.volumes.length}
                  </p>
                  {manga.collectionVolumes.length === manga.volumes.length ? (
                    <Badge variant="default">Completo</Badge>
                  ) : (
                    <Badge variant="default">Em andamento</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedMangaId && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            {mangaCollections.map((manga) => {
              if (manga._id !== selectedMangaId) return null;
              return (
                <div key={manga._id}>
                  <DialogHeader>
                    <DialogTitle>{manga.title}</DialogTitle>
                    <DialogDescription>
                      Esta ação não pode ser desfeita. Isso removerá
                      permanentemente o mangá da sua coleção.
                    </DialogDescription>
                    <hr />
                    <div className="flex gap-4 flex-wrap">
                      {manga.volumes.map((volume: Volume) => (
                        <div
                          key={volume._id}
                          className="flex flex-col items-center"
                        >
                          <img
                            src={volume.imageUrl}
                            alt={`Volume ${volume.volumeNumber} Cover`}
                            className="w-[150px]"
                          />
                          <div className="flex flex-row justify-between mt-1 w-full">
                            <Button variant="secondary" className="w-2/3">
                              Comprar
                            </Button>
                            {manga.collectionVolumes.includes(volume._id) ? (
                              <Button
                                variant="outline"
                                className="w-1/3"
                                onClick={() => handleRemoveVolume(manga._id, [volume._id])}
                              >
                                <CheckIcon color="#6B57F1" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="w-1/3"
                                onClick={() =>
                                  handleAddVolume(manga._id, [volume._id])
                                }
                              >
                                <PlusCircleIcon />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogHeader>
                  <div>
                    <Button
                      onClick={() => handleDeleteManga(manga._id)}
                      variant="secondary"
                      className="w-full"
                    >
                      Remover Mangá da coleção
                    </Button>
                  </div>
                </div>
              );
            })}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MangaCollection;
