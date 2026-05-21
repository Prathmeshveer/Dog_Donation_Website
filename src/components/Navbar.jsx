import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const links = [
  { name: "About Us", id: "about" },
  { name: "What We Do", id: "what-we-do" },
  { name: "Dog Hostel", id: "hostel" },
  { name: "Our Team", id: "team" },
  { name: "Contact", id: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToSection = (id) => {
    setMenuOpen(false);

    setTimeout(() => {
      const section = document.getElementById(id);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);
  };

  const goAdmin = () => {
    setMenuOpen(false);
    navigate("/admin");
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
        scrolled || menuOpen
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] py-3"
          : "bg-gradient-to-b from-black/50 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div
          className="flex items-center gap-2.5 group relative"
          onMouseEnter={() => setShowAdminHint(true)}
          onMouseLeave={() => setShowAdminHint(false)}
        >
          <button
            type="button"
            onClick={() => goToSection("hero")}
            className="flex items-center gap-2.5"
          >
            <span
              className={`font-display text-2xl font-black tracking-tight transition-colors duration-300 ${
                scrolled || menuOpen ? "text-primary" : "text-white"
              }`}
            >
              VISAVA
            </span>

            <span
              className={`text-xs font-display font-medium tracking-widest hidden sm:block transition-colors duration-300 ${
                scrolled || menuOpen ? "text-textSecondary" : "text-white/70"
              }`}
            >
              SHWAN ASHRAM
            </span>
          </button>

          <AnimatePresence>
            {showAdminHint && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={goAdmin}
                title="Admin Login"
                className={`ml-1 p-1.5 rounded-full transition-colors duration-200 ${
                  scrolled || menuOpen
                    ? "text-gray-300 hover:text-gray-500 hover:bg-gray-100"
                    : "text-white/30 hover:text-white/70 hover:bg-white/10"
                }`}
              >
                🔒
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => goToSection(link.id)}
              className={`text-sm font-display font-medium tracking-wide transition-all duration-300 hover:text-primary ${
                scrolled ? "text-dark" : "text-white/90"
              }`}
            >
              {link.name}
            </button>
          ))}

          <button
            type="button"
            onClick={() => goToSection("donate")}
            className="bg-primary hover:bg-primary-dark text-white font-display font-bold text-sm px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transform"
          >
            Donate Now
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="lg:hidden flex flex-col gap-1.5 p-2 relative z-[10000]"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              scrolled || menuOpen ? "bg-dark" : "bg-white"
            } ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              scrolled || menuOpen ? "bg-dark" : "bg-white"
            } ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              scrolled || menuOpen ? "bg-dark" : "bg-white"
            } ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white overflow-hidden shadow-xl relative z-[9999]"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {links.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => goToSection(link.id)}
                  className="text-dark hover:text-primary text-base font-display font-medium tracking-wide text-left py-3 border-b border-cardBorder transition-colors"
                >
                  {link.name}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goToSection("donate")}
                className="bg-primary text-white font-bold text-base px-6 py-4 rounded-full mt-4 hover:bg-primary-dark transition-colors"
              >
                Donate Now
              </button>

              <button
                type="button"
                onClick={goAdmin}
                className="text-gray-300 hover:text-gray-500 text-xs text-center mt-3 py-2 transition-colors"
              >
                🔒 Admin
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}