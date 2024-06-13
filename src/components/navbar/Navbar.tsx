import React from "react";
import UserMenu from "./UserMenu";
import Logo from "./Logo";
import Search from "./Search";
import { Megaphone } from "lucide-react";

export default function Navbar() {
  return (
    <div className="fixed top-0 z-50 h-[175px] bg-white border-b-[1px] shadow-sm w-full">
      <div className="bg-[#4C3BC2] w-full h-[30px] flex items-center justify-center">
        <Megaphone color="white" className="mr-1" />
        <p className="text-white text-[13px]">
          O Site está no Ar! encontre seus Mangás nos melhores preços.
        </p>
      </div>
      <div className="w-full h-[100px] border-b-[1px] justify-around flex items-center px-40">
        <Logo />
        <Search />
        <UserMenu />
      </div>
    </div>
  );
}
