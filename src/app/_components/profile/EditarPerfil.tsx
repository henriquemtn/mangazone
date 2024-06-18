import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useState } from "react";
import toast from "react-hot-toast";

interface CP {
  userId: string;
  profileUsername: string;
  profileDisplayName: string;
  profilePhotoURL: string;
}

export function EditarPerfil({ userId, profileDisplayName, profilePhotoURL, profileUsername }: CP) {
  const [displayName, setDisplayName] = useState(profileDisplayName);
  const [username, setUsername] = useState(profileUsername);
  const [photoURL, setPhotoURL] = useState(profilePhotoURL);

  // Função para salvar as alterações no perfil
  const handleSaveChanges = async () => {
    try {
      const db = getFirestore(); // Inicializar o Firestore
      const userRef = doc(db, "users", userId); // Referência ao documento do usuário

      await setDoc(
        userRef,
        {
          displayName,
          username,
          photoURL,
        },
        { merge: true }
      );
      toast.success("Perfil atualizado com sucesso!");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Editar Perfil</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar Perfil</SheetTitle>
          <SheetDescription>
            Mude suas informações do perfil.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Display Name
            </Label>
            <Input
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photourl" className="text-right">
              Photo URL
            </Label>
            <Input
              id="photourl"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleSaveChanges}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
