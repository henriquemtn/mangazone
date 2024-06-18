import React from "react";

export default function Container() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-around w-full md:w-[1400px] p-4 bg-white shadow sm rounded-xl">
        <p className="hidden md:block font-bold text-[#4C3BC2]">Lançamento <span className="font-normal text-black">Bem-Vindo(a)</span></p>
        <p className="hidden md:block font-bold text-[#4C3BC2]">CUPOM 30BOOK <span className="font-normal text-black">ofertas disponíveis</span></p>
        <p className="font-bold text-[#4C3BC2]">Promoções <span className="font-normal text-black">atualizadas 24h</span></p>
      </div>
    </div>
  );
}
