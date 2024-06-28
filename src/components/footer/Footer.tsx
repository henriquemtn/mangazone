import Link from "next/link";
import Logo from "../navbar/Logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1C212B] text-white py-12 md:py-16 lg:py-20 w-full border-t-[1px]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-0 md:flex-row md:space-x-6">
          <div className="flex items-center space-x-4">
            <Logo />
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              href="#"
              className="hover:text-gray-200 text-base"
              prefetch={false}
            >
              Melhores Ofertas
            </Link>
            <Link
              href="#"
              className="hover:text-gray-200 text-base"
              prefetch={false}
            >
              Meu Perfil
            </Link>
            <Link
              href="#"
              className="hover:text-gray-200 text-base"
              prefetch={false}
            >
              Mangás
            </Link>
            <Link
              href="#"
              className="hover:text-gray-200 text-base"
              prefetch={false}
            >
              Suporte
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4 mt-6 md:mt-0">
          <p className="text-base">
            &copy; 2024: <span className="font-medium">MangaZone</span> -
            Desenvolvido por{" "}
            <span className="font-medium">Henrique Silveira</span>
          </p>
          <div className="flex items-center space-x-4">
            <Link href="https://www.linkedin.com/in/henriquemtn/" className="hover:text-gray-200" prefetch={false}>
              <LinkedinIcon className="h-6 w-6" />
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              <TwitterIcon className="h-6 w-6" />
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              <InstagramIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
