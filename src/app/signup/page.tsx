"use client";

import toast from "react-hot-toast";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LoginBG from "@/app/assets/loginbg.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignUp() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        "https://api-mangazone.onrender.com/api/user/register",
        { displayName, username, email, password }
      );
      const { token, user } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success("Usuário logado com sucesso!");
      router.push("/");
    } catch (error: any) {
      console.error("Erro ao realizar login:", error);
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-[#22262F]">
      <div className="flex items-center justify-center py-12 h-screen">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-white">Registrar-se</h1>
            <p className="text-balance text-muted-foreground">
              Crie uma conta e comece a sua coleção!
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label className="text-white" htmlFor="name">
                Nome
              </Label>
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
              <Label className="text-white" htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="seunome"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-white" htmlFor="email">Email</Label>
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
                <Label className="text-white" htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleSignUp} type="submit" className="w-full">
              Criar conta
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-white">
            Já possui uma conta?{" "}
            <Link href="/" className="underline">
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
