'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return ( 
    <h1 className="hidden md:block text-white">MangaZone</h1>
   );
}
 
export default Logo;
