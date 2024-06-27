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
import { Artist, User } from "@/types/types";
import axios from "axios";
import { Heart, HeartOff, PlusCircleIcon } from "lucide-react"; // Importa HeartFilled
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export function AddPeoples() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [favoriteArtists, setFavoriteArtists] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    fetchArtists();
    fetchFavoriteArtists();
  }, []);

  // Function to fetch artists
  const fetchArtists = async () => {
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
        "https://api-mangazone.onrender.com/api/artists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setArtists(response.data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  // Function to fetch favorite artists of the user
  const fetchFavoriteArtists = async () => {
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
      const people = response.data.people.filter(
        (person: string) => person !== ""
      );
      setFavoriteArtists(people);
    } catch (error) {
      console.error("Error fetching favorite artists:", error);
    }
  };

  // Function to add artist to favorites
  const addArtistToFavorites = async (artistId: string) => {
    try {
      const tokenFromCookie = Cookies.get("token");
      if (!tokenFromCookie) {
        console.error("Token de autenticação ausente, acesso negado");
        return;
      }

      const cleanedToken = tokenFromCookie.replace(/"/g, ""); // Remove as aspas do token
      await axios.put(
        "http://localhost:3000/api/user/addPeoples",
        {
          artistId,
        },
        {
          headers: {
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );
      console.log("Artista adicionado aos favoritos com sucesso!");
      toast.success("Artista adicionado aos favoritos com sucesso!");
      fetchFavoriteArtists(); // Atualiza a lista de artistas favoritos após adicionar
    } catch (error) {
      console.error("Erro ao adicionar artista aos favoritos:", error);
      toast.error("Erro ao adicionar o artista!");
    }
  };

  const removeArtistToFavorites = async (artistId: string) => {
    try {
      const tokenFromCookie = Cookies.get("token");
      if (!tokenFromCookie) {
        console.error("Token de autenticação ausente, acesso negado");
        return;
      }

      const cleanedToken = tokenFromCookie.replace(/"/g, ""); // Remove as aspas do token
      await axios.put(
        "http://localhost:3000/api/user/removePeoples",
        {
          artistId,
        },
        {
          headers: {
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );
      console.log("Artista removido dos favoritos com sucesso!");
      toast.success("Artista removido do favoritos com sucesso!");
      fetchFavoriteArtists(); // Atualiza a lista de artistas favoritos após adicionar
    } catch (error) {
      console.error("Erro ao adicionar artista aos favoritos:", error);
      toast.error("Erro ao adicionar o artista!");
    }
  };

  // Function to handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter artists based on search term
  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <SheetTitle>Adicionar Artistas Favoritos</SheetTitle>
          <SheetDescription>
            Adicione em seu perfil Autores, Dubladores e Artistas.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Input
            className="bg-[#1C212B]"
            placeholder="Pesquise artistas, dubladores..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="grid gap-4 mt-4">
            {filteredArtists.map((artist) => (
              <div
                key={artist._id}
                className="flex items-center justify-between px-4 bg-[#2D333B] rounded-lg p-2"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={artist.photoUrl}
                    width={64}
                    height={64}
                    alt={`Foto de ${artist.name}`}
                    className="w-16 h-16 rounded-full"
                  />
                  <h3 className="text-base font-bold">{artist.name}</h3>
                </div>
                {favoriteArtists.includes(artist._id) ? (
                  <Button
                    variant="nothing"
                    onClick={() => removeArtistToFavorites(artist._id)}
                  >
                    <HeartOff color="#6B57F1" size={16} />
                  </Button>
                ) : (
                  <Button
                    variant="nothing"
                    onClick={() => addArtistToFavorites(artist._id)}
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

export default AddPeoples;
