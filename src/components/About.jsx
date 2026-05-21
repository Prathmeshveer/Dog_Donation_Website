import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

function AnimatedSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image + Quote */}
          <AnimatedSection delay={0}>
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="/caring-animals.jpg"
                  alt="Caring for street animals"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
              </div>

              {/* Floating Quote Card */}
              <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-white rounded-2xl p-6 shadow-xl border border-cardBorder max-w-[280px]">
                <div className="text-primary text-4xl font-display font-black leading-none mb-2">"</div>
                <p className="text-dark text-sm font-body leading-relaxed italic mb-3">
                  Every single dog deserves love, care, and dignity — whether they were born on the streets or in a home.
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-primary" />
                  <span className="text-textSecondary font-display text-xs font-semibold tracking-wide uppercase">Dilip Bhau, Founder</span>
                </div>
              </div>

              {/* Stats badge */}
              <div className="absolute -top-4 -left-4 bg-primary text-white rounded-2xl p-4 shadow-lg font-display font-bold text-center">
                <div className="text-2xl font-black">500+</div>
                <div className="text-xs font-medium opacity-90">Dogs Fed Daily</div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right - Text */}
          <AnimatedSection delay={0.2}>
            <div>
              <p className="text-primary font-display text-sm font-semibold tracking-widest uppercase mb-4">Our Story</p>
              <h2 className="font-display text-4xl lg:text-5xl text-dark font-black leading-tight mb-4 tracking-tight">
                Our Purpose,<br />
                <span className="text-primary">Our Promise.</span>
              </h2>
              <div className="section-divider !mx-0 !my-6" />
              
              <p className="font-body text-textSecondary leading-relaxed mb-6 text-base lg:text-lg">
                For the past 20 years, we have dedicated our lives to caring for stray dogs — providing
                medication, supporting pregnant dogs, and handling them with love even after their passing.
              </p>
              <p className="font-body text-textSecondary leading-relaxed mb-8 text-base lg:text-lg">
                Without any external help, we have been feeding over 500 stray dogs daily and ensuring
                their well-being. This work is purely non-profit, driven only by our purpose to serve,
                protect, and love dogs. <strong className="text-dark">Every action we take is for them.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 bg-softBg border border-cardBorder rounded-2xl px-5 py-4">
                  <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-lg">🏥</span>
                  <div>
                    <div className="font-display font-bold text-dark text-sm">Veterinary Care</div>
                    <div className="text-muted text-xs">Medical treatment provided</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-softBg border border-cardBorder rounded-2xl px-5 py-4">
                  <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-lg">❤️</span>
                  <div>
                    <div className="font-display font-bold text-dark text-sm">100% Non-Profit</div>
                    <div className="text-muted text-xs">No external funding</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
