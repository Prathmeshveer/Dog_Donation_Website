import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { supabase } from "../supabaseClient";

const AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

export default function Donate() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [qrUrl, setQrUrl] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
    amount: "",
    message: "",
  });

  const [customAmount, setCustomAmount] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQr = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "qr_code_url")
        .single();

      if (!error && data?.value) {
        setQrUrl(data.value);
      }
    };

    fetchQr();
  }, []);

  const handleAmount = (amt) => {
    setCustomAmount(false);
    setForm((f) => ({ ...f, amount: String(amt) }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setScreenshot(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.mobile.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    if (!form.amount) {
      setError("Please select or enter a donation amount.");
      return;
    }

    if (!screenshot) {
      setError("Please upload payment screenshot before submitting.");
      return;
    }

    setLoading(true);

    try {
      const fileExt = screenshot.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(fileName, screenshot, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError(`Screenshot upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("payment-screenshots")
        .getPublicUrl(fileName);

      const screenshot_url = urlData.publicUrl;

      const { error: insertError } = await supabase
        .from("donations")
        .insert([
          {
            full_name: form.full_name.trim(),
            email: form.email.trim(),
            mobile: form.mobile.trim(),
            amount: parseFloat(form.amount),
            payment_screenshot_url: screenshot_url,
            message: form.message.trim() || null,
            status: "pending",
          },
        ])
        .select();

      if (insertError) {
        setError(`Failed to save donation: ${insertError.message}`);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setForm({
        full_name: "",
        email: "",
        mobile: "",
        amount: "",
        message: "",
      });
      setScreenshot(null);
      setCustomAmount(false);
    } catch (err) {
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="donate" className="py-28 bg-dark" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-display text-sm font-semibold tracking-widest uppercase mb-4">
            Make an Impact
          </p>

          <h2 className="font-display text-4xl lg:text-5xl text-white font-black tracking-tight">
            Your Support Makes{" "}
            <span className="text-primary">a Difference.</span>
          </h2>

          <div className="section-divider" />

          <p className="text-white/60 font-body text-lg max-w-2xl mx-auto">
            We've done this for 20 years without external help, but with your
            support, we can do even more.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="font-display text-2xl text-dark font-bold mb-2">
                Pay via QR Code
              </h3>

              <p className="text-textSecondary font-body text-sm mb-6">
                Scan the QR code below to make a payment, then fill in the form
                with your details and upload the screenshot.
              </p>

              <div className="w-56 h-56 mx-auto bg-softBg border-2 border-dashed border-cardBorder rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain p-3"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-5xl mb-2">📲</div>
                    <p className="text-muted text-xs px-4 font-body">
                      QR code will appear here once added
                    </p>
                    <p className="text-muted/60 text-xs mt-1">
                      Upload your UPI QR from admin panel
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="text-dark font-display font-bold text-sm">
                  UPI / Bank Transfer
                </p>
                <p className="text-textSecondary text-sm mt-1">
                  After payment, upload a screenshot in the form →
                </p>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  "Feeds 500+ dogs every day",
                  "Provides medical treatment",
                  "Supports dog hostel",
                  "100% non-profit work",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="font-body text-sm text-textSecondary">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl overflow-hidden">
                <img
                  src="/feeding-dogs.jpg"
                  alt="Feeding stray dogs"
                  className="w-full h-40 object-cover rounded-2xl"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {success ? (
              <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
                <h3 className="font-display text-3xl text-dark font-black mb-3">
                  Thank You!
                </h3>

                <p className="text-textSecondary font-body leading-relaxed mb-6">
                  Your donation details have been received. We will verify your
                  payment and update the status.
                </p>

                <button
                  onClick={() => setSuccess(false)}
                  className="bg-primary text-white font-display font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
                >
                  Donate Again
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-8 shadow-xl space-y-5"
              >
                <h3 className="font-display text-2xl text-dark font-bold mb-1">
                  Donation Details
                </h3>

                <div>
                  <label className="text-dark font-display text-sm font-semibold mb-2 block">
                    Select Amount (₹) *
                  </label>

                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {AMOUNTS.map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => handleAmount(amt)}
                        className={`py-2.5 rounded-xl font-display font-semibold text-sm transition-all duration-200 border-2 ${
                          form.amount === String(amt) && !customAmount
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-dark border-cardBorder hover:border-primary/40"
                        }`}
                      >
                        ₹{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomAmount(true);
                      setForm((f) => ({ ...f, amount: "" }));
                    }}
                    className={`w-full py-2.5 rounded-xl font-display text-sm border-2 transition-all ${
                      customAmount
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-cardBorder text-textSecondary"
                    }`}
                  >
                    Custom Amount
                  </button>

                  {customAmount && (
                    <input
                      type="number"
                      placeholder="Enter amount in ₹"
                      value={form.amount}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, amount: e.target.value }))
                      }
                      className="mt-2 w-full border-2 border-cardBorder rounded-xl px-4 py-3 text-sm font-body text-dark focus:outline-none focus:border-primary transition-colors"
                    />
                  )}
                </div>

                {[
                  {
                    key: "full_name",
                    label: "Full Name *",
                    type: "text",
                    placeholder: "Your full name",
                  },
                  {
                    key: "email",
                    label: "Email *",
                    type: "email",
                    placeholder: "your@email.com",
                  },
                  {
                    key: "mobile",
                    label: "Mobile Number *",
                    type: "tel",
                    placeholder: "10-digit mobile number",
                  },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-dark font-display text-sm font-semibold mb-1.5 block">
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                      className="w-full border-2 border-cardBorder rounded-xl px-4 py-3 text-sm font-body text-dark focus:outline-none focus:border-primary transition-colors bg-white"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-dark font-display text-sm font-semibold mb-1.5 block">
                    Payment Screenshot{" "}
                    <span className="text-primary">*</span>
                  </label>

                  <label
                    htmlFor="screenshot-upload"
                    className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                      screenshot
                        ? "border-green-500 bg-green-50"
                        : "border-cardBorder hover:border-primary bg-softBg"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="hidden"
                      id="screenshot-upload"
                    />

                    {screenshot ? (
                      <>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                          ✓
                        </div>
                        <p className="text-green-700 text-xs font-display font-semibold text-center break-all">
                          {screenshot.name}
                        </p>
                        <p className="text-green-500 text-xs mt-1">
                          Tap to change
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                          ⬆
                        </div>
                        <p className="text-textSecondary text-xs font-display font-semibold">
                          Click to upload payment screenshot
                        </p>
                        <p className="text-muted text-xs mt-1">
                          JPG, PNG supported
                        </p>
                      </>
                    )}
                  </label>
                </div>

                <div>
                  <label className="text-dark font-display text-sm font-semibold mb-1.5 block">
                    Message (Optional)
                  </label>

                  <textarea
                    placeholder="Share a message of love..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    rows={3}
                    className="w-full border-2 border-cardBorder rounded-xl px-4 py-3 text-sm font-body text-dark focus:outline-none focus:border-primary resize-none transition-colors bg-white"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-display font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60 text-base tracking-wide"
                >
                  {loading ? "Submitting..." : "Donate Now 🐾"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}