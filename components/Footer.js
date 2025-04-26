const Footer = () => {
  return (
    <footer className="mt-auto text-gray-200 text-sm text-center w-full border-t border-neon-cyan py-2">
      <p className="flex gap-3 justify-center">
        &copy; {new Date().getFullYear()} PlayPico - Mini Games <img src="logo.png" className="h-5" alt="logo" />  Developed with
        ❤️ By{" "}
        <a className="underline" href="https://mukultiwari02.github.io/Portfolio.github.io/">
          Mukul Tiwari
        </a>
      </p>
    </footer>
  );
};

export default Footer;
