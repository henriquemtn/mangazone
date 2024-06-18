/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KNl7WbnV1vQ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, ShareIcon } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ReviewCard() {
  return (
    <Card className="w-full max-w-2xl p-6 grid gap-6 my-4">
      <div className="flex md:flex-row flex-col items-center gap-6">
        <Image
          src="https://m.media-amazon.com/images/I/51zPKHupwGL._SY445_SX342_.jpg"
          alt="Manga cover"
          width={150}
          height={200}
          className="rounded-lg object-cover"
        />
        <div className="flex gap-2">
          <div className="flex flex-col">
            <div className="flex flex-col  w-full justify-between">
              <h2 className="text-xl font-bold">
                Nova Funcionalidade em Breve!
              </h2>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <div>Análise feita por</div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#4C3BC2]">
                    Henrique Silveira
                  </span>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <p className="text-gray-500 dark:text-gray-400">
                Estamos desenvolvendo uma nova Feature, teremos uma
                funcionalidade de Reviews, onde o usuário poderá criar reviews
                sobre seus mangás!
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-0.5">
            <StarIcon className="w-5 h-5 fill-[#4C3BC2]" />
            <StarIcon className="w-5 h-5 fill-[#4C3BC2]" />
            <StarIcon className="w-5 h-5 fill-[#4C3BC2]" />
            <StarIcon className="w-5 h-5 fill-[#4C3BC2]" />
            <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">9/10</span>
        </div>
      </div>
      <hr />
      <div className="flex w-full justify-around">
        <div className="flex gap-2">
          <Heart fill="#4C3BC2" color="#4C3BC2" />
          <span className="text-[#4C3BC2]">7</span>
        </div>
        <div className="flex gap-2">
          <MessageCircle color="#969799" />
          <span className="text-[#4C3BC2]">7</span>
        </div>
        <div className="flex gap-2">
          <ShareIcon color="#969799" />
        </div>
      </div>
    </Card>
  );
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
