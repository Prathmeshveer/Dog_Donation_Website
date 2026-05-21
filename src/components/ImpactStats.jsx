import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function CountUp({ target, suffix = "", duration = 2500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { number: 20, suffix: "+", label: "Years of Service", sublabel: "Since 2004", icon: "🏆" },
  { number: 500, suffix: "+", label: "Dogs Fed Daily", sublabel: "Every single day", icon: "🐕" },
  { number: 100, suffix: "%", label: "Non-Profit", sublabel: "Volunteer driven", icon: "❤️" },
];

export default function ImpactStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-softBg">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl lg:text-4xl text-dark font-black tracking-tight">
            Two Decades of <span className="text-primary">Impact</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6 lg:gap-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center bg-white rounded-3xl p-8 shadow-sm border border-cardBorder hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5">{s.icon}</div>
              <div className="font-display text-5xl lg:text-6xl font-black text-primary mb-2 tracking-tight">
                {inView ? <CountUp target={s.number} suffix={s.suffix} /> : "0"}
              </div>
              <div className="font-display font-bold text-dark text-lg mb-1">{s.label}</div>
              <div className="font-body text-muted text-sm">{s.sublabel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
