import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="select-none h-[100vh] w-[100vw] overflow-x-hidden bg-neutral-300">
      {children}
    </div>
  );
};

export default Layout;
