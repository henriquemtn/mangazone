"use client";

// Importe os métodos necessários do Firestore
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig"; // Importe o objeto de autenticação
import toast from "react-hot-toast";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LoginBG from "@/app/assets/loginbg.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";

export function SignUp() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Estado para armazenar o nome de usuário

  const handleSignUp = async () => {
    try {
      // Criar usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Salvar informações adicionais no Firestore
      await saveUserInfo(userCredential.user, username);

      // Limpar campos de entrada
      setEmail("");
      setPassword("");
      setUsername("");

      // Salvar usuário na sessionStorage e redirecionar para o dashboard
      sessionStorage.setItem("user", JSON.stringify(userCredential.user));
      router.push("/");
      toast.success("Usuário criado com sucesso, Bem Vindo!");
    } catch (error) {
      toast.error("Erro ao criar sua conta");
    }
  };

  const saveUserInfo = async (user: User | null, username: string) => {
    try {
      if (user) {
        const db = getFirestore(); // Inicializar o Firestore
        const userRef = doc(db, "users", user.uid); // Utilizar o userId como ID do documento

        // Dados a serem salvos
        const userData = {
          uid: user.uid,
          username: username,
          displayName: displayName,
          photoURL: "default",
          createdAt: new Date(), // Data de criação do usuário
        };

        // Salvar os dados no Firestore
        await setDoc(userRef, userData);
        console.log("Usuário registrado com sucesso no Firestore!");
      } else {
        toast.error("Nenhum usuário autenticado");
      }
    } catch (error) {
      console.error(
        "Erro ao salvar informações do usuário no Firestore:",
        error
      );
    }
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 h-screen">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Registrar-se</h1>
            <p className="text-balance text-muted-foreground">
              Crie uma conta e comece a sua coleção!
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Seu Nome"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Seu nome de usuário"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <Button onClick={handleSignUp} type="submit" className="w-full">
              Criar conta
            </Button>
            <Button variant="outline" className="w-full">
              Criar conta com o Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Já possui uma conta?{" "}
            <Link href="/signin" className="underline">
              Entrar
            </Link>
          </div>
        </div>
      </div>
      <div className="h-screen hidden bg-muted lg:block">
        <Image
          src={LoginBG}
          alt="Image"
          className="h-full w-full object-fit dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default SignUp;
