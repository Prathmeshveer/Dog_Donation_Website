import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = ["About Us", "What We Do", "Dog Hostel", "Our Team", "Contact"];
const linkIds = ["about", "what-we-do", "hostel", "team", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] py-3"
          : "bg-gradient-to-b from-black/50 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2.5 group"
        >
          <span className={`font-display text-2xl font-black tracking-tight transition-colors duration-300 ${
            scrolled ? "text-primary" : "text-white"
          }`}>
            VISAVA
          </span>
          <span className={`text-xs font-display font-medium tracking-widest hidden sm:block transition-colors duration-300 ${
            scrolled ? "text-textSecondary" : "text-white/70"
          }`}>
            SHWAN ASHRAM
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link, i) => (
            <button
              key={link}
              onClick={() => scrollTo(linkIds[i])}
              className={`text-sm font-display font-medium tracking-wide transition-all duration-300 hover:text-primary ${
                scrolled ? "text-dark" : "text-white/90"
              }`}
            >
              {link}
            </button>
          ))}
          <button
            onClick={() => scrollTo("donate")}
            className="bg-primary hover:bg-primary-dark text-white font-display font-bold text-sm px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transform"
          >
            Donate Now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-dark" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-dark" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-dark" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white overflow-hidden shadow-lg"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {links.map((link, i) => (
                <button
                  key={link}
                  onClick={() => scrollTo(linkIds[i])}
                  className="text-dark hover:text-primary text-sm font-display font-medium tracking-wide text-left py-3 border-b border-cardBorder transition-colors"
                >
                  {link}
                </button>
              ))}
              <button
                onClick={() => scrollTo("donate")}
                className="bg-primary text-white font-bold text-sm px-6 py-3 rounded-full mt-4 hover:bg-primary-dark transition-colors"
              >
                Donate Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
