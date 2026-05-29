import React, { useState } from "react";
import { X, Bookmark, Share2, XCircle } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import API from "../services/api";
import Toast from "../components/ui/Toast";

function TripDetailModal({ isOpen, onClose, trip }) {
  if (!isOpen || !trip) return null;

  const { destination, days, budget, interest, tripPlan, _id, favorite: initialFav, tags: initialTags } = trip;
  const { itinerary = [], raw = "", metadata = "" } = tripPlan || {};

  const [favorite, setFavorite] = useState(initialFav);
  const [tags, setTags] = useState(initialTags || []);
  const [newTag, setNewTag] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ visible: true, message: msg, type });
    window.clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => setToast((c) => ({ ...c, visible: false })), 2500);
  };

  const metadataSections = React.useMemo(() => {
    if (!metadata) return [];
    const lines = metadata
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const headingRegex = /^(Hotel Suggestions|Hotels|Food Recommendations|Food Recommendation|Travel Tips|Budget Breakdown|Estimated Expenses|Total estimated expenses|Budget):?$/i;
    const sections = [];
    let current = { title: null, lines: [] };
    for (const line of lines) {
      const match = line.match(headingRegex);
      if (match) {
        if (current.title || current.lines.length) sections.push(current);
        current = { title: match[1], lines: [] };
        continue;
      }
      current.lines.push(line);
    }
    if (current.title || current.lines.length) sections.push(current);
    return sections;
  }, [metadata]);

  const toggleFavorite = async () => {
    try {
      const updated = await API.patch(`/trip/saved/${_id}`, { favorite: !favorite, tags });
      setFavorite(updated.data.favorite);
      showToast("Favorite status updated", "success");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update favorite", "error");
    }
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    const updatedTags = [...tags, newTag.trim()];
    try {
      const updated = await API.patch(`/trip/saved/${_id}`, { favorite, tags: updatedTags });
      setTags(updated.data.tags);
      setNewTag("");
      showToast("Tag added", "success");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to add tag", "error");
    }
  };

  const removeTag = async (removeIdx) => {
    const updatedTags = tags.filter((_, i) => i !== removeIdx);
    try {
      const updated = await API.patch(`/trip/saved/${_id}`, { favorite, tags: updatedTags });
      setTags(updated.data.tags);
      showToast("Tag removed", "success");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to remove tag", "error");
    }
  };

  const shareTrip = async () => {
    try {
      const res = await API.post("/share", { savedTripId: _id });
      const { url } = res.data;
      await navigator.clipboard.writeText(url);
      showToast("Share link copied to clipboard", "success");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to generate share link", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50" onClick={onClose}>
      <GlassCard className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 rounded-full bg-white/10 p-2 hover:bg-white/20 transition">
          <X className="w-5 h-5 text-white" />
        </button>
        {/* CSV Export */}
        <button
          onClick={async () => {
            try {
              const response = await API.get(`/trip/saved/${_id}?format=csv`, { responseType: "blob" });
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `${destination || "trip"}.csv`);
              document.body.appendChild(link);
              link.click();
              link.remove();
            } catch (err) {
              showToast("Failed to download CSV", "error");
            }
          }}
          className="absolute top-4 right-16 p-2 bg-white/10 rounded hover:bg-white/20 text-white text-xs"
        >
          CSV
        </button>
        {/* Share */}
        <button
          onClick={shareTrip}
          className="absolute top-4 right-28 p-2 bg-white/10 rounded hover:bg-white/20 text-white text-xs"
          title="Generate share link"
        >
          <Share2 className="w-4 h-4" />
        </button>
        {/* Favorite */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-40 p-2 bg-white/10 rounded hover:bg-white/20 text-white"
          title="Toggle favorite"
        >
          <Bookmark className={`w-5 h-5 ${favorite ? "text-yellow-300" : "text-white"}`} />
        </button>
        {/* Tags */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-xs text-white">
              {tag}
              <XCircle className="w-3 h-3 cursor-pointer" onClick={() => removeTag(idx)} />
            </span>
          ))}
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag"
            className="rounded bg-white/10 px-2 py-0.5 text-xs text-white placeholder:text-white/50 focus:outline-none"
          />
          <button onClick={addTag} className="text-xs text-white underline">Add</button>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{destination} – {days} days</h2>
          <p className="text-sm text-white/70 mb-4">Budget: ₹{budget} • Style: {interest}</p>
          {/* Itinerary */}
          {(itinerary.length > 0 ? itinerary : [{ day: 1, content: raw }]).map((day, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Day {day.day}</h3>
              <pre className="whitespace-pre-wrap text-white/80 text-sm leading-relaxed">{day.content}</pre>
            </div>
          ))}
          {/* Metadata */}
          {metadataSections.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-3">Extra Recommendations</h3>
              {metadataSections.map((section, sIdx) => (
                <div key={sIdx} className="mb-4">
                  {section.title && (
                    <h4 className="text-lg font-semibold mb-1 text-white/90">{section.title}</h4>
                  )}
                  {section.lines.map((line, lIdx) => (
                    <p key={lIdx} className="text-sm text-white/80">{line}</p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <Toast visible={toast.visible} message={toast.message} type={toast.type} onClose={() => setToast((c) => ({ ...c, visible: false }))} />
      </GlassCard>
    </div>
  );
}

export default TripDetailModal;
