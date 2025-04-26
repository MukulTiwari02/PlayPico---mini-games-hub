import Link from "next/link";
import Layout from "./Layout";
import gamesData from "@/helpers/games_data";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const GameLayout = ({ children }) => {
  const path = useRouter().asPath.substring(7);
  const game = gamesData.find((game) => game.url === path);
  const gameName = game ? game.gameName : "Unknown Game";

  return (
    <Layout>
      <div className="h-screen w-full bg-gradient-to-br from-[#03001e] via-[#7303c0] to-[#ec38bc] text-white flex flex-col items-center sm:justify-center max-lg:py-8 px-6 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            className="mb-6 px-6 py-2 bg-neon-pink text-black font-bold rounded-lg shadow-lg transition-all hover:shadow-neon-blue hover:bg-neon-blue text-lg tracking-wider"
            href={"/"}
          >
            🏠 Home
          </Link>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-neon-blue tracking-wide my-6 neon-glow uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {gameName}
        </motion.h1>

        <motion.div
          className="h-fit p-4 sm:p-8 bg-black/80 border-4 border-neon-pink rounded-2xl shadow-2xl backdrop-blur-lg neon-card relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 border-4 h-fit border-transparent hover:border-neon-blue transition-all"></div>
          {children}
        </motion.div>
      </div>
    </Layout>
  );
};

export default GameLayout;
