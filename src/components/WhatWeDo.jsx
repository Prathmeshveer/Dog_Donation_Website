import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    icon: "🩺",
    title: "Medical Care",
    description:
      "We provide essential medication and first aid to injured, sick, and vulnerable stray dogs — ensuring they receive the treatment they deserve.",
  },
  {
    icon: "🍽️",
    title: "Daily Feeding",
    description:
      "We feed over 500 stray dogs every single day — rain or shine, without fail. No dog goes to bed hungry when they are in our care.",
    featured: true,
  },
  {
    icon: "🕊️",
    title: "End-of-Life Care",
    description:
      "We provide compassionate and respectful care even after their passing — honoring every life with the dignity it deserves.",
  },
];

export default function WhatWeDo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="what-we-do" className="py-28 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-display text-sm font-semibold tracking-widest uppercase mb-4">Our Work</p>
          <h2 className="font-display text-4xl lg:text-5xl text-white font-black tracking-tight">
            What We Do,{" "}
            <span className="text-primary">Every Day.</span>
          </h2>
          <div className="section-divider" />
          <p className="text-white/60 font-body text-lg max-w-2xl mx-auto">
            Our commitment to these animals never wavers — 365 days a year, 20 years strong.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className={`relative rounded-3xl overflow-hidden group cursor-default ${
                s.featured ? "md:-mt-4 md:mb-4" : ""
              }`}
            >
              <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 p-8 lg:p-10 h-full transition-all duration-300 group-hover:bg-white/[0.1] group-hover:-translate-y-1 rounded-3xl">
                {s.featured && (
                  <div className="absolute top-5 right-5 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                    Core Mission
                  </div>
                )}
                <div className="w-14 h-14 bg-primary/15 rounded-2xl flex items-center justify-center text-3xl mb-6">{s.icon}</div>
                <h3 className="font-display text-2xl text-white font-bold mb-4">{s.title}</h3>
                <p className="text-white/70 font-body leading-relaxed">{s.description}</p>

                {/* Decorative line */}
                <div className="mt-8 w-12 h-0.5 bg-primary/40 group-hover:w-24 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
