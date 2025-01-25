import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import games_data from "@/helpers/games_data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="h-[100vh] w-full bg-neutral-300 flex flex-col items-center justify-center">
      {games_data.map(game => {
        return <Link href={`/games/${game.url}`}>{game.gameName}</Link>
      })}
    </div>
  );
}
