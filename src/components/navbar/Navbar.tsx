import React from "react";
import UserMenu from "./UserMenu";
import Logo from "./Logo";
import Search from "./Search";
import { Megaphone, Menu } from "lucide-react";
import NavigationMenuTable from "./NavigationMenu";
import { NavigationMobile } from "./NavigationMobile";

export default function Navbar() {
  return (
    <div className="fixed top-0 z-50 h-[175px] bg-white border-b-[1px] shadow-sm w-full">
      <div className="bg-[#4C3BC2] w-full h-[30px] flex items-center justify-center">
        <Megaphone color="white" className="mr-1" />
        <p className="flex gap-1 text-white text-[13px]">
          <span className="hidden md:block">O Site está em Desenvolvimento! </span> Encontre
          seus Mangás nos melhores preços.
        </p>
      </div>
      <div className="w-full h-[100px] justify-around border-b-[1px] mb-[1px] flex items-center px-4 md:px-40">
        <Logo />
        <NavigationMobile  />
        <Search />
        <UserMenu />
      </div>
      <div className="w-full flex justify-end md:justify-between items-center h-[39px] px-4 container">
        <div className="hidden md:block">
          <NavigationMenuTable />
        </div>
      </div>
    </div>
  );
}
