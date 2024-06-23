"use client";

import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MenuIcon, Package2 } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";
import toast from "react-hot-toast";

export function NavigationMobile() {
  return (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link
              href="/mangas"
              className="text-muted-foreground hover:text-foreground"
            >
              Mangás
            </Link>
            <Link
              href="/artistas"
              className="text-muted-foreground hover:text-foreground"
            >
              Artistas
            </Link>
            <Link
              href="/editoras"
              className="text-muted-foreground hover:text-foreground"
            >
              Editoras
            </Link>
            <Link
              href="/genres"
              className="text-muted-foreground hover:text-foreground"
            >
              Gêneros
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Reviews
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
