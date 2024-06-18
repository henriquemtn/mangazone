'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return ( 
    <Image
      onClick={() => router.push('/')}
      className="md:block cursor-pointer hidden" 
      src="/images/logo.png" 
      height="30" 
      width="138" 
      alt="Logo" 
    />
   );
}
 
export default Logo;
