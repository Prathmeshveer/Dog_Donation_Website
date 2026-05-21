import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DonorList() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const fetchDonors = async () => {
    const { data, error } = await supabase
      .from("donations")
      .select("id, full_name, amount, created_at, message")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) console.log("Fetch error:", error);
    if (data) setDonors(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchDonors();

    const channel = supabase
      .channel("donations-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "donations" },
        (payload) => {
          setDonors((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="py-24 bg-softBg" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 border border-primary/20 bg-white px-5 py-2 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-dark font-display text-xs tracking-widest uppercase">
              Live Donors
            </span>
          </div>

          <h2 className="font-display text-4xl lg:text-5xl text-dark font-black tracking-tight">
            Our <span className="text-primary italic">Generous Donors</span>
          </h2>

          <div className="section-divider" />

          <p className="text-textSecondary font-body text-lg italic">
            Every name here represents a heart that cared for these animals.
          </p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-xl border border-cardBorder overflow-hidden">
          <div className="grid grid-cols-3 gap-4 px-6 py-5 bg-dark text-white font-display text-xs font-bold tracking-widest uppercase sticky top-0 z-10">
            <span>Donor</span>
            <span className="text-center">Amount</span>
            <span className="text-right">Date</span>
          </div>

          <div className="max-h-[420px] overflow-y-auto custom-scroll">
            {loading ? (
              <div className="py-14 text-center text-textSecondary font-body text-sm">
                <div className="animate-bounce text-4xl mb-3">🐾</div>
                Loading donors...
              </div>
            ) : donors.length === 0 ? (
              <div className="py-14 text-center text-textSecondary font-body text-sm">
                <div className="text-4xl mb-3">❤️</div>
                Be the first to donate and make a difference!
              </div>
            ) : (
              <div className="divide-y divide-cardBorder">
                <AnimatePresence initial={false}>
                  {donors.map((donor) => (
                    <motion.div
                      key={donor.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="grid grid-cols-3 gap-4 px-6 py-5 hover:bg-primary/5 transition-colors"
                    >
                      <div>
                        <p className="font-display font-bold text-dark text-sm">
                          {donor.full_name}
                        </p>

                        {donor.message && (
                          <p className="text-textSecondary text-xs mt-1 line-clamp-1 italic">
                            “{donor.message}”
                          </p>
                        )}
                      </div>

                      <div className="text-center self-center">
                        <span className="inline-block bg-primary/10 text-primary font-display font-bold text-sm px-4 py-2 rounded-full border border-primary/20">
                          ₹{Number(donor.amount).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-right text-textSecondary font-body text-xs self-center">
                        {formatDate(donor.created_at)}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}