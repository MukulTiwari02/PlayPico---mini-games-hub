import Link from "next/link";
import Layout from "./Layout";
import gamesData from "@/helpers/games_data";
import { useRouter } from "next/router";

const GameLayout = ({ children }) => {
  const path = useRouter().asPath.substring(7);
  const gameName = gamesData.filter(game => game.url === path)[0].gameName;
  return (
    <Layout>
      <Link className="mb-2" href={"/"}>Home</Link>
      <h1 className="font-bold text-4xl my-2">{gameName}</h1>
      {children}
    </Layout>
  );
};

export default GameLayout;
