import GlassCard from "./GlassCard";

export default function DayCard({ day, content }) {
  return (
    <GlassCard hoverLift={false}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold">Day {day}</h3>
          <div className="text-xs text-white/60 rounded-full bg-white/10 ring-1 ring-white/10 px-3 py-1">
            Plan
          </div>
        </div>
        <div className="mt-3 whitespace-pre-wrap text-white/80 leading-relaxed text-sm">
          {content}
        </div>
      </div>
    </GlassCard>
  );
}
