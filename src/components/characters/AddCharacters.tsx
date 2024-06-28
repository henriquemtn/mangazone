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
import { Characters, User } from "@/types/types";
import axios from "axios";
import { Heart, HeartOff, PlusCircleIcon } from "lucide-react"; // Importa HeartFilled
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface CP {
  username: string;
}

export function AddCharacters({username}: CP) {
  const [characters, setCharacters] = useState<Characters[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [favoriteCharacters, setFavoriteCharacters] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    fetchCharacters();
    fetchFavoriteCharacters();
  }, []);

  // Function to fetch characters
  const fetchCharacters = async () => {
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
        "https://api-mangazone.onrender.com/api/characters",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCharacters(response.data);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  // Function to fetch favorite characters of the user
  const fetchFavoriteCharacters = async () => {
    try {
      const tokenFromCookie = Cookies.get("token");
      if (!tokenFromCookie) {
        console.error("Token de autenticação ausente, acesso negado");
        return;
      }

      const cleanedToken = tokenFromCookie.replace(/"/g, ""); // Remove as aspas do token
      const response = await axios.get(
        `https://api-mangazone.onrender.com/api/user/${username}`,
        {
          headers: {
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );

      // Assuming response.data is like { characters: ["id1", "id2", ...] }
      if (response.data && response.data.characters) {
        setFavoriteCharacters(response.data.characters);
      } else {
        console.error("Response data or characters array missing in response");
      }
    } catch (error) {
      console.error("Error fetching favorite characters:", error);
    }
  };

  // Function to add character to favorites
  const addCharacterToFavorites = async (characterId: string) => {
    try {
      const tokenFromCookie = Cookies.get("token");
      if (!tokenFromCookie) {
        console.error("Token de autenticação ausente, acesso negado");
        return;
      }

      const cleanedToken = tokenFromCookie.replace(/"/g, ""); // Remove as aspas do token
      await axios.put(
        "https://api-mangazone.onrender.com/api/user/addCharacter",
        {
          characterId,
        },
        {
          headers: {
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );
      console.log("Personagem adicionado aos favoritos com sucesso!");
      toast.success("Personagem adicionado aos favoritos com sucesso!");
      fetchFavoriteCharacters();
    } catch (error) {
      console.error("Erro ao adicionar Personagem aos favoritos:", error);
      toast.error("Erro ao adicionar o Personagem!");
    }
  };

  const removeCharacterFromFavorites = async (characterId: string) => {
    try {
      const tokenFromCookie = Cookies.get("token");
      if (!tokenFromCookie) {
        console.error("Token de autenticação ausente, acesso negado");
        return;
      }

      const cleanedToken = tokenFromCookie.replace(/"/g, ""); // Remove as aspas do token
      await axios.put(
        "https://api-mangazone.onrender.com/api/user/removeCharacter",
        {
          characterId,
        },
        {
          headers: {
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );
      console.log("Personagem removido dos favoritos com sucesso!");
      toast.success("Personagem removido do favoritos com sucesso!");
      fetchFavoriteCharacters(); // Atualiza a lista de Personagem favoritos após adicionar
    } catch (error) {
      console.error("Erro ao adicionar Personagem aos favoritos:", error);
      toast.error("Erro ao adicionar o Personagem!");
    }
  };

  // Function to handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter charcters based on search term
  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <SheetTitle>Adicionar Personagens Favoritos</SheetTitle>
          <SheetDescription>
            Adicione em seu perfil personagens favoritos.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Input
            className="bg-[#1C212B]"
            placeholder="Pesquise personagens..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="grid gap-4 mt-4">
            {filteredCharacters.map((character) => (
              <div
                key={character._id}
                className="flex items-center justify-between px-4 bg-[#2D333B] rounded-lg p-2"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={character.photoUrl}
                    width={64}
                    height={64}
                    alt={`Foto de ${character.name}`}
                    className="w-16 h-16 rounded-full"
                  />
                  <h3 className="text-base font-bold">{character.name}</h3>
                </div>
                {favoriteCharacters.includes(character._id) ? (
                  <Button
                    variant="nothing"
                    onClick={() => removeCharacterFromFavorites(character._id)}
                  >
                    <HeartOff color="#6B57F1" size={16} />
                  </Button>
                ) : (
                  <Button
                    variant="nothing"
                    onClick={() => addCharacterToFavorites(character._id)}
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

export default AddCharacters;
