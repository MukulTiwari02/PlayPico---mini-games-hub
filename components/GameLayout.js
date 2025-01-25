import Link from "next/link";
import Layout from "./Layout";

const GameLayout = ({ children }) => {
  return (
    <Layout>
      <Link className="mb-2" href={"/"}>Home</Link>
      {children}
    </Layout>
  );
};

export default GameLayout;
