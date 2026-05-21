import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  { icon: "🎯", text: "All proceeds directly support our non-profit mission." },
  { icon: "🏠", text: "Secure, clean, and spacious enclosures for every dog." },
  { icon: "👐", text: "Dedicated and loving caretakers round the clock." },
  { icon: "🎾", text: "Regular exercise, play time, and social interaction." },
];

export default function Hostel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="hostel" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-primary/10 text-primary border border-primary/20 text-xs font-display font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-5">
            New Initiative
          </span>
          <h2 className="font-display text-4xl lg:text-5xl text-dark font-black mb-4 tracking-tight">
            Introducing Our{" "}
            <span className="text-primary">Dog Hostel</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <img
                src="/hostel.jpeg"
                alt="Adorable puppies at Visava"
                className="w-full h-80 lg:h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-primary text-white font-bold font-display text-sm px-5 py-2.5 rounded-full shadow-lg">
                  🐾 VISAVA DOG HOSTEL
                </span>
              </div>
            </div>
            {/* Floating image accent */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white hidden lg:block">
              <img src="/puppies.jpg" alt="Hostel facility" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <p className="font-body text-lg text-textSecondary leading-relaxed mb-8">
              To offer even more support, we are now starting a new dog hostel. This facility
              will provide a safe, loving, and comfortable environment for dogs — whether for
              short-term boarding or long-term care.
            </p>

            <div className="flex flex-col gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-4 bg-softBg rounded-2xl px-5 py-4 border border-cardBorder hover:border-primary/20 hover:shadow-sm transition-all duration-300"
                >
                  <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">{f.icon}</span>
                  <p className="text-textSecondary font-body text-sm pt-2">{f.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white font-display font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:scale-105 transform"
              >
                Support the Hostel
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
