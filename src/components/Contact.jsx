import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=Ganesh%20Nagar%2C%20Pune%2C%20Maharashtra%20411038";

  const footerImages = [
    "/footer-dog-1.jpg",
  "/footer-dog-2.jpg",
  "/footer-dog-3.jpg",
  "/footer-dog-4.jpg",
  "/footer-dog-5.jpg",
  "/footer-dog-6.jpg",
  "/footer-dog-7.jpg",
  "/footer-dog-8.jpg",
  "/footer-dog-9.jpg",
  ];

  return (
    <>
      <section id="contact" className="py-24 bg-softBg" ref={ref}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-primary font-display text-sm font-semibold tracking-widest uppercase mb-4">
              Get in Touch
            </p>

            <h2 className="font-display text-4xl lg:text-5xl text-dark font-black">
              Visit <span className="text-primary italic">Us</span>
            </h2>

            <div className="section-divider" />
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl border border-cardBorder"
            >
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="font-display text-3xl text-dark font-black mb-1">
                    VISAVA SHWAN ASHRAM
                  </h3>

                  <p className="text-primary font-display text-sm font-bold tracking-wide mb-6">
                    & DOG HOSTEL
                  </p>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <span className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-xl">
                        📍
                      </span>

                      <div>
                        <p className="font-display text-dark font-bold text-sm">
                          Address
                        </p>

                        <p className="text-textSecondary text-sm leading-relaxed">
                          Ganesh Nagar, Pune, Maharashtra - 411038
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <span className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-xl">
                        📞
                      </span>

                      <div>
                        <p className="font-display text-dark font-bold text-sm">
                          Contact
                        </p>

                        <a
                          href="tel:7030339393"
                          className="text-primary hover:text-primary-dark transition-colors font-bold"
                        >
                          7030339393
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <span className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-xl">
                        🏥
                      </span>

                      <div>
                        <p className="font-display text-dark font-bold text-sm">
                          Services
                        </p>

                        <p className="text-textSecondary text-sm">
                          Veterinary Services Available
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary via-[#c1121f] to-[#2b2d42] rounded-3xl p-8 text-center text-white shadow-2xl">
                  <p className="text-white/70 text-sm mb-3">
                    Founder & Contact Person
                  </p>

                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl mx-auto mb-4">
                    👨‍⚕️
                  </div>

                  <h4 className="font-display text-3xl font-black">
                    Shree Dilip Bhau
                  </h4>

                  <p className="text-white/80 text-sm mt-2 mb-6">
                    Founder, VISAVA Shwan Ashram
                  </p>

                  <a
                    href="tel:7030519393"
                    className="inline-block bg-white text-primary hover:bg-primary hover:text-white font-bold text-sm px-7 py-3 rounded-full transition-all duration-300 shadow-lg"
                  >
                    📞 7030519393
                  </a>
                </div>
              </div>

              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 block rounded-3xl overflow-hidden shadow-xl group"
              >
                <div className="relative h-64 bg-gradient-to-br from-primary/20 via-white to-primary/10 border border-primary/10 flex items-center justify-center">
                  <div className="relative text-center">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      🗺️
                    </div>

                    <h4 className="font-display text-3xl font-black text-dark mb-3">
                      Open Location in Google Maps
                    </h4>

                    <p className="text-textSecondary text-sm">
                      Ganesh Nagar, Pune, Maharashtra - 411038
                    </p>

                    <span className="inline-block mt-6 bg-primary hover:bg-primary-dark text-white font-bold text-sm px-7 py-3 rounded-full transition-all duration-300 shadow-lg">
                      Get Directions →
                    </span>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="relative bg-black text-white overflow-hidden py-10">
        <div className="absolute inset-0 overflow-hidden opacity-60">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-5 w-max h-full items-center"
          >
            {[...footerImages, ...footerImages].map((img, index) => (
              <div
                key={index}
                className="w-[240px] h-[150px] rounded-2xl overflow-hidden border border-primary/20 shadow-xl flex-shrink-0"
              >
                <img
                  src={img}
                  alt="dog"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-extrabold text-primary">
            VISAVA
            <span className="text-gray-300 text-xl ml-3 font-medium">
              SHWAN ASHRAM & DOG HOSTEL
            </span>
          </h1>

          <p className="text-white mt-5 text-base">
            © 2024 VISAVA SHWAN ASHRAM & DOG HOSTEL. All rights reserved.
          </p>

          <p className="text-gray-200 mt-2 text-sm">
            Made with ❤️ for the stray dogs of Pune
          </p>

          <div className="flex justify-center gap-7 mt-5 text-gray-100 flex-wrap text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              100% Non-Profit
            </span>

            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Serving Since 2004
            </span>

            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Pune, Maharashtra
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}