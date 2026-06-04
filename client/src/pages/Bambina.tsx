import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// ============ CONSTANTS ============
const DUE_DATE = new Date("2026-10-11T00:00:00");
const DUE_DATE_MS = DUE_DATE.getTime();
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const CONCEPTION_MS = DUE_DATE_MS - 40 * WEEK_MS; // Jan 4, 2026
const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/bambina-hero_a1c2cc71.jpeg";

function getCurrentWeek(): number {
  const now = Date.now();
  const weeksSinceConception = Math.floor((now - CONCEPTION_MS) / WEEK_MS);
  return Math.max(0, Math.min(40, weeksSinceConception));
}

function getWeekDateRange(week: number): { start: string; end: string } {
  const startMs = CONCEPTION_MS + week * WEEK_MS;
  const endMs = startMs + WEEK_MS - 1;
  const fmt = (ms: number) => new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return { start: fmt(startMs), end: fmt(endMs) };
}

function getDaysUntilDue(): number {
  return Math.max(0, Math.ceil((DUE_DATE_MS - Date.now()) / (24 * 60 * 60 * 1000)));
}

function getWeeksUntilDue(): number {
  return Math.max(0, Math.ceil((DUE_DATE_MS - Date.now()) / WEEK_MS));
}

// ============ NAVIGATION ============
type TabId = "countdown" | "timeline" | "payments" | "shopping" | "contacts" | "notes";

function StickyNav({ activeTab, onTabChange }: { activeTab: TabId; onTabChange: (t: TabId) => void }) {
  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "countdown", label: "Countdown", icon: "◇" },
    { id: "timeline", label: "Timeline", icon: "◉" },
    { id: "payments", label: "Payments", icon: "◫" },
    { id: "shopping", label: "To Buy", icon: "☐" },
    { id: "contacts", label: "Contacts", icon: "☺" },
    { id: "notes", label: "Notes", icon: "◪" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-2 md:px-4 flex items-center h-14">
        <span className="font-playfair text-sm font-semibold text-deep-teal mr-6 hidden md:block">
          🌵 Ben & Fed's Mexico Adventure
        </span>
        <div className="flex gap-0.5 md:gap-1 flex-1 justify-center md:justify-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`font-nunito text-[11px] md:text-sm px-1.5 md:px-3 py-1 md:py-1.5 rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-terracotta text-white font-medium"
                  : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
              }`}
            >
              <span className="hidden md:inline mr-1">{tab.icon}</span>
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ============ HERO BANNER ============
function HeroBanner() {
  return (
    <div className="relative h-32 md:h-56 overflow-hidden">
      {/* Mexican tile top border */}
      <div className="absolute top-0 left-0 right-0 h-4 z-10 bg-[repeating-linear-gradient(90deg,#C2703E_0px,#C2703E_20px,#1B5E5E_20px,#1B5E5E_40px,#D4845A_40px,#D4845A_60px,#8B4513_60px,#8B4513_80px)]" />
      <img
        src={HERO_IMAGE}
        alt="Mexican street at sunset"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-4">
        <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
          Ben & Fed's<br />Mexico Adventure
        </h1>

      </div>
      {/* Mexican tile bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(90deg,#1B5E5E_0px,#1B5E5E_20px,#C2703E_20px,#C2703E_40px,#D4845A_40px,#D4845A_60px,#8B4513_60px,#8B4513_80px)]" />
    </div>
  );
}

// ============ PAPEL PICADO ============
function PapelPicado() {
  return (
    <div className="flex justify-center py-4">
      <div className="flex gap-1">
        {["🏵️", "🌸", "🌺", "🌼", "🏵️", "🌸", "🌺"].map((flower, i) => (
          <span key={i} className="text-lg opacity-70">{flower}</span>
        ))}
      </div>
    </div>
  );
}

// ============ PROGRESS CARD ============
function ProgressCard() {
  const currentWeek = getCurrentWeek();
  const weeksLeft = getWeeksUntilDue();
  const daysLeft = getDaysUntilDue();
  const progress = Math.min(100, (currentWeek / 40) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-nunito text-xs text-stone-400 uppercase tracking-wider">Currently</p>
            <p className="font-playfair text-xl font-bold text-stone-800">Week {currentWeek} of pregnancy</p>
          </div>
          <div className="text-right">
            <p className="font-nunito text-xs text-stone-400 uppercase tracking-wider">Until due date</p>
            <p className="font-playfair text-xl font-bold text-terracotta">{weeksLeft} weeks ({daysLeft} days)</p>
          </div>
        </div>
        <div className="relative">
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-deep-teal to-terracotta rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-nunito text-xs text-stone-400">Conception</span>
            <span className="font-nunito text-xs text-stone-400">Oct 11</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ COUNTDOWN COMPONENT ============
function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <p className="font-nunito text-sm uppercase tracking-[0.3em] text-terracotta mb-6">
        Meet your bambina in...
      </p>
      <div className="flex justify-center gap-4 md:gap-8">
        {[
          { value: timeLeft.days, label: "Days" },
          { value: timeLeft.hours, label: "Hours" },
          { value: timeLeft.minutes, label: "Minutes" },
          { value: timeLeft.seconds, label: "Seconds" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <span className="font-playfair text-4xl md:text-6xl font-bold text-deep-teal">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="font-nunito text-xs uppercase tracking-wider text-terracotta/70 mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <p className="font-nunito text-sm text-stone-500 mt-8">
        October 11, 2026 — Hospital Español, Polanco, Mexico City
      </p>
    </div>
  );
}

function getTimeLeft() {
  const diff = DUE_DATE_MS - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// ============ WEEK-BY-WEEK TIMELINE ============
function WeekTimeline() {
  const { data: items = [], refetch } = trpc.bambina.checklist.getAll.useQuery();
  const { isAuthenticated } = useAuth();
  const toggleMutation = trpc.bambina.checklist.toggle.useMutation({ onSuccess: () => refetch() });
  const updateNotesMutation = trpc.bambina.checklist.updateNotes.useMutation({ onSuccess: () => refetch() });
  const snoozeMutation = trpc.bambina.checklist.snooze.useMutation({ onSuccess: () => refetch() });
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  const currentWeek = getCurrentWeek();

  // Group items by week (using dueWeek, or assign pre_pregnancy to week 0, post_birth to week 41+)
  const weekGroups = useMemo(() => {
    const groups: Record<number, typeof items> = {};

    items.forEach((item) => {
      let week: number;
      if (item.dueWeek) {
        week = item.dueWeek + (item.snoozedWeeks || 0);
      } else if (item.phase === "pre_pregnancy") {
        week = 0;
      } else if (item.phase === "post_birth") {
        week = 41;
      } else {
        week = 0;
      }
      if (!groups[week]) groups[week] = [];
      groups[week].push(item);
    });

    return groups;
  }, [items]);

  // Find the nearest week that has items (current or most recent past week with items)
  const activeWeek = useMemo(() => {
    const weeksWithItems = Object.keys(weekGroups).map(Number).sort((a, b) => a - b);
    let nearest = weeksWithItems[0] || 0;
    for (const w of weeksWithItems) {
      if (w <= currentWeek) nearest = w;
      else break;
    }
    return nearest;
  }, [weekGroups, currentWeek]);

  // All sections collapsed by default — user expands manually

  const sortedWeeks = useMemo(() => {
    return Object.keys(weekGroups).map(Number).sort((a, b) => a - b);
  }, [weekGroups]);

  const toggleWeek = useCallback((week: number) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  }, []);

  const getWeekLabel = (week: number): string => {
    if (week === 0) return "Pre-Pregnancy";
    if (week === 41) return "Post-Birth";
    return `Week ${week}`;
  };

  const getWeekDates = (week: number): string => {
    if (week === 0) return "Before conception";
    if (week === 41) return "After Oct 11";
    const { start, end } = getWeekDateRange(week);
    return `${start} – ${end}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">📋</span>
        <div>
          <h2 className="font-playfair text-2xl font-bold text-stone-800">Week-by-Week Plan</h2>
          <p className="font-nunito text-sm text-stone-500">Your single source of truth — tick off tasks as you go</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-stone-200" />

        {sortedWeeks.map((week) => {
          const weekItems = weekGroups[week];
          const isCurrentWeek = week === activeWeek;
          const isPast = week < currentWeek;
          const isExpanded = expandedWeeks.has(week);
          const completedCount = weekItems.filter((i) => i.completed).length;
          const totalCount = weekItems.length;

          return (
            <div key={week} className="relative mb-4">
              {/* Dot on timeline */}
              <div
                className={`absolute left-2.5 top-4 w-3 h-3 rounded-full border-2 z-10 ${
                  isCurrentWeek
                    ? "bg-terracotta border-terracotta"
                    : isPast
                    ? "bg-deep-teal border-deep-teal"
                    : "bg-white border-stone-300"
                }`}
              />

              {/* Week header */}
              <div className="ml-10">
                <button
                  onClick={() => toggleWeek(week)}
                  className="w-full flex items-center justify-between py-3 text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs transition-transform ${isExpanded ? "rotate-90" : ""}`}>›</span>
                    <span className={`font-nunito font-bold text-sm ${isCurrentWeek ? "text-terracotta" : "text-stone-700"}`}>
                      {getWeekLabel(week)}
                    </span>
                    {isCurrentWeek && (
                      <span className="bg-terracotta text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Now
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-nunito text-[10px] sm:text-xs text-stone-400">{getWeekDates(week)}</span>
                    <span className={`font-nunito text-xs font-medium px-2 py-0.5 rounded-full ${
                      completedCount === totalCount && totalCount > 0
                        ? "bg-deep-teal/10 text-deep-teal"
                        : "bg-terracotta/10 text-terracotta"
                    }`}>
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                </button>

                {/* Expanded items */}
                {isExpanded && (
                  <div className="space-y-2 pb-4">
                    {weekItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border-l-4 bg-white border border-stone-100 shadow-sm transition-all ${
                          item.completed
                            ? "border-l-deep-teal/40 opacity-60"
                            : isCurrentWeek
                            ? "border-l-terracotta"
                            : "border-l-stone-300"
                        }`}
                      >
                        <Checkbox
                          checked={!!item.completed}
                          disabled={!isAuthenticated}
                          onCheckedChange={(checked) => {
                            toggleMutation.mutate({ id: item.id, completed: !!checked });
                          }}
                          className="mt-0.5 border-stone-300 data-[state=checked]:bg-deep-teal data-[state=checked]:border-deep-teal"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`font-nunito text-sm ${item.completed ? "line-through text-stone-400" : "text-stone-700"}`}>
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="font-nunito text-xs text-stone-400 mt-0.5">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[10px] font-nunito font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              item.category === "medical" ? "bg-blue-50 text-blue-600" :
                              item.category === "legal" ? "bg-purple-50 text-purple-600" :
                              item.category === "travel" ? "bg-green-50 text-green-600" :
                              item.category === "agency" ? "bg-orange-50 text-orange-600" :
                              item.category === "nursery" ? "bg-pink-50 text-pink-600" :
                              item.category === "financial" ? "bg-yellow-50 text-yellow-700" :
                              "bg-stone-50 text-stone-500"
                            }`}>
                              {item.category}
                            </span>
                            {item.snoozedWeeks > 0 && (
                              <span className="text-[10px] font-nunito text-amber-600">⏰ Snoozed {item.snoozedWeeks}w</span>
                            )}
                          </div>
                          {item.notes && editingNotes !== item.id && (
                            <p className="font-nunito text-xs text-stone-500 mt-2 italic border-l-2 border-terracotta/20 pl-2">
                              {item.notes}
                            </p>
                          )}
                          {editingNotes === item.id && (
                            <div className="mt-2 flex gap-2">
                              <Textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="text-xs font-nunito"
                                rows={2}
                              />
                              <Button
                                size="sm"
                                onClick={() => {
                                  updateNotesMutation.mutate({ id: item.id, notes: noteText });
                                  setEditingNotes(null);
                                }}
                                className="bg-deep-teal hover:bg-deep-teal/90 text-xs"
                              >
                                Save
                              </Button>
                            </div>
                          )}
                        </div>
                        {isAuthenticated && (
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => { setEditingNotes(item.id); setNoteText(item.notes || ""); }}
                              className="text-stone-300 hover:text-terracotta transition-colors text-xs"
                              title="Add note"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => {
                                snoozeMutation.mutate({ id: item.id, weeks: (item.snoozedWeeks || 0) + 1 });
                                toast.info("Snoozed for 1 more week");
                              }}
                              className="text-stone-300 hover:text-amber-600 transition-colors text-xs"
                              title="Snooze 1 week"
                            >
                              ⏰
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <p className="font-nunito text-stone-400 text-center py-8">Loading timeline...</p>
      )}
    </div>
  );
}

// ============ PAYMENTS COMPONENT ============
function getPaymentMonthDate(dueMonth: string): string | null {
  // Map payment schedule months to approximate calendar dates based on pregnancy weeks
  // Due date: Oct 11, 2026 = Week 40. Conception: Jan 4, 2026.
  const weekDateMap: Record<string, string> = {
    "Month 1 - IP Onboarding": "Aug 2025",
    "Month 2-3 - Embryo Transport": "Sep–Oct 2025",
    "Month 4 - Surrogate Match": "Nov 2025",
    "Month 5 - Embryo Transfer Prep": "Dec 2025",
    "Month 6 - Embryo Transfer": "Jan 2026",
    "Month 8 - Beta+": "Mar 2026",
    "Month 9 - 12 Week Gestation": "Mar–Apr 2026",
    "Month 10 - 16 Weeks": "Apr 2026",
    "Month 11 - 20 Weeks": "May–Jun 2026",
    "Month 12 - 24 Weeks": "Jun 2026",
    "Month 13 - 28 Weeks": "Jul 2026",
    "Month 14-15 - 32-36 Weeks": "Aug–Sep 2026",
    "Month 16 - Birth (40 Weeks)": "Oct 2026",
    "Month 17-18 - Post Birth": "Oct–Nov 2026",
  };
  return weekDateMap[dueMonth] || null;
}

function Payments() {
  const { data: payments = [], refetch } = trpc.bambina.payments.getAll.useQuery();
  const { isAuthenticated } = useAuth();
  const toggleMutation = trpc.bambina.payments.toggle.useMutation({ onSuccess: () => refetch() });
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  const toggleMonth = useCallback((month: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  }, []);

  const grouped = useMemo(() => {
    const g: Record<string, typeof payments> = {};
    payments.forEach((p) => {
      const key = p.dueMonth || "Other";
      if (!g[key]) g[key] = [];
      g[key].push(p);
    });
    return g;
  }, [payments]);

  const totalsByStatus = useMemo(() => {
    const paid = payments.filter((p) => p.paid);
    const unpaid = payments.filter((p) => !p.paid);
    return { paid: paid.length, unpaid: unpaid.length, total: payments.length };
  }, [payments]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">💰</span>
        <h2 className="font-playfair text-2xl font-bold text-stone-800">Payments</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-4 rounded-xl bg-white border border-stone-100 shadow-sm">
          <p className="font-playfair text-2xl font-bold text-deep-teal">{totalsByStatus.paid}</p>
          <p className="font-nunito text-xs text-stone-500">Paid</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-white border border-stone-100 shadow-sm">
          <p className="font-playfair text-2xl font-bold text-terracotta">{totalsByStatus.unpaid}</p>
          <p className="font-nunito text-xs text-stone-500">Remaining</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-white border border-stone-100 shadow-sm">
          <p className="font-playfair text-2xl font-bold text-stone-600">{totalsByStatus.total}</p>
          <p className="font-nunito text-xs text-stone-500">Total</p>
        </div>
      </div>

      {Object.entries(grouped).map(([month, monthPayments]) => {
        const isExpanded = expandedMonths.has(month);
        const paidCount = monthPayments.filter((p) => p.paid).length;
        return (
          <div key={month}>
            <button
              onClick={() => toggleMonth(month)}
              className="w-full flex items-center justify-between border-b border-stone-100 pb-2 mb-3 group"
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs transition-transform ${isExpanded ? "rotate-90" : ""}`}>›</span>
                <div>
                  <h3 className="font-playfair text-base sm:text-lg font-semibold text-deep-teal">
                    {month}
                  </h3>
                  {getPaymentMonthDate(month) && (
                    <p className="font-nunito text-[10px] sm:text-xs text-stone-400 mt-0.5">
                      {getPaymentMonthDate(month)}
                    </p>
                  )}
                </div>
              </div>
              <span className={`font-nunito text-xs font-medium px-2 py-0.5 rounded-full ${
                paidCount === monthPayments.length
                  ? "bg-deep-teal/10 text-deep-teal"
                  : "bg-terracotta/10 text-terracotta"
              }`}>
                {paidCount}/{monthPayments.length}
              </span>
            </button>
            {isExpanded && (
              <div className="space-y-2">
                {monthPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className={`flex items-center gap-3 p-3 rounded-lg bg-white border border-stone-100 shadow-sm ${
                      payment.paid ? "opacity-60" : ""
                    }`}
                  >
                    <Checkbox
                      checked={!!payment.paid}
                      disabled={!isAuthenticated}
                      onCheckedChange={(checked) => {
                        toggleMutation.mutate({ id: payment.id, paid: !!checked });
                      }}
                      className="border-stone-300 data-[state=checked]:bg-deep-teal data-[state=checked]:border-deep-teal"
                    />
                    <div className="flex-1">
                      <p className={`font-nunito text-sm ${payment.paid ? "line-through text-stone-400" : "text-stone-700"}`}>
                        {payment.description}
                      </p>
                      <span className="text-[10px] font-nunito uppercase tracking-wider text-stone-400">
                        {payment.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className={`font-nunito font-semibold text-sm ${payment.paid ? "text-stone-400" : "text-deep-teal"}`}>
                        {payment.amount}
                      </p>
                      <p className="font-nunito text-[10px] text-stone-400">{payment.currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============ SHOPPING LIST COMPONENT ============
function ShoppingList() {
  const { data: items = [], refetch } = trpc.bambina.shopping.getAll.useQuery();
  const { isAuthenticated } = useAuth();
  const toggleMutation = trpc.bambina.shopping.toggle.useMutation({ onSuccess: () => refetch() });

  const grouped = useMemo(() => {
    const g: Record<string, typeof items> = {};
    items.forEach((item) => {
      if (!g[item.category]) g[item.category] = [];
      g[item.category].push(item);
    });
    return g;
  }, [items]);

  const progress = useMemo(() => {
    const purchased = items.filter((i) => i.purchased).length;
    return { purchased, total: items.length, pct: items.length ? Math.round((purchased / items.length) * 100) : 0 };
  }, [items]);

  const categoryLabels: Record<string, string> = {
    feeding: "🍼 Bottle Feeding",
    sleeping: "😴 Sleeping",
    nappies: "👶 Nappies",
    clothing: "👕 Baby Clothing",
    bathing: "🛁 Bathing",
    health: "🏥 Health & Safety",
    travel: "🚗 Travel & On-the-Go",
    expressing: "🤱 Expressing Equipment",
    miscellaneous: "📦 Miscellaneous",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">🛒</span>
        <h2 className="font-playfair text-2xl font-bold text-stone-800">To Buy</h2>
      </div>

      <div className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="font-nunito text-sm text-stone-600">Shopping Progress</span>
          <span className="font-nunito text-sm font-semibold text-deep-teal">{progress.pct}%</span>
        </div>
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-terracotta to-burnt-orange rounded-full transition-all duration-500"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        <p className="font-nunito text-xs text-stone-400 mt-1">
          {progress.purchased} of {progress.total} items purchased
        </p>
      </div>

      {Object.entries(grouped).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="font-playfair text-lg font-semibold text-deep-teal mb-3">
            {categoryLabels[category] || category}
          </h3>
          <div className="space-y-2">
            {categoryItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg bg-white border border-stone-100 shadow-sm ${
                  item.purchased ? "opacity-60" : ""
                }`}
              >
                <Checkbox
                  checked={!!item.purchased}
                  disabled={!isAuthenticated}
                  onCheckedChange={(checked) => {
                    toggleMutation.mutate({ id: item.id, purchased: !!checked });
                  }}
                  className="border-stone-300 data-[state=checked]:bg-deep-teal data-[state=checked]:border-deep-teal"
                />
                <div className="flex-1">
                  <p className={`font-nunito text-sm ${item.purchased ? "line-through text-stone-400" : "text-stone-700"}`}>
                    {item.title}
                  </p>
                  {item.notes && (
                    <p className="font-nunito text-xs text-stone-400 mt-0.5">{item.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ CONTACTS COMPONENT ============
function Contacts() {
  const contacts = [
    {
      name: "Sophie Smith",
      role: "Senior Member Experience Manager, EMEA & APAC",
      org: "My Surrogacy Journey",
      email: "sophie@mysurrogacyjourney.com",
      phone: "+44 7852 657146",
      address: "Office 2 & 3, 6th Floor, Runway East, Arca, Temple Row, Birmingham B2 5AF",
    },
    {
      name: "Deborah Ngolo",
      role: "Legal / Admin Contact",
      org: "My Surrogacy Journey",
      email: "",
      phone: "",
      address: "",
    },
    {
      name: "Dr. Victor",
      role: "Obstetrics Lead",
      org: "Hospital Español",
      email: "",
      phone: "",
      address: "Polanco, Mexico City",
    },
    {
      name: "Hospital Español",
      role: "Birthing Hospital",
      org: "",
      email: "",
      phone: "",
      address: "Av. Ejército Nacional Mexicano 613, Granada, Miguel Hidalgo, 11520 Ciudad de México",
    },
    {
      name: "Ariadna Rodríguez Luna",
      role: "Surrogate",
      org: "",
      email: "",
      phone: "",
      address: "Mexico City",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">📇</span>
        <h2 className="font-playfair text-2xl font-bold text-stone-800">Contacts</h2>
      </div>
      {contacts.map((contact, i) => (
        <div key={i} className="p-5 rounded-xl bg-white border border-stone-100 shadow-sm hover:border-terracotta/30 transition-colors">
          <h3 className="font-playfair text-lg font-semibold text-deep-teal">{contact.name}</h3>
          <p className="font-nunito text-sm text-terracotta">{contact.role}</p>
          {contact.org && <p className="font-nunito text-sm text-stone-500">{contact.org}</p>}
          <div className="mt-3 space-y-1">
            {contact.email && (
              <p className="font-nunito text-sm text-stone-600">
                ✉️ <a href={`mailto:${contact.email}`} className="hover:text-deep-teal underline">{contact.email}</a>
              </p>
            )}
            {contact.phone && (
              <p className="font-nunito text-sm text-stone-600">
                📞 <a href={`tel:${contact.phone}`} className="hover:text-deep-teal">{contact.phone}</a>
              </p>
            )}
            {contact.address && (
              <p className="font-nunito text-sm text-stone-400">📍 {contact.address}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ NOTES COMPONENT ============
function Notes() {
  const { data: notes = [], refetch } = trpc.bambina.notes.getAll.useQuery();
  const { isAuthenticated } = useAuth();
  const createMutation = trpc.bambina.notes.create.useMutation({ onSuccess: () => { refetch(); setNewNote({ category: "general", title: "", content: "" }); setShowForm(false); toast.success("Note saved"); } });
  const deleteMutation = trpc.bambina.notes.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Note deleted"); } });
  const [newNote, setNewNote] = useState({ category: "general", title: "", content: "" });
  const [showForm, setShowForm] = useState(false);

  const categories = ["general", "medical", "travel", "legal", "questions", "shopping"];

  const grouped = useMemo(() => {
    const g: Record<string, typeof notes> = {};
    notes.forEach((n) => {
      if (!g[n.category]) g[n.category] = [];
      g[n.category].push(n);
    });
    return g;
  }, [notes]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">📝</span>
        <h2 className="font-playfair text-2xl font-bold text-stone-800">Notes</h2>
      </div>

      {isAuthenticated && (
        <div>
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-deep-teal hover:bg-deep-teal/90 font-nunito"
            >
              + Add Note
            </Button>
          ) : (
            <div className="p-4 rounded-xl bg-white border border-stone-100 shadow-sm space-y-3">
              <div className="flex gap-3">
                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                  className="font-nunito text-sm border border-stone-200 rounded-md px-3 py-2 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
                <Input
                  placeholder="Title (optional)"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="font-nunito"
                />
              </div>
              <Textarea
                placeholder="Write your note..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="font-nunito"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (!newNote.content.trim()) { toast.error("Note content is required"); return; }
                    createMutation.mutate(newNote);
                  }}
                  className="bg-deep-teal hover:bg-deep-teal/90 font-nunito"
                  disabled={createMutation.isPending}
                >
                  Save Note
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="font-nunito">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {Object.entries(grouped).map(([category, categoryNotes]) => (
        <div key={category}>
          <h3 className="font-playfair text-lg font-semibold text-deep-teal mb-3 capitalize">
            {category}
          </h3>
          <div className="space-y-3">
            {categoryNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-xl bg-white border border-stone-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    {note.title && (
                      <h4 className="font-nunito font-semibold text-stone-700">{note.title}</h4>
                    )}
                    <p className="font-nunito text-sm text-stone-600 whitespace-pre-wrap">{note.content}</p>
                    <p className="font-nunito text-xs text-stone-400 mt-2">
                      {new Date(note.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        if (confirm("Delete this note?")) deleteMutation.mutate({ id: note.id });
                      }}
                      className="text-stone-400 hover:text-red-500 transition-colors text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {notes.length === 0 && !showForm && (
        <p className="font-nunito text-stone-400 text-center py-8">No notes yet. Add your first note above.</p>
      )}
    </div>
  );
}

// ============ RESOURCES FOOTER ============
function Resources() {
  const links = [
    { label: "My Surrogacy Journey", url: "https://www.mysurrogacyjourney.com" },
    { label: "Hospital Español", url: "https://www.hespanol.com" },
    { label: "Mindful Surrogacy MX", url: "https://www.mindfulbirth.co.uk" },
    { label: "NHS - Surrogacy", url: "https://www.nhs.uk/pregnancy/having-a-baby-if-you-are-lgbt-plus/surrogacy/" },
    { label: "Polanco Neighbourhood Guide", url: "https://www.timeout.com/mexico-city/neighborhoods/polanco" },
    { label: "Liverpool Mexico (Baby Store)", url: "https://www.liverpool.com.mx" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 mt-8 border-t border-stone-200">
      <h3 className="font-playfair text-lg font-semibold text-deep-teal mb-4 text-center">
        Helpful Resources
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-nunito text-sm text-stone-600 hover:text-deep-teal transition-colors p-3 rounded-lg bg-white border border-stone-100 hover:border-terracotta/30 text-center shadow-sm"
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}

// ============ MAIN BAMBINA PAGE ============
export default function Bambina() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("countdown");
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    // Scroll content into view after tab switch (especially important on mobile)
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <StickyNav activeTab={activeTab} onTabChange={handleTabChange} />
      <HeroBanner />

      {/* Auth status - compact */}
      <div className="text-center py-1">
        {!isAuthenticated && (
          <a
            href={getLoginUrl()}
            className="font-nunito text-xs text-terracotta hover:text-burnt-orange underline transition-colors"
          >
            Sign in to edit & sync →
          </a>
        )}
        {isAuthenticated && user && (
          <p className="font-nunito text-xs text-stone-400">
            Signed in as {user.name || user.email || "User"} ✓
          </p>
        )}
      </div>

      {/* Progress card only on timeline/countdown tabs */}
      {(activeTab === "timeline" || activeTab === "countdown") && <ProgressCard />}

      {/* Tab Content */}
      <div ref={contentRef} className="scroll-mt-16">
      {activeTab === "countdown" && <Countdown />}
      {activeTab === "timeline" && <WeekTimeline />}
      {activeTab === "payments" && <Payments />}
      {activeTab === "shopping" && <ShoppingList />}
      {activeTab === "contacts" && <Contacts />}
      {activeTab === "notes" && <Notes />}
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="font-nunito text-xs text-stone-400">
          Made with love for our bambina 🇲🇽 🇬🇧 🇮🇹
        </p>
      </div>

      {/* Bottom tile border */}
      <div className="h-4 bg-[repeating-linear-gradient(90deg,#C2703E_0px,#C2703E_20px,#1B5E5E_20px,#1B5E5E_40px,#D4845A_40px,#D4845A_60px,#8B4513_60px,#8B4513_80px)]" />
    </div>
  );
}
