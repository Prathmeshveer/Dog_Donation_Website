import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function supabaseRequest(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...options.headers,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json().catch(() => null);
}

async function supabaseStorageUpload(bucket, path, file) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!res.ok) throw new Error(await res.text());
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

const ADMIN_PASSWORD = "visava2024";
const tabs = ["Donations", "QR Code", "Gallery"];

const statusColors = {
  pending: { bg: "#FFF3CD", text: "#856404", label: "Pending" },
  verified: { bg: "#D1FAE5", text: "#065F46", label: "Verified" },
  rejected: { bg: "#FEE2E2", text: "#991B1B", label: "Rejected" },
};

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [tab, setTab] = useState("Donations");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [qrFile, setQrFile] = useState(null);
  const [qrUploading, setQrUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const qrInputRef = useRef();
  const photoInputRef = useRef();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwErr("");
    } else {
      setPwErr("Incorrect password. Try again.");
    }
  };

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const data = await supabaseRequest("/donations?order=created_at.desc");
      setDonations(data || []);
    } catch (e) {
      showToast("Failed to load donations: " + e.message, "error");
    }
    setLoading(false);
  };

  const fetchQr = async () => {
    try {
      const data = await supabaseRequest("/settings?key=eq.qr_code_url&select=value");
      setQrUrl(data?.[0]?.value || "");
    } catch {
      setQrUrl("");
    }
  };

  const fetchPhotos = async () => {
    try {
      const data = await supabaseRequest("/gallery?order=created_at.desc");
      setPhotos(data || []);
    } catch {
      setPhotos([]);
    }
  };

  useEffect(() => {
    if (!authed) return;

    fetchDonations();
    fetchQr();
    fetchPhotos();

    const channel = supabase
      .channel("admin-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "donations" },
        (payload) => {
          setDonations((prev) => [payload.new, ...prev]);
          showToast("🐾 New donation from " + payload.new.full_name + "!");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "donations" },
        (payload) => {
          setDonations((prev) => prev.map((d) => (d.id === payload.new.id ? payload.new : d)));
          setSelectedDonation((prev) => (prev?.id === payload.new.id ? payload.new : prev));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "donations" },
        (payload) => {
          setDonations((prev) => prev.filter((d) => d.id !== payload.old.id));
          setSelectedDonation((prev) => (prev?.id === payload.old.id ? null : prev));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [authed]);

  const updateDonationStatus = async (id, status) => {
    try {
      await supabaseRequest(`/donations?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          verified_at: status === "verified" ? new Date().toISOString() : null,
        }),
      });

      setDonations((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
      if (selectedDonation?.id === id) setSelectedDonation((d) => ({ ...d, status }));

      showToast(status === "verified" ? "✓ Donation verified!" : "✗ Donation rejected.");
    } catch (e) {
      showToast("Update failed: " + e.message, "error");
    }
  };

  const deleteDonation = async (id) => {
    if (!confirm("Delete this donation permanently?")) return;

    try {
      await supabaseRequest(`/donations?id=eq.${id}`, { method: "DELETE" });
      setDonations((prev) => prev.filter((d) => d.id !== id));
      setSelectedDonation(null);
      showToast("Donation deleted.");
    } catch (e) {
      showToast("Delete failed: " + e.message, "error");
    }
  };

  const deleteRejectedDonations = async () => {
    if (!confirm("Delete all rejected donations permanently?")) return;

    try {
      await supabaseRequest("/donations?status=eq.rejected", { method: "DELETE" });
      setDonations((prev) => prev.filter((d) => d.status !== "rejected"));
      setSelectedDonation(null);
      showToast("Rejected donations deleted.");
    } catch (e) {
      showToast("Delete failed: " + e.message, "error");
    }
  };

  const saveQrSetting = async (value) => {
    const { error } = await supabase
      .from("settings")
      .upsert({ key: "qr_code_url", value }, { onConflict: "key" });

    if (error) throw error;
  };

  const uploadQr = async () => {
    if (!qrFile) return;
    setQrUploading(true);

    try {
      const path = `qr/qr_${Date.now()}.${qrFile.name.split(".").pop()}`;
      const url = await supabaseStorageUpload("visava-assets", path, qrFile);

      await saveQrSetting(url);

      setQrUrl(url);
      setQrFile(null);
      if (qrInputRef.current) qrInputRef.current.value = "";
      showToast("QR code updated successfully!");
    } catch (e) {
      showToast("QR upload failed: " + e.message, "error");
    }

    setQrUploading(false);
  };

  const deleteQr = async () => {
    if (!confirm("Delete current QR code from donation page?")) return;

    try {
      await saveQrSetting("");
      setQrUrl("");
      setQrFile(null);
      if (qrInputRef.current) qrInputRef.current.value = "";
      showToast("QR code deleted.");
    } catch (e) {
      showToast("QR delete failed: " + e.message, "error");
    }
  };

  const uploadPhoto = async () => {
    if (!photoFile) return;
    setPhotoUploading(true);

    try {
      const path = `gallery/photo_${Date.now()}.${photoFile.name.split(".").pop()}`;
      const url = await supabaseStorageUpload("visava-assets", path, photoFile);

      const data = await supabaseRequest("/gallery", {
        method: "POST",
        body: JSON.stringify({ url, caption: photoCaption, visible: true }),
      });

      if (data?.[0]) {
        setPhotos((prev) => [data[0], ...prev]);
      } else {
        setPhotos((prev) => [
          { url, caption: photoCaption, visible: true, created_at: new Date().toISOString() },
          ...prev,
        ]);
      }

      setPhotoFile(null);
      setPhotoCaption("");
      if (photoInputRef.current) photoInputRef.current.value = "";
      showToast("Photo uploaded!");
    } catch (e) {
      showToast("Photo upload failed: " + e.message, "error");
    }

    setPhotoUploading(false);
  };

  const togglePhotoVisibility = async (id, visible) => {
    try {
      await supabaseRequest(`/gallery?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ visible: !visible }),
      });

      setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, visible: !visible } : p)));
      showToast(!visible ? "Photo shown." : "Photo hidden.");
    } catch (e) {
      showToast("Failed: " + e.message, "error");
    }
  };

  const deletePhoto = async (id) => {
    if (!confirm("Delete this photo permanently?")) return;

    try {
      await supabaseRequest(`/gallery?id=eq.${id}`, { method: "DELETE" });
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      showToast("Photo deleted.");
    } catch (e) {
      showToast("Delete failed: " + e.message, "error");
    }
  };

  const filtered =
    filterStatus === "all" ? donations : donations.filter((d) => d.status === filterStatus);

  const stats = {
    total: donations.length,
    pending: donations.filter((d) => d.status === "pending").length,
    verified: donations.filter((d) => d.status === "verified").length,
    rejected: donations.filter((d) => d.status === "rejected").length,
    totalAmount: donations
      .filter((d) => d.status === "verified")
      .reduce((s, d) => s + (Number(d.amount) || 0), 0),
  };

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f6f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: isMobile ? "2rem 1.2rem" : "2.5rem 2rem",
            width: "100%",
            maxWidth: 360,
            boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "#E63946",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.2rem",
            }}
          >
            <span style={{ fontSize: 28 }}>🐾</span>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>
            Visava Admin
          </h1>

          <p style={{ fontSize: 13, color: "#888", margin: "0 0 1.8rem" }}>
            Shwan Ashram Control Panel
          </p>

          <input
            type="password"
            placeholder="Enter admin password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: pwErr ? "1.5px solid #E63946" : "1.5px solid #ddd",
              borderRadius: 8,
              fontSize: 15,
              outline: "none",
              boxSizing: "border-box",
              marginBottom: 8,
            }}
          />

          {pwErr && <p style={{ color: "#E63946", fontSize: 13 }}>{pwErr}</p>}

          <button
            onClick={login}
            style={{
              width: "100%",
              padding: "12px",
              background: "#E63946",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 6,
            }}
          >
            Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4f0", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 15,
            right: isMobile ? 12 : 20,
            left: isMobile ? 12 : "auto",
            zIndex: 9999,
            background: toast.type === "error" ? "#E63946" : "#2D6A4F",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          {toast.msg}
        </div>
      )}

      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8e5df",
          padding: isMobile ? "0 1rem" : "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: isMobile ? 56 : 60,
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🐾</span>
          <div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>VISAVA</span>
            {!isMobile && <span style={{ fontSize: 13, color: "#888", marginLeft: 8 }}>Admin Panel</span>}
          </div>
        </div>

        <button
          onClick={() => setAuthed(false)}
          style={{
            background: "none",
            border: "1px solid #ddd",
            borderRadius: 7,
            padding: "6px 12px",
            fontSize: 13,
            cursor: "pointer",
            color: "#666",
          }}
        >
          Logout
        </button>
      </header>

      <div
        style={{
          display: isMobile ? "block" : "flex",
          maxWidth: 1280,
          margin: "0 auto",
          padding: isMobile ? "1rem" : "1.5rem 1.5rem 0",
        }}
      >
        <nav
          style={{
            width: isMobile ? "100%" : 200,
            display: isMobile ? "grid" : "block",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "none",
            gap: isMobile ? 8 : 0,
            flexShrink: 0,
            marginRight: isMobile ? 0 : "1.5rem",
            marginBottom: isMobile ? "1rem" : 0,
          }}
        >
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "11px 14px",
                border: "none",
                borderRadius: 8,
                background: tab === t ? "#E63946" : "#fff",
                color: tab === t ? "#fff" : "#444",
                fontWeight: tab === t ? 600 : 500,
                fontSize: 14,
                cursor: "pointer",
                marginBottom: isMobile ? 0 : 4,
                boxShadow: isMobile ? "0 1px 4px rgba(0,0,0,0.05)" : "none",
              }}
            >
              {t === "Donations" && "💰 "}
              {t === "QR Code" && "📱 "}
              {t === "Gallery" && "🖼️ "}
              {t === "Settings" && "⚙️ "}
              {t}
            </button>
          ))}
        </nav>

        <main style={{ flex: 1, paddingBottom: "3rem", minWidth: 0 }}>
          {tab === "Donations" && (
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                  gap: 12,
                  marginBottom: "1.5rem",
                }}
              >
                {[
                  { label: "Total Donations", value: stats.total, color: "#4361EE" },
                  { label: "Pending Review", value: stats.pending, color: "#F4A261" },
                  { label: "Verified", value: stats.verified, color: "#2D6A4F" },
                  { label: "Total Collected", value: `₹${stats.totalAmount.toLocaleString()}`, color: "#E63946" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #e8e5df" }}>
                    <p style={{ fontSize: 11, color: "#888", margin: "0 0 6px", textTransform: "uppercase" }}>{s.label}</p>
                    <p style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e5df", overflow: "hidden" }}>
                <div
                  style={{
                    padding: "1rem",
                    borderBottom: "1px solid #e8e5df",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 12,
                    justifyContent: "space-between",
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Donation Submissions</h2>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["all", "pending", "verified", "rejected"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 20,
                          border: "1px solid #ddd",
                          background: filterStatus === s ? "#E63946" : "#fff",
                          color: filterStatus === s ? "#fff" : "#555",
                          fontSize: 13,
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {s}
                      </button>
                    ))}

                    <button
                      onClick={fetchDonations}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 7,
                        border: "1px solid #ddd",
                        background: "#fff",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      ↻ Refresh
                    </button>

                    <button
                      onClick={deleteRejectedDonations}
                      disabled={stats.rejected === 0}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 7,
                        border: "1px solid #E63946",
                        background: stats.rejected === 0 ? "#f5f5f5" : "#fff",
                        color: stats.rejected === 0 ? "#aaa" : "#E63946",
                        fontSize: 13,
                        cursor: stats.rejected === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      🗑 Delete Rejected
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>Loading donations...</div>
                ) : filtered.length === 0 ? (
                  <div style={{ padding: "3rem", textAlign: "center", color: "#aaa" }}>No donations found.</div>
                ) : (
                  <div style={{ display: isMobile ? "block" : "flex" }}>
                    <div
                      style={{
                        width: isMobile ? "100%" : 340,
                        borderRight: isMobile ? "none" : "1px solid #e8e5df",
                        borderBottom: isMobile ? "1px solid #e8e5df" : "none",
                        overflowY: "auto",
                        maxHeight: isMobile ? 300 : 600,
                      }}
                    >
                      {filtered.map((d) => (
                        <div
                          key={d.id}
                          onClick={() => setSelectedDonation(d)}
                          style={{
                            padding: "12px 14px",
                            borderBottom: "1px solid #f0ede8",
                            cursor: "pointer",
                            background: selectedDonation?.id === d.id ? "#FFF5F5" : "#fff",
                            borderLeft: selectedDonation?.id === d.id ? "3px solid #E63946" : "3px solid transparent",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>{d.full_name || "Unknown"}</span>
                            <span
                              style={{
                                fontSize: 12,
                                padding: "2px 8px",
                                borderRadius: 12,
                                background: statusColors[d.status]?.bg || "#eee",
                                color: statusColors[d.status]?.text || "#666",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {statusColors[d.status]?.label || d.status}
                            </span>
                          </div>

                          <div style={{ fontSize: 13, color: "#666", wordBreak: "break-word" }}>
                            ₹{d.amount || "—"} · {d.email}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ flex: 1, padding: isMobile ? "1rem" : "1.5rem", minWidth: 0 }}>
                      {!selectedDonation ? (
                        <div style={{ textAlign: "center", color: "#aaa", marginTop: "2rem" }}>
                          <div style={{ fontSize: 36, marginBottom: 12 }}>👆</div>
                          <p>Select a donation to review</p>
                        </div>
                      ) : (
                        <div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: isMobile ? "column" : "row",
                              justifyContent: "space-between",
                              gap: 10,
                              marginBottom: "1.2rem",
                            }}
                          >
                            <div>
                              <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>{selectedDonation.full_name}</h3>
                              <span
                                style={{
                                  fontSize: 13,
                                  padding: "3px 10px",
                                  borderRadius: 12,
                                  background: statusColors[selectedDonation.status]?.bg || "#eee",
                                  color: statusColors[selectedDonation.status]?.text || "#666",
                                }}
                              >
                                {statusColors[selectedDonation.status]?.label || selectedDonation.status}
                              </span>
                            </div>

                            <span style={{ fontSize: 24, fontWeight: 700, color: "#E63946" }}>₹{selectedDonation.amount || "—"}</span>
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                              gap: "10px 16px",
                              marginBottom: "1rem",
                              fontSize: 14,
                            }}
                          >
                            {[
                              ["Email", selectedDonation.email],
                              ["Mobile", selectedDonation.mobile],
                              ["Date", new Date(selectedDonation.created_at).toLocaleString("en-IN")],
                              ["Message", selectedDonation.message || "—"],
                            ].map(([label, val]) => (
                              <div key={label}>
                                <span style={{ color: "#888", fontSize: 12 }}>{label}</span>
                                <p style={{ margin: "2px 0 0", fontWeight: 500, color: "#1a1a1a", wordBreak: "break-word" }}>{val}</p>
                              </div>
                            ))}
                          </div>

                          <div style={{ marginBottom: "1.2rem" }}>
                            <p style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>Payment Screenshot</p>

                            {selectedDonation.payment_screenshot_url ? (
                              <div>
                                <img
                                  src={selectedDonation.payment_screenshot_url}
                                  alt="Payment screenshot"
                                  style={{
                                    width: "100%",
                                    maxHeight: isMobile ? 220 : 300,
                                    borderRadius: 10,
                                    border: "1px solid #e8e5df",
                                    objectFit: "contain",
                                    background: "#f9f9f9",
                                  }}
                                />

                                <a
                                  href={selectedDonation.payment_screenshot_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ display: "inline-block", marginTop: 8, fontSize: 13, color: "#4361EE" }}
                                >
                                  Open full size ↗
                                </a>
                              </div>
                            ) : (
                              <div style={{ padding: "2rem", background: "#f5f4f0", borderRadius: 8, textAlign: "center", color: "#aaa", fontSize: 14 }}>
                                No screenshot uploaded
                              </div>
                            )}
                          </div>

                          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10 }}>
                            <button
                              onClick={() => updateDonationStatus(selectedDonation.id, "verified")}
                              style={{
                                flex: 1,
                                padding: "11px",
                                background: "#2D6A4F",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                              }}
                            >
                              ✓ Verify
                            </button>

                            <button
                              onClick={() => updateDonationStatus(selectedDonation.id, "rejected")}
                              style={{
                                flex: 1,
                                padding: "11px",
                                background: "#fff",
                                color: "#E63946",
                                border: "1.5px solid #E63946",
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                              }}
                            >
                              ✗ Reject
                            </button>

                            <button
                              onClick={() => deleteDonation(selectedDonation.id)}
                              style={{
                                flex: 1,
                                padding: "11px",
                                background: "#991B1B",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                              }}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "QR Code" && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e5df", padding: "1.2rem" }}>
                <h2 style={{ margin: "0 0 1rem", fontSize: 18, fontWeight: 700 }}>Payment QR Code</h2>

                {qrUrl ? (
                  <div style={{ marginBottom: 14 }}>
                    <img
                      src={qrUrl}
                      alt="Current QR"
                      style={{
                        width: isMobile ? "100%" : 220,
                        maxWidth: 240,
                        height: 220,
                        objectFit: "contain",
                        border: "1px solid #e8e5df",
                        borderRadius: 10,
                        background: "#f9f9f9",
                        display: "block",
                        marginBottom: 10,
                      }}
                    />

                    <button
                      onClick={deleteQr}
                      style={{
                        padding: "9px 16px",
                        background: "#fff",
                        color: "#E63946",
                        border: "1.5px solid #E63946",
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      🗑 Delete Current QR
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      width: isMobile ? "100%" : 220,
                      height: 220,
                      background: "#f5f4f0",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#aaa",
                      marginBottom: 14,
                      border: "1px dashed #ccc",
                    }}
                  >
                    No QR uploaded
                  </div>
                )}

                <input
                  ref={qrInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setQrFile(e.target.files[0])}
                  style={{ display: "block", marginBottom: 12, fontSize: 14, maxWidth: "100%" }}
                />

                <button
                  onClick={uploadQr}
                  disabled={!qrFile || qrUploading}
                  style={{
                    width: isMobile ? "100%" : "auto",
                    padding: "10px 20px",
                    background: qrFile && !qrUploading ? "#E63946" : "#ccc",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: qrFile && !qrUploading ? "pointer" : "not-allowed",
                  }}
                >
                  {qrUploading ? "Uploading..." : qrUrl ? "Replace QR Code" : "Upload QR Code"}
                </button>
              </div>
            </div>
          )}

          {tab === "Gallery" && (
            <div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e5df", padding: "1.2rem", marginBottom: "1.5rem" }}>
                <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700 }}>Upload Photo</h2>

                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "1rem", alignItems: isMobile ? "stretch" : "flex-end" }}>
                  <input ref={photoInputRef} type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} style={{ fontSize: 14 }} />

                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="Caption"
                    style={{
                      flex: 1,
                      padding: "9px 12px",
                      border: "1.5px solid #ddd",
                      borderRadius: 8,
                      fontSize: 14,
                    }}
                  />

                  <button
                    onClick={uploadPhoto}
                    disabled={!photoFile || photoUploading}
                    style={{
                      padding: "10px 18px",
                      background: photoFile && !photoUploading ? "#E63946" : "#ccc",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: photoFile && !photoUploading ? "pointer" : "not-allowed",
                    }}
                  >
                    {photoUploading ? "Uploading..." : "Upload Photo"}
                  </button>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e5df", padding: "1.2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Gallery ({photos.length} photos)</h2>
                  <button
                    onClick={fetchPhotos}
                    style={{ padding: "6px 12px", border: "1px solid #ddd", borderRadius: 7, background: "#fff", cursor: "pointer" }}
                  >
                    ↻ Refresh
                  </button>
                </div>

                {photos.length === 0 ? (
                  <p style={{ color: "#aaa", textAlign: "center", padding: "2rem" }}>No photos uploaded yet.</p>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(180px, 1fr))",
                      gap: 12,
                    }}
                  >
                    {photos.map((p) => (
                      <div key={p.id || p.url} style={{ borderRadius: 10, border: "1px solid #e8e5df", overflow: "hidden", background: "#f9f9f9" }}>
                        <img src={p.url} alt={p.caption || "Gallery photo"} style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />

                        <div style={{ padding: 8 }}>
                          {p.caption && <p style={{ fontSize: 12, color: "#555", margin: "0 0 8px" }}>{p.caption}</p>}

                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={() => togglePhotoVisibility(p.id, p.visible)}
                              style={{
                                flex: 1,
                                padding: "6px",
                                background: p.visible ? "#D1FAE5" : "#FEF9C3",
                                border: "none",
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: "pointer",
                                color: p.visible ? "#065F46" : "#713F12",
                              }}
                            >
                              {p.visible ? "Visible" : "Hidden"}
                            </button>

                            <button
                              onClick={() => deletePhoto(p.id)}
                              style={{
                                padding: "6px 10px",
                                background: "#FEE2E2",
                                border: "none",
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: "pointer",
                                color: "#991B1B",
                                fontWeight: 600,
                              }}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "Settings" && (
            <div style={{ maxWidth: 640 }}>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e5df", padding: "1.2rem" }}>
                <h2 style={{ margin: "0 0 1rem", fontSize: 18, fontWeight: 700 }}>Supabase Setup Guide</h2>

                {[
                  ["1. Create Supabase project", "Create project and copy URL + anon key."],
                  ["2. Create donations table", "Add donation fields and status column."],
                  ["3. Create gallery table", "Add url, caption, visible, created_at."],
                  ["4. Create settings table", "Add key and value columns. Make key unique for QR upsert."],
                  ["5. Create storage bucket", "Create public bucket named visava-assets."],
                  ["6. Enable Realtime", "Enable realtime for donations table."],
                  ["7. Delete policies", "Allow DELETE on donations and gallery for anon role if admin uses anon key."],
                ].map(([title, desc]) => (
                  <div key={title} style={{ marginBottom: 12, padding: "10px 14px", background: "#f8f6f2", borderRadius: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 3px", color: "#1a1a1a" }}>{title}</p>
                    <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
