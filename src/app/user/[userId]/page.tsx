"use client";

import Navbar from "@/components/navbar/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditarPerfil } from "@/app/_components/profile/EditarPerfil";
import MangaCollection from "@/app/_components/profile/MangaCollection";
import Footer from "@/components/footer/Footer";

export default function UserPage({ params }: any) {
  const userId = params.userId;
  const [userData, setUserData] = useState<any>(null); // Estado para armazenar os dados do usuário
  const [isLoading, setIsLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null); // Estado para armazenar o usuário logado
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true); // Iniciar o indicador de carregamento

      try {
        const db = getFirestore(); // Inicializar o Firestore
        const userRef = doc(db, "users", userId); // Referência ao documento do usuário

        const docSnap = await getDoc(userRef); // Buscar o documento

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserData(userData); // Definir dados do usuário no estado
        } else {
          console.log("Documento não encontrado");
          setUserNotFound(true); // Indicar que o usuário não foi encontrado
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error);
      } finally {
        setIsLoading(false); // Finalizar o indicador de carregamento
      }
    };

    fetchUser();
  }, [userId]); // Executar useEffect quando `username` mudar

  useEffect(() => {
    const currentUserData = sessionStorage.getItem("user");
    if (currentUserData) {
      setCurrentUser(JSON.parse(currentUserData)); // Definir usuário logado no estado
    }
  }, []);

  useEffect(() => {
    if (userNotFound) {
      router.push("/404"); // Redirecionar para a página 404 se o usuário não for encontrado
    }
  }, [userNotFound]); // Redirecionar quando `userNotFound` mudar

  // Verificar se está carregando para exibir mensagem de carregamento
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mt-40 mx-auto px-4 py-12 md:px-6 lg:py-16">
          <h1 className="text-3xl text-center font-bold">Carregando...</h1>
        </div>
      </>
    );
  }

  // Verificar se o usuário logado é o mesmo que está sendo acessado na página do perfil
  const isCurrentUser = currentUser?.uid === userData?.uid;

  return (
    <>
      <Navbar />
      <div className="container mt-40 mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="flex flex-col items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-gray-100 dark:border-gray-800">
              <AvatarImage src={userData?.photoURL} />
              <AvatarFallback>
                {userData?.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{userData?.displayName}</h2>
              <p className="text-gray-500 dark:text-gray-400">
                @{userData?.username}
              </p>
            </div>
            {isCurrentUser && (
                <EditarPerfil 
                userId={currentUser?.uid}
                profileDisplayName={userData?.displayName}
                profileUsername={userData?.username}
                profilePhotoURL={userData?.photoURL}
                />
              )}
          </div>
          <div className="col-span-2 grid gap-6">
            <MangaCollection userId={userId} isCurrentUser={isCurrentUser} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
