import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Manga, User } from "@/types/types";
import axios from "axios";
import { Heart, HeartOff, PlusCircleIcon } from "lucide-react"; // Importa HeartFilled
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export function AddFavorites() {
  const [manga, setManga] = useState<Manga[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [favoriteManga, setFavoriteManga] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    fetchManga();
    fetchFavoriteManga();
  }, []);

  // Function to fetch manga
  const fetchManga = async () => {
    try {
      const tokenFromCookie = Cookies.get("token");
      if (tokenFromCookie) {
        const cleanedToken = tokenFromCookie.replace(/"/g, ""); // Remove as aspas do token
        setToken(cleanedToken);
      } else {
        console.error("Token de autenticação ausente, acesso negado");
        return;
      }

      const response = await axios.get(
        "https://api-mangazone.onrender.com/api/mangas",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setManga(response.data);
    } catch (error) {
      console.error("Error fetching manga:", error);
    }
  };

  // Function to fetch favorite manga of the user
  const fetchFavoriteManga = async () => {
    try {
      const tokenFromCookie = Cookies.get("token");
      if (!tokenFromCookie) {
        console.error("Token de autenticação ausente, acesso negado");
        return;
      }

      const cleanedToken = tokenFromCookie.replace(/"/g, ""); // Remove as aspas do token
      const response = await axios.get(
        "https://api-mangazone.onrender.com/api/user/starwhenry",
        {
          headers: {
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );
      const favorites = response.data.favorites.filter(
        (favorites: string) => favorites !== ""
      );
      setFavoriteManga(favorites);
    } catch (error) {
      console.error("Error fetching favorite manga:", error);
    }
  };

  // Function to add manga to favorites
  const addMangaToFavorites = async (mangaId: string) => {
    try {
      const tokenFromCookie = Cookies.get("token");
      if (!tokenFromCookie) {
        console.error("Token de autenticação ausente, acesso negado");
        return;
      }

      const cleanedToken = tokenFromCookie.replace(/"/g, ""); // Remove as aspas do token
      await axios.put(
        "http://localhost:3000/api/user/addFavorites",
        {
          mangaId,
        },
        {
          headers: {
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );
      console.log("Manga adicionado aos favoritos com sucesso!");
      toast.success("Manga adicionado aos favoritos com sucesso!");
      fetchFavoriteManga(); // Atualiza a lista de Mangas favoritos após adicionar
    } catch (error) {
      console.error("Erro ao adicionar Manga aos favoritos:", error);
      toast.error("Erro ao adicionar o Manga!");
    }
  };

  const removeMangaToFavorites = async (mangaId: string) => {
    try {
      const tokenFromCookie = Cookies.get("token");
      if (!tokenFromCookie) {
        console.error("Token de autenticação ausente, acesso negado");
        return;
      }

      const cleanedToken = tokenFromCookie.replace(/"/g, ""); // Remove as aspas do token
      await axios.put(
        "http://localhost:3000/api/user/removeFavorites",
        {
          mangaId,
        },
        {
          headers: {
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );
      console.log("Manga removido dos favoritos com sucesso!");
      toast.success("Manga removido do favoritos com sucesso!");
      fetchFavoriteManga(); // Atualiza a lista de Mangas favoritos após adicionar
    } catch (error) {
      console.error("Erro ao adicionar Manga aos favoritos:", error);
      toast.error("Erro ao adicionar o Manga!");
    }
  };

  // Function to handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter manga based on search term
  const filteredManga = manga.filter((manga) =>
    manga.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="nothing">
          <PlusCircleIcon color="white" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicionar Mangas Favoritos</SheetTitle>
          <SheetDescription>
            Adicione em seu perfil Autores, Dubladores e Mangas.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Input
            className="bg-[#1C212B]"
            placeholder="Pesquise Mangas, dubladores..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="grid gap-4 mt-4">
            {filteredManga.map((manga) => (
              <div
                key={manga._id}
                className="flex items-center justify-between px-4 bg-[#2D333B] rounded-lg p-2"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={manga.imageUrl}
                    width={64}
                    height={64}
                    alt={`Foto de ${manga.title}`}
                    className="w-16 h-22 rounded-sm"
                  />
                  <h3 className="text-base font-bold">{manga.title}</h3>
                </div>
                {favoriteManga.includes(manga._id) ? (
                  <Button
                    variant="nothing"
                    onClick={() => removeMangaToFavorites(manga._id)}
                  >
                    <HeartOff color="#6B57F1" size={16} />
                  </Button>
                ) : (
                  <Button
                    variant="nothing"
                    onClick={() => addMangaToFavorites(manga._id)}
                  >
                    <Heart size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AddFavorites;
