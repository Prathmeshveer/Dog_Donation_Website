import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HeartHandshake, ShieldPlus, Hotel } from "lucide-react";

const team = [
  {
    name: "Dilip Bhau",
    role: "Founder",
    phone: "7030519393",
    icon: HeartHandshake,
    featured: true,
    description:
      "A passionate animal lover who started this journey 20 years ago to give stray dogs a better life.",
  },
  {
    name: "Dr Prachi Maai",
    role: "Lead Volunteer",
    phone: "",
    icon: ShieldPlus,
    featured: false,
    description:
      "Manages daily operations and coordinates feeding and medical care for all the dogs in our care.",
  },
  {
    name: "Kulkarni Sir",
    role: "Hostel Manager",
    phone: "",
    icon: Hotel,
    featured: false,
    description:
      "Ensures the dog hostel runs smoothly, providing a safe and joyful environment for our boarding guests.",
  },
];

export default function Team() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="team" className="py-28 bg-softBg">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-display text-sm font-semibold tracking-widest uppercase mb-4">
            The People Behind It
          </p>

          <h2 className="font-display text-4xl lg:text-5xl text-dark font-black tracking-tight">
            Our <span className="text-primary">Team</span>
          </h2>

          <div className="section-divider" />

          <p className="text-textSecondary font-body text-lg max-w-2xl mx-auto">
            Ordinary people doing extraordinary things for animals who cannot
            speak for themselves.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, i) => {
            const Icon = member.icon;

            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  member.featured
                    ? "border-primary/30 shadow-lg md:scale-105"
                    : "border-cardBorder shadow-sm"
                }`}
              >
                {member.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide font-display">
                    ✦ Founder
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-coral flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Icon className="w-9 h-9 text-white stroke-[2.5]" />
                  </div>

                  <h3 className="font-display text-xl font-bold text-dark">
                    {member.name}
                  </h3>

                  <p className="text-primary font-display text-sm tracking-wide font-semibold mt-1">
                    {member.role}
                  </p>

                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="inline-flex items-center gap-1.5 text-textSecondary hover:text-primary text-sm mt-2 transition-colors font-body"
                    >
                      📞 {member.phone}
                    </a>
                  )}
                </div>

                <div className="w-8 h-0.5 bg-primary/30 mx-auto mb-4" />

                <p className="font-body text-textSecondary leading-relaxed text-center text-sm">
                  {member.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}