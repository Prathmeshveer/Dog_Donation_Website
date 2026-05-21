import { motion } from "framer-motion";

export default function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - emotional flood rescue */}
      <div
        className="absolute inset-0 bg-black/100 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/rescue-flood.jpg')" }}
      />
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/75 to-dark/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-dark/30" />

      {/* Subtle red glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-left">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="inline-flex items-center gap-2.5 border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-display font-medium tracking-widest uppercase">
              Pune's Stray Dog Sanctuary
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white font-black leading-[1.05] text-shadow mb-6 tracking-tight"
          >
            20 Years of{" "}
            <span className="text-primary">Unconditional</span>{" "}
            Love.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="font-body text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-xl"
          >
            For two decades, we have dedicated our lives to caring for stray dogs —
            purely driven by our purpose to serve, protect, and love them.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => scrollTo("donate")}
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-display font-bold rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transform tracking-wide text-base"
            >
              Make a Difference
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="px-8 py-4 border-2 border-white/40 text-white font-display font-semibold rounded-full hover:bg-white hover:text-dark transition-all duration-300 tracking-wide backdrop-blur-sm text-base"
            >
              Learn Our Story
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs font-display tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 border-2 border-white/25 rounded-full flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 bg-primary/80 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
