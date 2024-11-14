// app/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Card Game
      </h1>
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <Link href="/game">
          <Button className="w-full">Play Game</Button>
        </Link>
        <Link href="/deckbuilder">
          <Button className="w-full" variant="outline">Deck Builder</Button>
        </Link>
      </div>
    </div>
  )
}
