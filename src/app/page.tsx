import Carousel from "@/components/carrousel/Carousel";
import Container from "@/components/container/Container";
import Footer from "@/components/footer/Footer";
import OfertasDoDia from "@/components/mangas/ofertasdodia/Ofertas";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-4 mt-[175px] bg-[#22262F]">
      <Navbar />
      <Carousel />
      <Container />
      <OfertasDoDia />
      <Footer />
    </div>
  );
}
