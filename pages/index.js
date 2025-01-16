import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

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
      <Link href={"/games/flappy-bird"}>Flappy Bird</Link>
      <Link href={"/games/game_2048"}>2048</Link>
      {/* TODO: Make Responsive for mobiles */}
    </div>
  );
}
