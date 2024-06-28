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
    <div className="bg-[#22262F] mx-auto grid w-full gap-6">
      <div className="grid gap-4">
        <div className="grid gap-2 text-white">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#1C212B] w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center  text-white">
            <Label htmlFor="password">Senha </Label>
          </div>
          <Input
            id="password"
            placeholder="*********"
            type="password"
            className="bg-[#1C212B] w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-[#5C45FD]"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button onClick={handleLogin} type="submit" className="w-full">
          Login
        </Button>
      </div>
      <hr />
      <div className="text-center text-sm text-white">
        Ainda não possui uma conta?{" "}
        <Link href="/signup" className="underline text-[#5C45FD] font-medium">
          Cadastrar
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
