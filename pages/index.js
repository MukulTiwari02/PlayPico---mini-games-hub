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
    <div>
      <Link href={'/games/flappy-bird'}>Flappy Bird</Link>
      <Link href={'/games/flappy-bird2'}>Flappy Bird2</Link>
      {/* TODO: Make Responsive for mobiles */}
    </div>
  );
}
