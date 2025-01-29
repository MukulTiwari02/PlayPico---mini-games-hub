import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import games_data from "@/helpers/games_data";
import Layout from "@/components/Layout";

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
    <Layout>
      {games_data.map((game,index) => {
        return <Link key={index} href={`/games/${game.url}`}>{game.gameName}</Link>
      })}
    </Layout>
  );
}
