import Carousel from "@/components/carrousel/Carousel";
import Container from "@/components/container/Container";
import OfertasDoDia from "@/components/mangas/ofertasdodia/Ofertas";
import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-4 mt-[175px] bg-[#F7F7F7]">
      <Navbar />
      <Carousel />
      <Container />
      <OfertasDoDia />
    </div>
  );
}
