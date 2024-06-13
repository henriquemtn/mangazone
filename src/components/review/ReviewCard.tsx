/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KNl7WbnV1vQ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card } from "@/components/ui/card"

export default function ReviewCard() {
  return (
    <Card className="w-full max-w-2xl p-6 grid gap-6">
      <div className="grid md:grid-cols-[100px_1fr_150px] gap-6 items-center">
        <img src="/placeholder.svg" alt="Manga cover" width={100} height={150} className="rounded-lg object-cover" />
        <div className="grid gap-2">
          <h2 className="text-xl font-bold">The Wandering Swordsman</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div>Reviewed by</div>
            <div className="font-medium">Jared Palmer</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <StarIcon className="w-5 h-5 fill-primary" />
            <StarIcon className="w-5 h-5 fill-primary" />
            <StarIcon className="w-5 h-5 fill-primary" />
            <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
            <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">4.2 out of 5</span>
        </div>
      </div>
      <div className="grid gap-4">
        <p className="text-gray-500 dark:text-gray-400">
          Follow the journey of a skilled swordsman as he traverses the land, encountering challenges and forging new
          bonds.
        </p>
      </div>
    </Card>
  )
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
  )
}