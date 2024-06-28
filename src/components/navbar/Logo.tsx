'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import LogoImage from "@/app/assets/logo.png";

const Logo = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/");
  }

  return ( 
    <Image onClick={handleNavigate} alt="logo" src={LogoImage} width={202} height={40} className="hidden md:block cursor-pointer" />
   );
}
 
export default Logo;
