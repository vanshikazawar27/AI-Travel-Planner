import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";

import API from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import Toast from "../components/ui/Toast";
import { parseTripPlan } from "../utils/parseTripPlan";
import Navbar from "../components/Navbar";

export default function ShareTrip() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [sharedTrip, setSharedTrip] = useState(null);

  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  useEffect(() => {
    let alive = true;

    async function fetchShared() {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await API.get(`/trip/share/${token}`);
        if (!alive) return;

        console.log("[ShareTrip] share response", res.data);
        const savedTrip = res.data?.savedTrip || null;
        const tripPlan = savedTrip?.tripPlan;
        console.log("[ShareTrip] savedTrip.tripPlan type/len", typeof tripPlan, tripPlan?.length);
        setSharedTrip(savedTrip);

      } catch (err) {
        if (!alive) return;
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Shared link not found";
        setErrorMsg(msg);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    if (token) fetchShared();
    else {
      setLoading(false);
      setErrorMsg("Missing share token");
    }

    return () => {
      alive = false;
    };
  }, [token]);

  const itinerary = useMemo(() => {
    if (!sharedTrip) return null;

    // sharedTrip should be the SavedTrip document from backend
    // savedTrip.tripPlan appears to be the raw plan string
    // Backend SharedTrip endpoint returns { savedTrip }
    // In your case: savedTrip.tripPlan is an OBJECT, not a string.
    // Result page expects string/parsed text; for Share we must normalize.
    const tripPlan = sharedTrip.tripPlan;
    const tripPlanString =
      typeof tripPlan === "string"
        ? tripPlan
        : typeof tripPlan?.raw === "string"
          ? tripPlan.raw
          : typeof tripPlan?.tripPlan === "string"
            ? tripPlan.tripPlan
            : typeof sharedTrip?.tripPlan === "string"
              ? sharedTrip.tripPlan
              : null;

    if (!tripPlanString) {
      // fallback: render something instead of crashing
      return {
        days: [],
        raw:
          typeof tripPlan === "string"
            ? tripPlan
            : tripPlan
              ? JSON.stringify(tripPlan, null, 2)
              : "",
        metadata: "",
        destinationIntro: null,
      };
    }

    const parsed = parseTripPlan(tripPlanString);


    // If parseTripPlan can’t find days, fall back to raw
    return {
      days: parsed.days || [],
      raw: parsed.raw || tripPlan,
      metadata: parsed.metadata || "",
      destinationIntro: parsed.destinationIntro || null,
    };
  }, [sharedTrip]);

  const metadata = itinerary?.metadata || "";

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => {
      setToast((c) => ({ ...c, visible: false }));
    }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_0%,rgba(170,59,255,0.25),transparent_60%),radial-gradient(900px_500px_at_80%_10%,rgba(245,158,11,0.22),transparent_55%),linear-gradient(180deg,#0b0b10,#141427)] text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 text-white/80">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading shared trip...
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !sharedTrip) {
    return (
      <div className="min-h-screen bg-[radial-gradient(80%_80%_at_50%_0%,rgba(170,59,255,0.25),transparent_60%),linear-gradient(180deg,#0b0b10, #141427)] text-white px-6">
        <Navbar />
        <div className="max-w-3xl mx-auto pt-16 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mx-auto inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 ring-1 ring-white/15 mb-6">
              <AlertTriangle className="w-7 h-7 text-yellow-300" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Unable to open shared trip</h1>
            <p className="text-white/70">{errorMsg || "Link invalid or expired."}</p>

            <button
              onClick={() => navigate("/")}
              className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>

            <Toast
              visible={toast.visible}
              message={toast.message}
              type={toast.type}
              onClose={() => setToast((c) => ({ ...c, visible: false }))}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  const destination = sharedTrip.destination || "Trip";
  const daysCount = sharedTrip.days || "";
  const budget = sharedTrip.budget || "";
  const interest = sharedTrip.interest || "";

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_0%,rgba(170,59,255,0.25),transparent_60%),radial-gradient(900px_500px_at_80%_10%,rgba(245,158,11,0.22),transparent_55%),linear-gradient(180deg,#0b0b10,#141427)] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/10 px-4 py-2 mb-4">
            <span className="text-sm text-white/80">Shared Trip</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">{destination}</h1>
          <p className="text-white/70 mt-2">
            {daysCount ? `${daysCount} days` : ""}
            {daysCount && budget ? " • " : ""}
            {budget ? `Budget: ₹${budget}` : ""}
            {interest ? ` • Style: ${interest}` : ""}
          </p>
        </motion.div>

        {itinerary?.days?.length ? (
          <div className="space-y-4">
            {itinerary.days.map((d, idx) => (
              <motion.div
                key={`${d.day}-${idx}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard hoverLift={false}>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold">Day {d.day}</h3>
                      <div className="text-xs text-white/60 rounded-full bg-white/10 ring-1 ring-white/10 px-3 py-1">
                        Plan
                      </div>
                    </div>
                    <div className="mt-3 whitespace-pre-wrap text-white/80 leading-relaxed text-sm">
                      {d.content || d.details || ""}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}

            {metadata ? (
              <GlassCard hoverLift={false}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3">Extra recommendations</h2>
                  <pre className="whitespace-pre-wrap text-white/80 leading-relaxed text-sm">{metadata}</pre>
                </div>
              </GlassCard>
            ) : null}
          </div>
        ) : (
          <GlassCard hoverLift={false}>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3">Itinerary</h2>
              <pre className="whitespace-pre-wrap text-white/80 leading-relaxed text-sm">{itinerary?.raw || ""}</pre>
            </div>
          </GlassCard>
        )}

        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((c) => ({ ...c, visible: false }))}
        />
      </div>
    </div>
  );
}

