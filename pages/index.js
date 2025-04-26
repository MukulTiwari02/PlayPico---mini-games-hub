import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";
import gamesData from "@/helpers/games_data";
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
      <div className="min-h-screen w-full bg-gradient-to-br from-[#000428] via-[#004e92] to-[#00d4ff] text-white flex flex-col items-center py-2 pt-6 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

        <motion.h1
          className="text-6xl md:text-8xl font-extrabold text-neon-cyan tracking-wide mb-6 neon-glow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          PlayPico
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl text-neon-magenta mb-8 neon-text max-w-3xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Step into a sleek neon world and play the coolest mini games ever
          made.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl p-6">
          {gamesData.map((game, index) => (
            <Link href={`/games/${game.url}`}>
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-black/90 border-2 border-neon-cyan text-white rounded-xl overflow-hidden shadow-xl transition-all hover:shadow-neon-cyan cursor-pointer backdrop-blur-md neon-card"
              >
                <div className="absolute inset-0 border-4 border-transparent hover:border-neon-magenta transition-all"></div>

                <div className="flex flex-col items-center">
                  <img
                    src={game.imgUrl}
                    alt={game.gameName}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-4 text-xl font-bold text-center text-neon-magenta tracking-wider uppercase">
                    {game.gameName}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <footer className="mt-auto text-gray-200 text-sm text-center w-full border-t border-neon-cyan pt-4">
          <p>&copy; {new Date().getFullYear()} PlayPico | Mini Games</p>
        </footer>
      </div>
    </Layout>
  );
}
