import { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// ============ LANGUAGE / i18n ============
type Lang = "en" | "it";
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });
function useLang() { return useContext(LangContext); }

const t: Record<string, Record<Lang, string>> = {
  // Nav tabs
  "tab.countdown": { en: "Countdown", it: "Conto alla rovescia" },
  "tab.timeline": { en: "Timeline", it: "Cronologia" },
  "tab.payments": { en: "Payments", it: "Pagamenti" },
  "tab.shopping": { en: "To Buy", it: "Da comprare" },
  "tab.contacts": { en: "Contacts", it: "Contatti" },
  "tab.notes": { en: "Notes", it: "Note" },
  // Hero
  "hero.title1": { en: "Ben & Fed's", it: "L'avventura messicana" },
  "hero.title2": { en: "Mexico Adventure", it: "di Ben & Fed" },
  // Countdown
  "countdown.intro": { en: "We'll meet bambina in...", it: "Incontreremo la bambina tra..." },
  "countdown.days": { en: "Days", it: "Giorni" },
  "countdown.hours": { en: "Hours", it: "Ore" },
  "countdown.minutes": { en: "Minutes", it: "Minuti" },
  "countdown.seconds": { en: "Seconds", it: "Secondi" },
  // Progress card
  "progress.currently": { en: "Currently", it: "Attualmente" },
  "progress.weekOf": { en: "of pregnancy", it: "di gravidanza" },
  "progress.untilDue": { en: "Until due date", it: "Alla data prevista" },
  "progress.weeks": { en: "weeks", it: "settimane" },
  "progress.days": { en: "days", it: "giorni" },
  "progress.conception": { en: "Conception", it: "Concepimento" },
  // Timeline
  "timeline.title": { en: "Week-by-Week Plan", it: "Piano settimana per settimana" },
  "timeline.subtitle": { en: "Tick off tasks as you go", it: "Spunta le attività man mano" },
  "timeline.prePregnancy": { en: "Pre-Pregnancy", it: "Pre-gravidanza" },
  "timeline.postBirth": { en: "Post-Birth", it: "Post-nascita" },
  "timeline.week": { en: "Week", it: "Settimana" },
  "timeline.now": { en: "Now", it: "Ora" },
  "timeline.beforeConception": { en: "Before conception", it: "Prima del concepimento" },
  "timeline.afterOct": { en: "After Oct 11", it: "Dopo l'11 ott" },
  "timeline.loading": { en: "Loading timeline...", it: "Caricamento cronologia..." },
  "timeline.snoozed": { en: "Snoozed", it: "Posticipato" },
  "timeline.save": { en: "Save", it: "Salva" },
  // Payments
  "payments.title": { en: "Payments", it: "Pagamenti" },
  // Shopping
  "shopping.title": { en: "To Buy", it: "Da comprare" },
  "shopping.progress": { en: "Shopping Progress", it: "Progresso acquisti" },
  "shopping.itemsOf": { en: "of", it: "di" },
  "shopping.itemsPurchased": { en: "items purchased", it: "articoli acquistati" },
  "shopping.feeding": { en: "\ud83c\udf7c Bottle Feeding", it: "\ud83c\udf7c Allattamento con biberon" },
  "shopping.sleeping": { en: "\ud83d\ude34 Sleeping", it: "\ud83d\ude34 Nanna" },
  "shopping.nappies": { en: "\ud83d\udc76 Nappies", it: "\ud83d\udc76 Pannolini" },
  "shopping.clothing": { en: "\ud83d\udc55 Baby Clothing", it: "\ud83d\udc55 Abbigliamento neonato" },
  "shopping.bathing": { en: "\ud83d\udec1 Bathing", it: "\ud83d\udec1 Bagnetto" },
  "shopping.health": { en: "\ud83c\udfe5 Health & Safety", it: "\ud83c\udfe5 Salute e sicurezza" },
  "shopping.travel": { en: "\ud83d\ude97 Travel & On-the-Go", it: "\ud83d\ude97 Viaggio e passeggiate" },
  "shopping.expressing": { en: "\ud83e\udd31 Expressing Equipment", it: "\ud83e\udd31 Attrezzatura per tiralatte" },
  "shopping.miscellaneous": { en: "\ud83d\udce6 Miscellaneous", it: "\ud83d\udce6 Varie" },
  // Contacts
  "contacts.title": { en: "Contacts", it: "Contatti" },
  // Notes
  "notes.title": { en: "Notes", it: "Note" },
  "notes.addNote": { en: "+ Add Note", it: "+ Aggiungi nota" },
  "notes.titlePlaceholder": { en: "Title (optional)", it: "Titolo (opzionale)" },
  "notes.contentPlaceholder": { en: "Write your note...", it: "Scrivi la tua nota..." },
  "notes.save": { en: "Save Note", it: "Salva nota" },
  "notes.cancel": { en: "Cancel", it: "Annulla" },
  "notes.empty": { en: "No notes yet. Add your first note above.", it: "Nessuna nota ancora. Aggiungi la tua prima nota sopra." },
  "notes.deleteConfirm": { en: "Delete this note?", it: "Eliminare questa nota?" },
  "notes.contentRequired": { en: "Note content is required", it: "Il contenuto della nota è obbligatorio" },
  // Auth
  "auth.signIn": { en: "Sign in to edit & sync →", it: "Accedi per modificare e sincronizzare →" },
  "auth.signedAs": { en: "Signed in as", it: "Connesso come" },
  // Resources
  "resources.title": { en: "Helpful Resources", it: "Risorse utili" },
  // Guide
  "tab.guide": { en: "Guide", it: "Guida" },
  "guide.title": { en: "Newborn Care Guide", it: "Guida alla cura del neonato" },
  "guide.subtitle": { en: "Essential tips for the first 3 months", it: "Consigli essenziali per i primi 3 mesi" },
  "guide.feeding": { en: "Feeding", it: "Alimentazione" },
  "guide.sleep": { en: "Sleep", it: "Sonno" },
  "guide.bathing": { en: "Bathing & Hygiene", it: "Bagnetto e igiene" },
  "guide.nappies": { en: "Nappy Changing", it: "Cambio pannolino" },
  "guide.soothing": { en: "Soothing & Crying", it: "Calmare il pianto" },
  "guide.health": { en: "Health & Safety", it: "Salute e sicurezza" },
  "guide.milestones": { en: "Milestones (0-3 months)", it: "Tappe di sviluppo (0-3 mesi)" },
  "guide.bonding": { en: "Bonding & Wellbeing", it: "Legame e benessere" },
  "guide.emergency": { en: "When to Call the Doctor", it: "Quando chiamare il medico" },
  // Footer
  "footer.text": { en: "Made with love for our bambina", it: "Fatto con amore per la nostra bambina" },
};

function T({ k }: { k: string }) {
  const { lang } = useLang();
  return <>{t[k]?.[lang] || t[k]?.en || k}</>;
}

function useT(k: string): string {
  const { lang } = useLang();
  return t[k]?.[lang] || t[k]?.en || k;
}

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
type TabId = "countdown" | "timeline" | "payments" | "shopping" | "contacts" | "notes" | "guide";

function StickyNav({ activeTab, onTabChange }: { activeTab: TabId; onTabChange: (t: TabId) => void }) {
  const { lang } = useLang();
  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "countdown", label: useT("tab.countdown"), icon: "◇" },
    { id: "timeline", label: useT("tab.timeline"), icon: "◉" },
    { id: "payments", label: useT("tab.payments"), icon: "◫" },
    { id: "shopping", label: useT("tab.shopping"), icon: "☐" },
    { id: "contacts", label: useT("tab.contacts"), icon: "☺" },
    { id: "notes", label: useT("tab.notes"), icon: "◪" },
    { id: "guide", label: useT("tab.guide"), icon: "♡" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-2 md:px-4 flex items-center h-12 md:h-14">
        <span className="font-playfair text-sm font-semibold text-deep-teal mr-3 hidden md:block">
          🌵 <T k="hero.title1" /> <T k="hero.title2" />
        </span>
        <div className="flex gap-0.5 md:gap-1 flex-1 justify-center md:justify-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`font-nunito ${lang === "it" ? "text-[9px] md:text-xs px-1.5 md:px-2.5" : "text-[11px] md:text-sm px-2 md:px-3"} py-1.5 md:py-2 rounded-full transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-terracotta text-white font-semibold shadow-sm"
                  : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
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
    <div className="relative h-36 md:h-60 overflow-hidden">
      {/* Mexican tile top border */}
      <div className="absolute top-0 left-0 right-0 h-3 z-10 bg-[repeating-linear-gradient(90deg,#C2703E_0px,#C2703E_20px,#1B5E5E_20px,#1B5E5E_40px,#D4845A_40px,#D4845A_60px,#8B4513_60px,#8B4513_80px)]" />
      <img
        src={HERO_IMAGE}
        alt="Mexican street at sunset"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
          <T k="hero.title1" /><br /><T k="hero.title2" />
        </h1>
      </div>
      {/* Mexican tile bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-[repeating-linear-gradient(90deg,#1B5E5E_0px,#1B5E5E_20px,#C2703E_20px,#C2703E_40px,#D4845A_40px,#D4845A_60px,#8B4513_60px,#8B4513_80px)]" />
    </div>
  );
}

// ============ PAPEL PICADO ============
function PapelPicado() {
  return (
    <div className="flex justify-center py-3">
      <div className="flex gap-1.5">
        {["🏵️", "🌸", "🌺", "🌼", "🏵️", "🌸", "🌺"].map((flower, i) => (
          <span key={i} className="text-base opacity-60">{flower}</span>
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
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-nunito text-xs text-stone-400 uppercase tracking-wider"><T k="progress.currently" /></p>
            <p className="font-playfair text-xl font-bold text-stone-800"><T k="timeline.week" /> {currentWeek} <T k="progress.weekOf" /></p>
          </div>
          <div className="text-right">
            <p className="font-nunito text-xs text-stone-400 uppercase tracking-wider"><T k="progress.untilDue" /></p>
            <p className="font-playfair text-xl font-bold text-terracotta">{weeksLeft} <T k="progress.weeks" /> ({daysLeft} <T k="progress.days" />)</p>
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
            <span className="font-nunito text-xs text-stone-400"><T k="progress.conception" /></span>
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
    <div className="max-w-2xl mx-auto px-4 py-10 md:py-14 text-center">
      <p className="font-nunito text-sm tracking-wide text-terracotta/80 mb-8">
        <T k="countdown.intro" />
      </p>
      <div className="flex justify-center gap-3 md:gap-6">
        {[
          { value: timeLeft.days, label: useT("countdown.days") },
          { value: timeLeft.hours, label: useT("countdown.hours") },
          { value: timeLeft.minutes, label: useT("countdown.minutes") },
          { value: timeLeft.seconds, label: useT("countdown.seconds") },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center bg-white/80 rounded-2xl px-3 py-4 md:px-6 md:py-5 shadow-sm border border-stone-100">
            <span className="font-playfair text-3xl md:text-5xl font-bold text-deep-teal tabular-nums">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="font-nunito text-[10px] md:text-xs uppercase tracking-wider text-terracotta/70 mt-1.5">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <p className="font-nunito text-sm text-stone-400 mt-8">
        October 11, 2026
      </p>
      <p className="font-nunito text-xs text-stone-400 mt-1">
        Hospital Español, Polanco, Mexico City
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

  const { lang } = useLang();
  const getWeekLabel = (week: number): string => {
    if (week === 0) return t["timeline.prePregnancy"]?.[lang] || "Pre-Pregnancy";
    if (week === 41) return t["timeline.postBirth"]?.[lang] || "Post-Birth";
    return `${t["timeline.week"]?.[lang] || "Week"} ${week}`;
  };

  const getWeekDates = (week: number): string => {
    if (week === 0) return t["timeline.beforeConception"]?.[lang] || "Before conception";
    if (week === 41) return t["timeline.afterOct"]?.[lang] || "After Oct 11";
    const { start, end } = getWeekDateRange(week);
    return `${start} – ${end}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">📋</span>
        <div>
          <h2 className="font-playfair text-xl md:text-2xl font-bold text-stone-800"><T k="timeline.title" /></h2>
          <p className="font-nunito text-xs md:text-sm text-stone-400"><T k="timeline.subtitle" /></p>
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
                        <T k="timeline.now" />
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
        <p className="font-nunito text-stone-400 text-center py-8"><T k="timeline.loading" /></p>
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">💰</span>
        <h2 className="font-playfair text-xl md:text-2xl font-bold text-stone-800"><T k="payments.title" /></h2>
      </div>

      {Object.entries(grouped).map(([month, monthPayments]) => {
        const isExpanded = expandedMonths.has(month);
        const paidCount = monthPayments.filter((p) => p.paid).length;
        return (
          <div key={month}>
            <button
              onClick={() => toggleMonth(month)}
              className="w-full flex items-center justify-between border-b border-stone-100 pb-3 mb-3 group"
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>›</span>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-playfair text-sm sm:text-base font-semibold text-deep-teal">
                    {month.replace(/^Month\s*\d+(-\d+)?\s*-\s*/, "")}
                  </h3>
                  {getPaymentMonthDate(month) && (
                    <span className="font-nunito text-[10px] sm:text-xs text-stone-400">
                      · {getPaymentMonthDate(month)}
                    </span>
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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

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

  const { lang } = useLang();
  const categoryLabels: Record<string, string> = {
    feeding: t["shopping.feeding"]?.[lang] || "🍼 Bottle Feeding",
    sleeping: t["shopping.sleeping"]?.[lang] || "😴 Sleeping",
    nappies: t["shopping.nappies"]?.[lang] || "👶 Nappies",
    clothing: t["shopping.clothing"]?.[lang] || "👕 Baby Clothing",
    bathing: t["shopping.bathing"]?.[lang] || "🛁 Bathing",
    health: t["shopping.health"]?.[lang] || "🏥 Health & Safety",
    travel: t["shopping.travel"]?.[lang] || "🚗 Travel & On-the-Go",
    expressing: t["shopping.expressing"]?.[lang] || "🤱 Expressing Equipment",
    miscellaneous: t["shopping.miscellaneous"]?.[lang] || "📦 Miscellaneous",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">🛒</span>
        <h2 className="font-playfair text-xl md:text-2xl font-bold text-stone-800"><T k="shopping.title" /></h2>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="font-nunito text-sm text-stone-500"><T k="shopping.progress" /></span>
          <span className="font-nunito text-sm font-semibold text-deep-teal">{progress.pct}%</span>
        </div>
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-terracotta to-burnt-orange rounded-full transition-all duration-700"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        <p className="font-nunito text-xs text-stone-400 mt-1.5">
          {progress.purchased} <T k="shopping.itemsOf" /> {progress.total} <T k="shopping.itemsPurchased" />
        </p>
      </div>

      {Object.entries(grouped).map(([category, categoryItems]) => {
        const isExpanded = expandedCategories.has(category);
        const purchasedCount = categoryItems.filter((i) => i.purchased).length;
        return (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between border-b border-stone-100 pb-3 mb-3"
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>›</span>
                <h3 className="font-playfair text-sm sm:text-base font-semibold text-deep-teal">
                  {categoryLabels[category] || category}
                </h3>
              </div>
              <span className={`font-nunito text-xs font-medium px-2 py-0.5 rounded-full ${
                purchasedCount === categoryItems.length
                  ? "bg-deep-teal/10 text-deep-teal"
                  : "bg-terracotta/10 text-terracotta"
              }`}>
                {purchasedCount}/{categoryItems.length}
              </span>
            </button>
            {isExpanded && (
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
            )}
          </div>
        );
      })}
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
    {
      name: "Dr Raul Ramirez Flores",
      role: "Obstetrics Medical Coordinator",
      org: "My Surrogacy Journey Mexico City",
      email: "drraul.ramirezflores@mysurrogacyjourney.com",
      phone: "",
      address: "Spaces Torre Concreta, 8th Floor, Calzada Gral. Mariana Escobedo 526, Anzures, Mexico City, 11590",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">📇</span>
        <h2 className="font-playfair text-xl md:text-2xl font-bold text-stone-800"><T k="contacts.title" /></h2>
      </div>
      {contacts.map((contact, i) => (
        <div key={i} className="p-4 md:p-5 rounded-2xl bg-white border border-stone-100 shadow-sm hover:border-terracotta/30 transition-all duration-200 hover:shadow-md">
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
  const { lang } = useLang();
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
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">📝</span>
        <h2 className="font-playfair text-xl md:text-2xl font-bold text-stone-800"><T k="notes.title" /></h2>
      </div>

      {isAuthenticated && (
        <div>
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-deep-teal hover:bg-deep-teal/90 font-nunito"
            >
              <T k="notes.addNote" />
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
                  placeholder={useT("notes.titlePlaceholder")}
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="font-nunito"
                />
              </div>
              <Textarea
                placeholder={useT("notes.contentPlaceholder")}
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="font-nunito"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (!newNote.content.trim()) { toast.error(t["notes.contentRequired"]?.[lang] || "Note content is required"); return; }
                    createMutation.mutate(newNote);
                  }}
                  className="bg-deep-teal hover:bg-deep-teal/90 font-nunito"
                  disabled={createMutation.isPending}
                >
                  <T k="notes.save" />
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="font-nunito">
                  <T k="notes.cancel" />
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
              <div key={note.id} className="p-4 rounded-2xl bg-white border border-stone-100 shadow-sm">
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
                        if (confirm(t["notes.deleteConfirm"]?.[lang] || "Delete this note?")) deleteMutation.mutate({ id: note.id });
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
        <p className="font-nunito text-stone-400 text-center py-8"><T k="notes.empty" /></p>
      )}
    </div>
  );
}

// ============ NEWBORN GUIDE ============
function GuideSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left"
      >
        <h3 className="font-playfair text-base md:text-lg font-semibold text-deep-teal">{title}</h3>
        <span className={`text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="px-4 md:px-5 pb-4 md:pb-5 font-nunito text-sm md:text-[15px] text-stone-600 leading-relaxed space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function NewbornGuide() {
  const { lang } = useLang();
  const en = lang === "en";

  return (
    <div className="max-w-2xl mx-auto px-3 md:px-4 py-6 space-y-4">
      <div className="text-center mb-6">
        <h2 className="font-playfair text-xl md:text-2xl font-bold text-stone-800">
          <T k="guide.title" />
        </h2>
        <p className="font-nunito text-sm text-stone-500 mt-1">
          <T k="guide.subtitle" />
        </p>
      </div>

      {/* Feeding */}
      <GuideSection title={useT("guide.feeding")}>
        <p>{en
          ? "Newborns feed every 2–3 hours (8–12 times per day). Feed on demand — hunger signs include rooting, sucking fingers, and fussing. Crying is a late sign of hunger."
          : "I neonati mangiano ogni 2–3 ore (8–12 volte al giorno). Allatta a richiesta — i segnali di fame includono il riflesso di ricerca, succhiarsi le dita e agitarsi. Il pianto è un segnale tardivo di fame."
        }</p>
        <p>{en
          ? "Breastfed babies are getting enough if they have 6+ wet nappies per day, several poops, seem satisfied after feeds, and gain weight steadily."
          : "I bambini allattati al seno mangiano abbastanza se hanno 6+ pannolini bagnati al giorno, diverse evacuazioni, sembrano soddisfatti dopo le poppate e aumentano di peso costantemente."
        }</p>
        <p>{en
          ? "Formula-fed babies start with 60–90ml per feed, increasing to 120–150ml by 2 months. Burp your baby during and after feeds — over the shoulder, sitting up, or face-down on your lap."
          : "I bambini alimentati con formula iniziano con 60–90ml per poppata, aumentando a 120–150ml entro i 2 mesi. Fai fare il ruttino durante e dopo le poppate — sulla spalla, seduto, o a pancia in giù sulle ginocchia."
        }</p>
      </GuideSection>

      {/* Sleep */}
      <GuideSection title={useT("guide.sleep")}>
        <p>{en
          ? "Newborns sleep 14–17 hours per day in 2–4 hour stretches. Many babies sleep through the night (6–8 hours) by 3 months, but don't worry if yours doesn't."
          : "I neonati dormono 14–17 ore al giorno in periodi di 2–4 ore. Molti bambini dormono tutta la notte (6–8 ore) entro i 3 mesi, ma non preoccuparti se il tuo non lo fa."
        }</p>
        <p className="font-semibold text-stone-700">{en
          ? "Safe sleep rules:"
          : "Regole per un sonno sicuro:"
        }</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Always place baby on their back to sleep" : "Metti sempre il bambino a dormire sulla schiena"}</li>
          <li>{en ? "Firm, flat mattress — no loose bedding, pillows, or toys" : "Materasso rigido e piatto — niente coperte sciolte, cuscini o giocattoli"}</li>
          <li>{en ? "Room sharing (not bed sharing) for the first 6 months" : "Condivisione della stanza (non del letto) per i primi 6 mesi"}</li>
          <li>{en ? "Room temperature: 16–20°C" : "Temperatura della stanza: 16–20°C"}</li>
          <li>{en ? "Alternate head position nightly to prevent flat spots" : "Alterna la posizione della testa ogni notte per prevenire appiattimenti"}</li>
        </ul>
      </GuideSection>

      {/* Bathing */}
      <GuideSection title={useT("guide.bathing")}>
        <p>{en
          ? "You don't need to bathe your baby every day — 2–3 times per week is fine. On other days, 'top and tail' (wash face, neck, hands, and bottom with cotton wool and warm water)."
          : "Non è necessario fare il bagnetto ogni giorno — 2–3 volte a settimana è sufficiente. Negli altri giorni, lava viso, collo, mani e sederino con cotone e acqua tiepida."
        }</p>
        <p>{en
          ? "Use sponge baths only until the umbilical cord stump falls off (1–3 weeks). Water should be warm, not hot — test with your wrist or elbow. Never leave baby alone in water."
          : "Usa solo spugnature fino a quando il moncone del cordone ombelicale non cade (1–3 settimane). L'acqua deve essere tiepida, non calda — testa con il polso o il gomito. Non lasciare mai il bambino solo nell'acqua."
        }</p>
        <p>{en
          ? "Keep the room warm, have everything ready beforehand. Pat dry carefully, especially in skin folds."
          : "Tieni la stanza calda, prepara tutto in anticipo. Asciuga tamponando con cura, specialmente nelle pieghe della pelle."
        }</p>
      </GuideSection>

      {/* Nappies */}
      <GuideSection title={useT("guide.nappies")}>
        <p>{en
          ? "Expect 6–8 wet nappies per day (a sign of good feeding). Change frequently to prevent nappy rash. Clean front to back (especially important for girls)."
          : "Aspettati 6–8 pannolini bagnati al giorno (segno di buona alimentazione). Cambia frequentemente per prevenire l'eritema da pannolino. Pulisci da davanti a dietro (particolarmente importante per le femmine)."
        }</p>
        <p>{en
          ? "Let skin air dry or pat gently. Use barrier cream if redness appears. For the umbilical cord: keep it clean and dry, fold the nappy below it."
          : "Lascia asciugare la pelle all'aria o tampona delicatamente. Usa crema barriera se appare rossore. Per il cordone ombelicale: tienilo pulito e asciutto, piega il pannolino sotto."
        }</p>
      </GuideSection>

      {/* Soothing */}
      <GuideSection title={useT("guide.soothing")}>
        <p className="font-semibold text-stone-700">{en ? "The 5 S's:" : "Le 5 S:"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Swaddle — wrap snugly in a blanket" : "Fasciare — avvolgi strettamente in una coperta"}</li>
          <li>{en ? "Side/Stomach — hold on their side (never for sleeping)" : "Fianco/Pancia — tieni sul fianco (mai per dormire)"}</li>
          <li>{en ? "Shush — white noise or gentle shushing" : "Shh — rumore bianco o un dolce 'shh'"}</li>
          <li>{en ? "Swing — gentle rhythmic rocking" : "Dondolare — movimento ritmico delicato"}</li>
          <li>{en ? "Suck — offer a pacifier or let them feed" : "Succhiare — offri un ciuccio o lascia poppare"}</li>
        </ul>
        <p>{en
          ? "Skin-to-skin contact is powerful for calming. Colic (excessive crying 3+ hours, 3+ days/week) peaks at 6 weeks and usually resolves by 3–4 months."
          : "Il contatto pelle a pelle è molto efficace per calmare. Le coliche (pianto eccessivo 3+ ore, 3+ giorni/settimana) raggiungono il picco a 6 settimane e di solito si risolvono entro 3–4 mesi."
        }</p>
        <p className="font-semibold text-red-600">{en
          ? "Never shake a baby. If overwhelmed, put them down safely and take a break."
          : "Non scuotere mai un bambino. Se sei sopraffatto, mettilo giù in sicurezza e prenditi una pausa."
        }</p>
      </GuideSection>

      {/* Health & Safety */}
      <GuideSection title={useT("guide.health")}>
        <p>{en
          ? "Normal temperature is 36.4°C. A fever of 38°C or higher in a baby under 3 months needs immediate medical attention."
          : "La temperatura normale è 36,4°C. Una febbre di 38°C o superiore in un bambino sotto i 3 mesi richiede attenzione medica immediata."
        }</p>
        <p>{en
          ? "The umbilical cord stump falls off in 1–3 weeks — keep it dry and clean. The fontanelles (soft spots) are normal and close gradually over the first 18 months."
          : "Il moncone del cordone ombelicale cade in 1–3 settimane — tienilo asciutto e pulito. Le fontanelle (punti morbidi) sono normali e si chiudono gradualmente nei primi 18 mesi."
        }</p>
        <p>{en
          ? "Start tummy time from day one — a few minutes at a time, building up gradually. This strengthens neck and shoulder muscles."
          : "Inizia il 'tummy time' dal primo giorno — pochi minuti alla volta, aumentando gradualmente. Questo rafforza i muscoli del collo e delle spalle."
        }</p>
      </GuideSection>

      {/* Milestones */}
      <GuideSection title={useT("guide.milestones")}>
        <div className="space-y-2">
          <p className="font-semibold text-stone-700">{en ? "Month 1:" : "Mese 1:"}</p>
          <p>{en
            ? "Focuses on faces 20–30cm away, startles at loud sounds, lifts head briefly during tummy time, sleeps most of the day."
            : "Si concentra sui visi a 20–30cm di distanza, si spaventa ai rumori forti, solleva brevemente la testa durante il tummy time, dorme la maggior parte del giorno."
          }</p>
          <p className="font-semibold text-stone-700">{en ? "Month 2:" : "Mese 2:"}</p>
          <p>{en
            ? "Starts to smile socially, makes cooing sounds, follows objects with eyes, holds head up more steadily."
            : "Inizia a sorridere socialmente, emette suoni di 'coo', segue gli oggetti con gli occhi, tiene la testa più stabilmente."
          }</p>
          <p className="font-semibold text-stone-700">{en ? "Month 3:" : "Mese 3:"}</p>
          <p>{en
            ? "Recognises familiar faces, reaches for objects, laughs and giggles, holds head steady, pushes up on arms during tummy time."
            : "Riconosce i visi familiari, cerca di afferrare gli oggetti, ride e fa versetti, tiene la testa ferma, si spinge sulle braccia durante il tummy time."
          }</p>
        </div>
      </GuideSection>

      {/* Bonding */}
      <GuideSection title={useT("guide.bonding")}>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Skin-to-skin contact as much as possible" : "Contatto pelle a pelle il più possibile"}</li>
          <li>{en ? "Talk, sing, and read to baby from day one" : "Parla, canta e leggi al bambino dal primo giorno"}</li>
          <li>{en ? "Respond to cries promptly — you can't spoil a newborn" : "Rispondi al pianto prontamente — non puoi viziare un neonato"}</li>
          <li>{en ? "Take turns with your partner for night feeds" : "Fai i turni con il partner per le poppate notturne"}</li>
          <li>{en ? "Accept help from family and friends" : "Accetta aiuto da famiglia e amici"}</li>
          <li>{en ? "It's normal to feel overwhelmed — seek support if needed" : "È normale sentirsi sopraffatti — cerca supporto se necessario"}</li>
        </ul>
        <p>{en
          ? "Postnatal depression can affect both parents. Watch for persistent low mood, anxiety, or withdrawal and speak to a doctor if concerned."
          : "La depressione postnatale può colpire entrambi i genitori. Fai attenzione a umore basso persistente, ansia o ritiro sociale e parla con un medico se preoccupato."
        }</p>
      </GuideSection>

      {/* When to Call the Doctor */}
      <GuideSection title={useT("guide.emergency")}>
        <p className="font-semibold text-red-600 mb-2">{en
          ? "Seek immediate medical help if your baby has:"
          : "Cerca aiuto medico immediato se il tuo bambino ha:"
        }</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Fever of 38°C or higher" : "Febbre di 38°C o superiore"}</li>
          <li>{en ? "Difficulty breathing or blue lips" : "Difficoltà a respirare o labbra blu"}</li>
          <li>{en ? "Won't feed or feeding much less than usual" : "Non mangia o mangia molto meno del solito"}</li>
          <li>{en ? "Very sleepy or hard to wake" : "Molto sonnolento o difficile da svegliare"}</li>
          <li>{en ? "Persistent vomiting (not just spit-up)" : "Vomito persistente (non solo rigurgito)"}</li>
          <li>{en ? "Fewer than 6 wet nappies in 24 hours" : "Meno di 6 pannolini bagnati in 24 ore"}</li>
          <li>{en ? "Yellow skin/eyes getting worse (jaundice)" : "Pelle/occhi gialli che peggiorano (ittero)"}</li>
          <li>{en ? "Rash that doesn't fade when pressed" : "Eruzione cutanea che non scompare alla pressione"}</li>
          <li>{en ? "Bulging or sunken fontanelle" : "Fontanella sporgente o infossata"}</li>
        </ul>
      </GuideSection>
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
    <div className="max-w-2xl mx-auto px-4 py-8 mt-6 border-t border-stone-100">
      <h3 className="font-playfair text-base font-semibold text-deep-teal mb-4 text-center">
        <T k="resources.title" />
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-nunito text-xs md:text-sm text-stone-500 hover:text-deep-teal transition-all duration-200 p-3 rounded-xl bg-white border border-stone-100 hover:border-terracotta/30 hover:shadow-md text-center shadow-sm"
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}

// ============ MAIN BAMBINA PAGE ============
// ============ LANGUAGE TOGGLE ============
function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-0.5 bg-stone-100 rounded-full p-0.5 md:mr-3">
      <button
        onClick={() => setLang("en")}
        className={`font-nunito text-[10px] md:text-xs px-2 py-0.5 rounded-full transition-all ${
          lang === "en" ? "bg-white text-deep-teal font-semibold shadow-sm" : "text-stone-400 hover:text-stone-600"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("it")}
        className={`font-nunito text-[10px] md:text-xs px-2 py-0.5 rounded-full transition-all ${
          lang === "it" ? "bg-white text-deep-teal font-semibold shadow-sm" : "text-stone-400 hover:text-stone-600"
        }`}
      >
        IT
      </button>
    </div>
  );
}

export default function Bambina() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("countdown");
  const contentRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("bambina-lang") as Lang) || "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("bambina-lang", lang);
  }, [lang]);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    // Scroll content into view after tab switch (especially important on mobile)
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
    <div className="min-h-screen bg-warm-cream">
      <StickyNav activeTab={activeTab} onTabChange={handleTabChange} />
      <HeroBanner />

      {/* Auth status - compact */}
      <div className="text-center py-1">
        {!isAuthenticated && (
          <a
            href={getLoginUrl()}
            className="font-nunito text-xs text-terracotta hover:text-burnt-orange underline transition-colors"
          >
            <T k="auth.signIn" />
          </a>
        )}
        {isAuthenticated && user && (
          <p className="font-nunito text-xs text-stone-400">
            <T k="auth.signedAs" /> {user.name || user.email || "User"} ✓
          </p>
        )}
      </div>

      {/* Progress card only on timeline tab */}
      {activeTab === "timeline" && <ProgressCard />}

      {/* Tab Content */}
      <div ref={contentRef} className="scroll-mt-16">
      {activeTab === "countdown" && <Countdown />}
      {activeTab === "timeline" && <WeekTimeline />}
      {activeTab === "payments" && <Payments />}
      {activeTab === "shopping" && <ShoppingList />}
      {activeTab === "contacts" && <Contacts />}
      {activeTab === "notes" && <Notes />}
      {activeTab === "guide" && <NewbornGuide />}
      </div>

      {/* Footer */}
      <div className="py-10 flex flex-col items-center gap-3">
        <p className="font-nunito text-xs text-stone-300">
          <T k="footer.text" /> 🇲🇽 🇬🇧 🇮🇹
        </p>
        <LanguageToggle />
      </div>

      {/* Bottom tile border */}
      <div className="h-3 bg-[repeating-linear-gradient(90deg,#C2703E_0px,#C2703E_20px,#1B5E5E_20px,#1B5E5E_40px,#D4845A_40px,#D4845A_60px,#8B4513_60px,#8B4513_80px)]" />
    </div>
    </LangContext.Provider>
  );
}
