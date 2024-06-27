import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Cookie from "js-cookie";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://api-mangazone.onrender.com/api/user/login",
        { email, password }
      );
      const { token, user } = response.data;

      // Armazenar token e usuário como strings JSON no localStorage
      if (typeof window !== "undefined") {
        Cookie.set("token", JSON.stringify(token));
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success("Usuário logado com sucesso!");
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      console.error("Erro ao realizar login:", error);
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="mx-auto grid w-full gap-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha </Label>
          </div>
          <Input
            id="password"
            placeholder="*********"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button onClick={handleLogin} type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Ainda não possui uma conta?{" "}
        <Link href="/signup" className="underline text-[#5C45FD]">
          Cadastrar
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
