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
  "countdown.intro": { en: "We'll meet bambino in...", it: "Incontreremo il bambino tra..." },
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
  "guide.feedingPositions": { en: "Bottle Feeding Technique", it: "Tecnica di alimentazione con biberon" },
  "guide.formulaPrep": { en: "Formula Preparation & Bottle Safety", it: "Preparazione del latte artificiale e sicurezza del biberon" },
  "guide.wakeWindows": { en: "Wake Windows & Routines", it: "Finestre di veglia e routine" },
  "guide.purpleCrying": { en: "The PURPLE Crying Period", it: "Il periodo del pianto PURPLE" },
  "guide.bathSteps": { en: "Step-by-Step Bath Guide", it: "Guida passo passo al bagnetto" },
  "guide.commonConditions": { en: "Common Conditions", it: "Condizioni comuni" },
  "guide.vaccinations": { en: "Vaccinations (UK Schedule)", it: "Vaccinazioni (calendario UK)" },
  "guide.fourthTrimester": { en: "The Fourth Trimester", it: "Il quarto trimestre" },
  "guide.hospitalBag": { en: "Hospital Bag Checklist", it: "Lista per la borsa dell'ospedale" },
  "guide.nappyBag": { en: "Nappy Bag Essentials", it: "Essenziali per la borsa del cambio" },
  "guide.partnerBonding": { en: "Partner & Dad Bonding", it: "Legame con il papà e il partner" },
  // Footer
  "footer.text": { en: "Made with love for our bambino", it: "Fatto con amore per il nostro bambino" },
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
      <div className="max-w-4xl mx-auto px-1 md:px-4 flex items-center h-12 md:h-14">
        <span className="font-playfair text-sm font-semibold text-deep-teal mr-3 hidden md:block">
          🌵 <T k="hero.title1" /> <T k="hero.title2" />
        </span>
        <div className="flex gap-0 md:gap-1 flex-1 justify-center md:justify-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`font-nunito ${lang === "it" ? "text-[8px] md:text-xs px-1 md:px-2.5" : "text-[9px] md:text-sm px-1.5 md:px-3"} py-1 md:py-2 rounded-full transition-all duration-200 ${
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

      {/* The Fourth Trimester */}
      <GuideSection title={useT("guide.fourthTrimester")}>
        <p>{en
          ? "The 'fourth trimester' refers to the first 3 months after birth. Your baby has spent 9 months in a warm, dark, snug environment and is now adjusting to the outside world. Everything is new and overwhelming for them."
          : "Il 'quarto trimestre' si riferisce ai primi 3 mesi dopo la nascita. Il tuo bambino ha trascorso 9 mesi in un ambiente caldo, buio e accogliente e ora si sta adattando al mondo esterno. Tutto è nuovo e travolgente per lui."
        }</p>
        <p>{en
          ? "During this time, recreating womb-like conditions (warmth, closeness, gentle movement, white noise) helps baby feel secure. Expect lots of feeding, sleeping, and crying \u2014 this is normal. Your baby isn't manipulating you; they genuinely need constant comfort and closeness."
          : "Durante questo periodo, ricreare condizioni simili all'utero (calore, vicinanza, movimento dolce, rumore bianco) aiuta il bambino a sentirsi sicuro. Aspettati molte poppate, sonno e pianto \u2014 questo è normale. Il tuo bambino non ti sta manipolando; ha davvero bisogno di conforto e vicinanza costanti."
        }</p>
        <p>{en
          ? "For you as parents, this is also a huge adjustment. Be patient with yourselves. There's no such thing as a perfect parent \u2014 good enough is good enough. Lower your expectations for housework, socialising, and productivity. Your only job right now is keeping baby fed, safe, and loved."
          : "Per voi come genitori, anche questo è un enorme adattamento. Siate pazienti con voi stessi. Non esiste il genitore perfetto \u2014 abbastanza buono è abbastanza buono. Abbassate le aspettative per le faccende domestiche, la socializzazione e la produttività. Il vostro unico compito ora è tenere il bambino nutrito, al sicuro e amato."
        }</p>
      </GuideSection>

      {/* Feeding */}
      <GuideSection title={useT("guide.feeding")}>
        <p>{en
          ? "Newborns feed every 2–3 hours (8–12 times per day). Feed on demand — hunger signs include rooting, sucking fingers, lip smacking, and fussing. Crying is a late sign of hunger."
          : "I neonati mangiano ogni 2–3 ore (8–12 volte al giorno). Dai da mangiare a richiesta — i segnali di fame includono il riflesso di ricerca, succhiarsi le dita, schioccare le labbra e agitarsi. Il pianto è un segnale tardivo di fame."
        }</p>
        <p>{en
          ? "Your baby is getting enough if they have 6+ wet nappies per day, several poops (colour changes from black meconium to yellow/green by day 4–5), seem satisfied after feeds, and gain weight steadily."
          : "Il tuo bambino mangia abbastanza se ha 6+ pannolini bagnati al giorno, diverse evacuazioni (il colore cambia dal meconio nero al giallo/verde entro il giorno 4–5), sembra soddisfatto dopo le poppate e aumenta di peso costantemente."
        }</p>
        <p className="font-semibold text-stone-700">{en ? "How much formula by age:" : "Quanto latte artificiale per età:"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "First few days: 15–60ml per feed (tiny tummy!)" : "Primi giorni: 15–60ml per poppata (pancino piccolo!)"}</li>
          <li>{en ? "1–2 weeks: 60–90ml per feed, every 2–3 hours" : "1–2 settimane: 60–90ml per poppata, ogni 2–3 ore"}</li>
          <li>{en ? "1 month: 90–120ml per feed, every 3–4 hours" : "1 mese: 90–120ml per poppata, ogni 3–4 ore"}</li>
          <li>{en ? "2 months: 120–150ml per feed" : "2 mesi: 120–150ml per poppata"}</li>
          <li>{en ? "3 months: 150–210ml per feed" : "3 mesi: 150–210ml per poppata"}</li>
        </ul>
        <p className="mt-3">{en
          ? "These are guidelines — every baby is different. Let baby guide you. Signs they've had enough: turning away, pushing the bottle out, falling asleep, or slowing right down."
          : "Queste sono linee guida — ogni bambino è diverso. Lascia che il bambino ti guidi. Segni che ha avuto abbastanza: voltarsi, spingere via il biberon, addormentarsi o rallentare molto."
        }</p>
        <p>{en
          ? "Burp your baby during and after feeds — over the shoulder, sitting up on your lap, or face-down across your knees. Bottle-fed babies tend to swallow more air, so burping is especially important."
          : "Fai fare il ruttino durante e dopo le poppate — sulla spalla, seduto sulle ginocchia, o a pancia in giù sulle ginocchia. I bambini alimentati con biberon tendono a ingoiare più aria, quindi il ruttino è particolarmente importante."
        }</p>
      </GuideSection>

      {/* Bottle Feeding Technique */}
      <GuideSection title={useT("guide.feedingPositions")}>
        <p className="font-semibold text-stone-700">{en ? "Paced bottle feeding (recommended):" : "Alimentazione a ritmo controllato (raccomandata):"}</p>
        <p>{en
          ? "Paced feeding mimics the natural rhythm of feeding and helps prevent overfeeding. It gives baby more control over how much they drink."
          : "L'alimentazione a ritmo controllato imita il ritmo naturale dell'alimentazione e aiuta a prevenire la sovralimentazione. Dà al bambino più controllo su quanto beve."
        }</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Hold baby in a semi-upright position (not lying flat)" : "Tieni il bambino in posizione semi-eretta (non sdraiato)"}</li>
          <li>{en ? "Hold the bottle horizontally — just enough tilt to fill the teat" : "Tieni il biberon orizzontale — inclinato appena abbastanza da riempire la tettarella"}</li>
          <li>{en ? "Let baby draw the teat in rather than pushing it in" : "Lascia che il bambino attiri la tettarella piuttosto che spingerla dentro"}</li>
          <li>{en ? "Pause every few minutes — lower the bottle to let baby rest" : "Fai una pausa ogni pochi minuti — abbassa il biberon per far riposare il bambino"}</li>
          <li>{en ? "Switch sides halfway through (helps eye development and prevents preference)" : "Cambia lato a metà poppata (aiuta lo sviluppo visivo e previene preferenze)"}</li>
          <li>{en ? "A feed should take 15–20 minutes, not 5" : "Una poppata dovrebbe durare 15–20 minuti, non 5"}</li>
        </ul>
        <p className="font-semibold text-stone-700 mt-3">{en ? "Choosing the right teat:" : "Scegliere la tettarella giusta:"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Start with a slow-flow (size 1) teat for newborns" : "Inizia con una tettarella a flusso lento (taglia 1) per neonati"}</li>
          <li>{en ? "If baby is gulping, choking, or milk leaks from mouth — flow is too fast" : "Se il bambino ingoia troppo, si strozza, o il latte esce dalla bocca — il flusso è troppo veloce"}</li>
          <li>{en ? "If baby is frustrated, collapsing the teat, or taking very long — try the next size up" : "Se il bambino è frustrato, schiaccia la tettarella, o impiega troppo tempo — prova la taglia successiva"}</li>
          <li>{en ? "Move to size 2 around 3–6 months (every baby is different)" : "Passa alla taglia 2 intorno ai 3–6 mesi (ogni bambino è diverso)"}</li>
        </ul>
        <p className="font-semibold text-stone-700 mt-3">{en ? "Bonding during bottle feeds:" : "Legame durante le poppate con biberon:"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Hold baby close with skin-to-skin contact when possible" : "Tieni il bambino vicino con contatto pelle a pelle quando possibile"}</li>
          <li>{en ? "Make eye contact and talk softly during feeds" : "Mantieni il contatto visivo e parla dolcemente durante le poppate"}</li>
          <li>{en ? "Limit the number of people who feed baby in the early weeks (helps baby feel secure)" : "Limita il numero di persone che danno da mangiare al bambino nelle prime settimane (aiuta il bambino a sentirsi sicuro)"}</li>
          <li>{en ? "Both parents can share feeds equally — great for bonding" : "Entrambi i genitori possono condividere le poppate equamente — ottimo per il legame"}</li>
        </ul>
      </GuideSection>

      {/* Formula Preparation */}
      <GuideSection title={useT("guide.formulaPrep")}>
        <p>{en
          ? "Formula-fed babies start with 60\u201390ml per feed in the first weeks, increasing to 120\u2013150ml by 2 months, and up to 180\u2013210ml by 3 months. Every baby is different \u2014 let them guide you."
          : "I bambini alimentati con formula iniziano con 60\u201390ml per poppata nelle prime settimane, aumentando a 120\u2013150ml entro i 2 mesi, e fino a 180\u2013210ml entro i 3 mesi. Ogni bambino è diverso \u2014 lascia che ti guidi."
        }</p>
        <p className="font-semibold text-stone-700">{en ? "Safe formula preparation:" : "Preparazione sicura del latte artificiale:"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Boil fresh water and let it cool to no less than 70\u00b0C (kills bacteria in the powder)" : "Fai bollire acqua fresca e lasciala raffreddare a non meno di 70\u00b0C (uccide i batteri nella polvere)"}</li>
          <li>{en ? "Pour water into sterilised bottle first, then add powder" : "Versa prima l'acqua nel biberon sterilizzato, poi aggiungi la polvere"}</li>
          <li>{en ? "Use the exact scoop measurement \u2014 don't pack or heap" : "Usa la misura esatta del misurino \u2014 non comprimere o colmare"}</li>
          <li>{en ? "Cool quickly under cold running water before feeding" : "Raffredda rapidamente sotto acqua corrente fredda prima di dare da mangiare"}</li>
          <li>{en ? "Test temperature on your wrist \u2014 should feel lukewarm, not hot" : "Testa la temperatura sul polso \u2014 deve sembrare tiepida, non calda"}</li>
          <li>{en ? "Use within 2 hours of preparation. Discard any leftover milk" : "Usa entro 2 ore dalla preparazione. Scarta il latte avanzato"}</li>
        </ul>
        <p className="font-semibold text-stone-700 mt-3">{en ? "Sterilising bottles:" : "Sterilizzare i biberon:"}</p>
        <p>{en
          ? "Sterilise all bottles, teats, and equipment until baby is 12 months old. Methods: steam steriliser (quickest), cold water sterilising solution, or boiling in water for 10 minutes. Wash everything in hot soapy water first."
          : "Sterilizza tutti i biberon, le tettarelle e l'attrezzatura fino a quando il bambino ha 12 mesi. Metodi: sterilizzatore a vapore (il più veloce), soluzione sterilizzante ad acqua fredda, o bollitura in acqua per 10 minuti. Lava tutto prima in acqua calda e sapone."
        }</p>
      </GuideSection>

      {/* Sleep */}
      <GuideSection title={useT("guide.sleep")}>
        <p>{en
          ? "Newborns sleep 14\u201317 hours per day in 2\u20134 hour stretches. They don't know the difference between day and night yet \u2014 this is normal and resolves gradually."
          : "I neonati dormono 14\u201317 ore al giorno in periodi di 2\u20134 ore. Non conoscono ancora la differenza tra giorno e notte \u2014 questo è normale e si risolve gradualmente."
        }</p>
        <p className="font-semibold text-stone-700">{en ? "Safe sleep rules:" : "Regole per un sonno sicuro:"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Always on their back, every sleep, every time" : "Sempre sulla schiena, ogni sonno, ogni volta"}</li>
          <li>{en ? "Firm, flat mattress \u2014 no loose bedding, pillows, bumpers, or toys" : "Materasso rigido e piatto \u2014 niente coperte sciolte, cuscini, paracolpi o giocattoli"}</li>
          <li>{en ? "Room sharing (not bed sharing) for at least the first 6 months" : "Condivisione della stanza (non del letto) per almeno i primi 6 mesi"}</li>
          <li>{en ? "Room temperature: 16\u201320\u00b0C \u2014 feel baby's chest/back to check (hands and feet are often cool)" : "Temperatura della stanza: 16\u201320\u00b0C \u2014 tocca il petto/schiena per controllare (mani e piedi sono spesso freddi)"}</li>
          <li>{en ? "Feet at the bottom of the cot ('feet to foot' position)" : "Piedi in fondo alla culla (posizione 'piedi al fondo')"}</li>
          <li>{en ? "No smoking around baby \u2014 this is the biggest modifiable risk factor for SIDS" : "Non fumare vicino al bambino \u2014 questo è il più grande fattore di rischio modificabile per la SIDS"}</li>
        </ul>
      </GuideSection>

      {/* Wake Windows */}
      <GuideSection title={useT("guide.wakeWindows")}>
        <p>{en
          ? "A 'wake window' is how long baby can comfortably stay awake between naps. Overtired babies actually find it harder to fall asleep, so watching these windows helps prevent meltdowns."
          : "Una 'finestra di veglia' è quanto tempo il bambino può stare comodamente sveglio tra i pisolini. I bambini troppo stanchi trovano in realtà più difficile addormentarsi, quindi osservare queste finestre aiuta a prevenire le crisi."
        }</p>
        <p className="font-semibold text-stone-700">{en ? "Wake windows by age:" : "Finestre di veglia per età:"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "0\u20134 weeks: 30\u201360 minutes (very short!)" : "0\u20134 settimane: 30\u201360 minuti (molto brevi!)"}</li>
          <li>{en ? "4\u20138 weeks: 45\u201390 minutes" : "4\u20138 settimane: 45\u201390 minuti"}</li>
          <li>{en ? "2\u20133 months: 60\u2013120 minutes" : "2\u20133 mesi: 60\u2013120 minuti"}</li>
        </ul>
        <p className="font-semibold text-stone-700 mt-3">{en ? "Sleepy cues to watch for:" : "Segnali di sonno da osservare:"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Yawning, eye rubbing, pulling ears" : "Sbadigli, strofinarsi gli occhi, tirarsi le orecchie"}</li>
          <li>{en ? "Turning away from stimulation, staring blankly" : "Voltarsi dalla stimolazione, sguardo fisso nel vuoto"}</li>
          <li>{en ? "Fussing, jerky movements, arching back" : "Agitazione, movimenti a scatti, inarcamento della schiena"}</li>
        </ul>
        <p className="mt-3">{en
          ? "Day/night confusion: In the first weeks, keep daytime bright and active (don't tiptoe around naps), and nighttime dark and boring (dim lights, minimal talking, no play during night feeds). This helps baby's circadian rhythm develop."
          : "Confusione giorno/notte: Nelle prime settimane, mantieni il giorno luminoso e attivo (non camminare in punta di piedi durante i pisolini), e la notte buia e noiosa (luci basse, parlare al minimo, niente gioco durante le poppate notturne). Questo aiuta lo sviluppo del ritmo circadiano del bambino."
        }</p>
      </GuideSection>

      {/* Bathing Step-by-Step */}
      <GuideSection title={useT("guide.bathSteps")}>
        <p>{en
          ? "You don't need to bathe baby every day \u2014 2\u20133 times per week is plenty. On other days, 'top and tail' (wash face, neck folds, hands, and bottom with cotton wool and warm water)."
          : "Non è necessario fare il bagnetto ogni giorno \u2014 2\u20133 volte a settimana è sufficiente. Negli altri giorni, lava viso, pieghe del collo, mani e sederino con cotone e acqua tiepida."
        }</p>
        <p className="font-semibold text-stone-700">{en ? "Before the cord stump falls off (sponge bath):" : "Prima che il moncone cada (spugnatura):"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Lay baby on a warm towel on a flat surface" : "Adagia il bambino su un asciugamano caldo su una superficie piatta"}</li>
          <li>{en ? "Use a damp cloth to gently clean face, body, and nappy area" : "Usa un panno umido per pulire delicatamente viso, corpo e zona pannolino"}</li>
          <li>{en ? "Keep the cord stump dry \u2014 it falls off in 1\u20133 weeks" : "Tieni il moncone asciutto \u2014 cade in 1\u20133 settimane"}</li>
        </ul>
        <p className="font-semibold text-stone-700 mt-3">{en ? "Full bath (once cord has fallen off):" : "Bagnetto completo (dopo la caduta del moncone):"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Fill baby bath with 8\u201310cm of water at 37\u201338\u00b0C (test with elbow or thermometer)" : "Riempi la vaschetta con 8\u201310cm di acqua a 37\u201338\u00b0C (testa con il gomito o un termometro)"}</li>
          <li>{en ? "Have everything ready: towel, clean nappy, clothes, cotton wool" : "Prepara tutto: asciugamano, pannolino pulito, vestiti, cotone"}</li>
          <li>{en ? "Support head and neck with one hand at all times" : "Sostieni testa e collo con una mano in ogni momento"}</li>
          <li>{en ? "Wash hair last to prevent heat loss" : "Lava i capelli per ultimi per prevenire la perdita di calore"}</li>
          <li>{en ? "Use plain water only for the first month; mild baby wash after that" : "Usa solo acqua per il primo mese; detergente delicato per bambini dopo"}</li>
          <li>{en ? "Pat dry carefully, especially in skin folds (neck, armpits, behind ears)" : "Asciuga tamponando con cura, specialmente nelle pieghe (collo, ascelle, dietro le orecchie)"}</li>
          <li>{en ? "Never leave baby unattended in water, even for a second" : "Non lasciare mai il bambino incustodito nell'acqua, nemmeno per un secondo"}</li>
        </ul>
        <p className="mt-3">{en
          ? "Nail trimming: Use baby nail scissors or a file. Best done when baby is asleep or feeding. Trim straight across to avoid ingrown nails."
          : "Taglio delle unghie: Usa forbicine per bambini o una limetta. Meglio farlo quando il bambino dorme o mangia. Taglia dritto per evitare unghie incarnite."
        }</p>
      </GuideSection>

      {/* Nappies */}
      <GuideSection title={useT("guide.nappies")}>
        <p>{en
          ? "Expect 6\u20138 wet nappies per day (a sign of good feeding). In the first few days, you'll see dark meconium poos, transitioning to yellow/mustard by day 4\u20135. Formula-fed poo is firmer and darker."
          : "Aspettati 6\u20138 pannolini bagnati al giorno (segno di buona alimentazione). Nei primi giorni, vedrai feci scure di meconio, che diventano gialle/senape entro il giorno 4\u20135. Le feci con formula sono più solide e scure."
        }</p>
        <p>{en
          ? "Change frequently to prevent nappy rash. Clean front to back (especially important for girls). Let skin air dry or pat gently. Use barrier cream (zinc oxide) if redness appears."
          : "Cambia frequentemente per prevenire l'eritema da pannolino. Pulisci da davanti a dietro (particolarmente importante per le femmine). Lascia asciugare la pelle all'aria o tampona delicatamente. Usa crema barriera (ossido di zinco) se appare rossore."
        }</p>
        <p>{en
          ? "For the umbilical cord: fold the nappy below it to keep it dry and exposed to air. Don't pull it off \u2014 it will fall naturally."
          : "Per il cordone ombelicale: piega il pannolino sotto per tenerlo asciutto ed esposto all'aria. Non tirarlo \u2014 cadrà naturalmente."
        }</p>
      </GuideSection>

      {/* PURPLE Crying */}
      <GuideSection title={useT("guide.purpleCrying")}>
        <p>{en
          ? "PURPLE is an acronym that describes a normal phase of increased crying in healthy babies. It's not your fault and it doesn't mean something is wrong."
          : "PURPLE è un acronimo che descrive una fase normale di pianto aumentato nei bambini sani. Non è colpa tua e non significa che qualcosa non va."
        }</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "P \u2014 Peak of crying (usually around 2 months, then decreases)" : "P \u2014 Picco del pianto (di solito intorno ai 2 mesi, poi diminuisce)"}</li>
          <li>{en ? "U \u2014 Unexpected (comes and goes without reason)" : "U \u2014 Inaspettato (va e viene senza motivo)"}</li>
          <li>{en ? "R \u2014 Resists soothing (may not stop no matter what you do)" : "R \u2014 Resiste al conforto (potrebbe non fermarsi qualunque cosa tu faccia)"}</li>
          <li>{en ? "P \u2014 Pain-like face (but baby is not in pain)" : "P \u2014 Espressione di dolore (ma il bambino non ha dolore)"}</li>
          <li>{en ? "L \u2014 Long-lasting (can cry for 5+ hours a day)" : "L \u2014 Di lunga durata (può piangere per 5+ ore al giorno)"}</li>
          <li>{en ? "E \u2014 Evening (often worse in late afternoon/evening)" : "E \u2014 Sera (spesso peggio nel tardo pomeriggio/sera)"}</li>
        </ul>
        <p className="mt-3">{en
          ? "This phase typically starts around 2 weeks, peaks at 6\u20138 weeks, and resolves by 3\u20135 months. It's the most common time for parents to feel frustrated \u2014 it's okay to put baby down safely in their cot and step away for a few minutes to breathe."
          : "Questa fase inizia tipicamente intorno alle 2 settimane, raggiunge il picco a 6\u20138 settimane e si risolve entro 3\u20135 mesi. \u00c8 il momento più comune in cui i genitori si sentono frustrati \u2014 va bene mettere il bambino giù in sicurezza nella culla e allontanarsi per qualche minuto per respirare."
        }</p>
      </GuideSection>

      {/* Soothing */}
      <GuideSection title={useT("guide.soothing")}>
        <p className="font-semibold text-stone-700">{en ? "The 5 S's (Dr. Harvey Karp):" : "Le 5 S (Dr. Harvey Karp):"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Swaddle \u2014 wrap snugly with arms inside (stops startle reflex). Stop swaddling when baby shows signs of rolling" : "Fasciare \u2014 avvolgi strettamente con le braccia dentro (ferma il riflesso di Moro). Smetti di fasciare quando il bambino mostra segni di rotolamento"}</li>
          <li>{en ? "Side/Stomach \u2014 hold on their side or tummy (for soothing only, never for sleeping)" : "Fianco/Pancia \u2014 tieni sul fianco o sulla pancia (solo per calmare, mai per dormire)"}</li>
          <li>{en ? "Shush \u2014 loud white noise (as loud as a shower) mimics womb sounds" : "Shh \u2014 rumore bianco forte (forte come una doccia) imita i suoni dell'utero"}</li>
          <li>{en ? "Swing \u2014 small, fast, jiggly movements (supporting head). Not big swings" : "Dondolare \u2014 piccoli movimenti rapidi e tremolanti (sostenendo la testa). Non grandi oscillazioni"}</li>
          <li>{en ? "Suck \u2014 pacifier, clean finger, or breast. Sucking is deeply calming" : "Succhiare \u2014 ciuccio, dito pulito o seno. La suzione è profondamente calmante"}</li>
        </ul>
        <p className="mt-3">{en
          ? "Other soothing techniques: skin-to-skin contact, warm bath, going for a walk or drive, baby wearing (sling/carrier), gentle massage, singing or humming."
          : "Altre tecniche calmanti: contatto pelle a pelle, bagnetto caldo, fare una passeggiata o un giro in auto, portare il bambino (fascia/marsupio), massaggio delicato, cantare o canticchiare."
        }</p>
        <p className="font-semibold text-red-600 mt-3">{en
          ? "Never shake a baby. Shaking can cause brain damage or death. If you feel overwhelmed, put baby down safely in their cot and walk away. Call someone for support."
          : "Non scuotere mai un bambino. Lo scuotimento può causare danni cerebrali o morte. Se ti senti sopraffatto, metti il bambino giù in sicurezza nella culla e allontanati. Chiama qualcuno per supporto."
        }</p>
      </GuideSection>

      {/* Common Conditions */}
      <GuideSection title={useT("guide.commonConditions")}>
        <p className="font-semibold text-stone-700">{en ? "Jaundice:" : "Ittero:"}</p>
        <p>{en
          ? "Very common (affects ~60% of newborns). Causes yellowing of skin and eyes, usually appearing day 2\u20133. Mild jaundice resolves on its own within 2 weeks. Feed frequently to help flush bilirubin. If yellowing is severe, spreads to legs/arms, or baby is very sleepy/won't feed, seek medical attention \u2014 phototherapy (light treatment) may be needed."
          : "Molto comune (colpisce ~60% dei neonati). Causa ingiallimento della pelle e degli occhi, di solito appare al giorno 2\u20133. L'ittero lieve si risolve da solo entro 2 settimane. Allatta frequentemente per aiutare a eliminare la bilirubina. Se l'ingiallimento è grave, si estende a gambe/braccia, o il bambino è molto sonnolento/non mangia, cerca attenzione medica \u2014 potrebbe essere necessaria la fototerapia."
        }</p>
        <p className="font-semibold text-stone-700 mt-3">{en ? "Cradle cap:" : "Crosta lattea:"}</p>
        <p>{en
          ? "Yellowish, scaly patches on baby's scalp. Harmless and very common. Gently massage with oil (olive or coconut), leave for 15 minutes, then brush with a soft baby brush. Usually clears by 6\u201312 months."
          : "Chiazze giallastre e squamose sul cuoio capelluto del bambino. Innocua e molto comune. Massaggia delicatamente con olio (oliva o cocco), lascia per 15 minuti, poi spazzola con una spazzola morbida per bambini. Di solito scompare entro 6\u201312 mesi."
        }</p>
        <p className="font-semibold text-stone-700 mt-3">{en ? "Baby acne:" : "Acne neonatale:"}</p>
        <p>{en
          ? "Small red or white bumps on face, usually appearing at 2\u20134 weeks. Caused by maternal hormones. Don't squeeze or apply creams \u2014 it clears on its own within a few weeks."
          : "Piccoli brufoli rossi o bianchi sul viso, di solito appaiono a 2\u20134 settimane. Causati dagli ormoni materni. Non spremere o applicare creme \u2014 scompare da solo entro poche settimane."
        }</p>
        <p className="font-semibold text-stone-700 mt-3">{en ? "Vitamin D:" : "Vitamina D:"}</p>
        <p>{en
          ? "Your baby won't need vitamin D supplements while drinking 500ml or more of formula per day (it's already fortified). Once they drop below that amount (e.g. when starting solids), give 8.5201310 micrograms/day of vitamin D drops."
          : "Il vostro bambino non avrà bisogno di integratori di vitamina D finché beve 500ml o più di formula al giorno (è già fortificata). Una volta che scende sotto quella quantità (es. quando inizia i cibi solidi), date 8,5201310 microgrammi/giorno di gocce di vitamina D."
        }</p>
        <p className="font-semibold text-stone-700 mt-3">{en ? "Reflux/spit-up:" : "Reflusso/rigurgito:"}</p>
        <p>{en
          ? "Very common in newborns \u2014 the valve at the top of the stomach is still maturing. Keep baby upright for 20\u201330 minutes after feeds. Small, frequent feeds may help. It usually improves by 12 months. See a doctor if baby is in pain, refusing feeds, or not gaining weight."
          : "Molto comune nei neonati \u2014 la valvola in cima allo stomaco sta ancora maturando. Tieni il bambino in posizione verticale per 20\u201330 minuti dopo le poppate. Poppate piccole e frequenti possono aiutare. Di solito migliora entro 12 mesi. Consulta un medico se il bambino ha dolore, rifiuta le poppate o non aumenta di peso."
        }</p>
      </GuideSection>

      {/* Vaccinations */}
      <GuideSection title={useT("guide.vaccinations")}>
        <p>{en
          ? "Vaccinations protect your baby against serious diseases. In the UK, the schedule begins at 8 weeks:"
          : "Le vaccinazioni proteggono il tuo bambino da malattie gravi. Nel Regno Unito, il calendario inizia a 8 settimane:"
        }</p>
        <p className="font-semibold text-stone-700">{en ? "8 weeks:" : "8 settimane:"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "6-in-1 vaccine (diphtheria, tetanus, whooping cough, polio, Hib, hepatitis B)" : "Vaccino 6-in-1 (difterite, tetano, pertosse, polio, Hib, epatite B)"}</li>
          <li>{en ? "Rotavirus (oral drops)" : "Rotavirus (gocce orali)"}</li>
          <li>{en ? "MenB (meningococcal B)" : "MenB (meningococco B)"}</li>
        </ul>
        <p className="font-semibold text-stone-700 mt-3">{en ? "12 weeks:" : "12 settimane:"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "6-in-1 vaccine (2nd dose)" : "Vaccino 6-in-1 (2a dose)"}</li>
          <li>{en ? "Rotavirus (2nd dose)" : "Rotavirus (2a dose)"}</li>
          <li>{en ? "Pneumococcal (PCV)" : "Pneumococco (PCV)"}</li>
        </ul>
        <p className="mt-3">{en
          ? "After vaccination, baby may be fussy, sleepy, or have a mild fever. Infant paracetamol (Calpol) is recommended after MenB vaccine. Cuddles and feeding help comfort them."
          : "Dopo la vaccinazione, il bambino potrebbe essere irritabile, sonnolento o avere una leggera febbre. Il paracetamolo per neonati (Calpol) è raccomandato dopo il vaccino MenB. Coccole e poppate aiutano a confortarlo."
        }</p>
        <p className="text-stone-500 text-xs mt-2 italic">{en
          ? "Note: If baby is born in Mexico, the local vaccination schedule may differ. Discuss with your paediatrician which schedule to follow."
          : "Nota: Se il bambino nasce in Messico, il calendario vaccinale locale potrebbe essere diverso. Discuti con il tuo pediatra quale calendario seguire."
        }</p>
      </GuideSection>

      {/* Health & Safety */}
      <GuideSection title={useT("guide.health")}>
        <p>{en
          ? "Normal temperature is 36.4\u00b0C. A fever of 38\u00b0C or higher in a baby under 3 months needs immediate medical attention \u2014 don't wait."
          : "La temperatura normale è 36,4\u00b0C. Una febbre di 38\u00b0C o superiore in un bambino sotto i 3 mesi richiede attenzione medica immediata \u2014 non aspettare."
        }</p>
        <p>{en
          ? "Start tummy time from day one \u2014 even 1\u20132 minutes counts. Build up gradually to 15\u201320 minutes by 3 months. This strengthens neck, shoulder, and core muscles needed for rolling and crawling later."
          : "Inizia il 'tummy time' dal primo giorno \u2014 anche 1\u20132 minuti contano. Aumenta gradualmente fino a 15\u201320 minuti entro i 3 mesi. Questo rafforza i muscoli del collo, delle spalle e del core necessari per rotolare e gattonare in seguito."
        }</p>
        <p>{en
          ? "The fontanelles (soft spots) are normal \u2014 the front one closes by 12\u201318 months. A bulging fontanelle (when baby is calm and upright) or a sunken one (dehydration) needs medical attention."
          : "Le fontanelle (punti morbidi) sono normali \u2014 quella anteriore si chiude entro 12\u201318 mesi. Una fontanella sporgente (quando il bambino è calmo e in posizione verticale) o infossata (disidratazione) richiede attenzione medica."
        }</p>
      </GuideSection>

      {/* Milestones */}
      <GuideSection title={useT("guide.milestones")}>
        <div className="space-y-2">
          <p className="font-semibold text-stone-700">{en ? "Month 1:" : "Mese 1:"}</p>
          <p>{en
            ? "Focuses on faces 20\u201330cm away, startles at loud sounds, lifts head briefly during tummy time, sleeps most of the day, strong grasp reflex, prefers high-contrast patterns."
            : "Si concentra sui visi a 20\u201330cm di distanza, si spaventa ai rumori forti, solleva brevemente la testa durante il tummy time, dorme la maggior parte del giorno, forte riflesso di presa, preferisce motivi ad alto contrasto."
          }</p>
          <p className="font-semibold text-stone-700">{en ? "Month 2:" : "Mese 2:"}</p>
          <p>{en
            ? "First real smiles! Makes cooing and gurgling sounds, follows objects with eyes, holds head up more steadily, begins to notice their own hands, more alert during wake periods."
            : "Primi veri sorrisi! Emette suoni di 'coo' e gorgoglii, segue gli oggetti con gli occhi, tiene la testa più stabilmente, inizia a notare le proprie mani, più vigile durante i periodi di veglia."
          }</p>
          <p className="font-semibold text-stone-700">{en ? "Month 3:" : "Mese 3:"}</p>
          <p>{en
            ? "Recognises familiar faces and voices, reaches for objects, laughs and giggles, holds head steady, pushes up on arms during tummy time, may start to roll from tummy to back, more predictable sleep patterns emerging."
            : "Riconosce visi e voci familiari, cerca di afferrare gli oggetti, ride e fa versetti, tiene la testa ferma, si spinge sulle braccia durante il tummy time, potrebbe iniziare a rotolare dalla pancia alla schiena, emergono schemi di sonno più prevedibili."
          }</p>
        </div>
        <p className="text-stone-500 text-xs mt-3 italic">{en
          ? "Every baby develops at their own pace. These are guidelines, not deadlines. If you have concerns, speak to your health visitor or paediatrician."
          : "Ogni bambino si sviluppa al proprio ritmo. Queste sono linee guida, non scadenze. Se hai dubbi, parla con il tuo pediatra."
        }</p>
      </GuideSection>

      {/* Partner & Dad Bonding */}
      <GuideSection title={useT("guide.partnerBonding")}>
        <p>{en
          ? "Bonding isn't instant for everyone \u2014 and that's okay. It builds over time through daily care. Here are ways for dads and partners to connect:"
          : "Il legame non è istantaneo per tutti \u2014 e va bene così. Si costruisce nel tempo attraverso le cure quotidiane. Ecco modi per papà e partner di connettersi:"
        }</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Skin-to-skin contact \u2014 hold baby against your bare chest. This releases oxytocin and helps baby recognise your scent and heartbeat" : "Contatto pelle a pelle \u2014 tieni il bambino contro il petto nudo. Questo rilascia ossitocina e aiuta il bambino a riconoscere il tuo odore e battito cardiaco"}</li>
          <li>{en ? "Take ownership of bath time or a specific routine" : "Prenditi la responsabilità del bagnetto o di una routine specifica"}</li>
          <li>{en ? "Do night feeds (expressed milk or formula) so both parents share the load" : "Fai le poppate notturne (latte estratto o formula) così entrambi i genitori condividono il carico"}</li>
          <li>{en ? "Nappy changes \u2014 it's one-on-one time with eye contact and chat" : "Cambi pannolino \u2014 è tempo uno a uno con contatto visivo e chiacchiere"}</li>
          <li>{en ? "Baby wearing \u2014 use a sling or carrier for walks" : "Portare il bambino \u2014 usa una fascia o un marsupio per le passeggiate"}</li>
          <li>{en ? "Talk, read, and sing to baby \u2014 they learn your voice quickly" : "Parla, leggi e canta al bambino \u2014 impara la tua voce velocemente"}</li>
          <li>{en ? "Be the 'settling' parent \u2014 rock, bounce, and soothe baby to sleep" : "Sii il genitore che 'calma' \u2014 dondola, fai saltellare e calma il bambino per farlo addormentare"}</li>
        </ul>
        <p className="mt-3">{en
          ? "It's also normal for partners to feel anxious, overwhelmed, or even low after the birth. Postnatal depression affects 1 in 10 dads. Talk about how you're feeling and seek help if you need it."
          : "È anche normale per i partner sentirsi ansiosi, sopraffatti o anche giù dopo la nascita. La depressione postnatale colpisce 1 papà su 10. Parla di come ti senti e cerca aiuto se ne hai bisogno."
        }</p>
      </GuideSection>

      {/* Bonding & Wellbeing */}
      <GuideSection title={useT("guide.bonding")}>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Respond to cries promptly \u2014 you cannot spoil a newborn. Every response builds trust" : "Rispondi al pianto prontamente \u2014 non puoi viziare un neonato. Ogni risposta costruisce fiducia"}</li>
          <li>{en ? "Eye contact during feeds creates powerful connection" : "Il contatto visivo durante le poppate crea una connessione potente"}</li>
          <li>{en ? "Gentle massage \u2014 use a natural oil and stroke limbs, tummy (clockwise), and back" : "Massaggio delicato \u2014 usa un olio naturale e accarezza arti, pancia (in senso orario) e schiena"}</li>
          <li>{en ? "Accept help from family and friends \u2014 you don't have to do this alone" : "Accetta aiuto da famiglia e amici \u2014 non devi farcela da solo"}</li>
          <li>{en ? "Lower expectations \u2014 a fed baby and surviving parents is a successful day" : "Abbassa le aspettative \u2014 un bambino nutrito e genitori che sopravvivono è una giornata di successo"}</li>
        </ul>
        <p className="mt-3">{en
          ? "Postnatal depression can affect both parents. Warning signs: persistent sadness lasting more than 2 weeks, loss of interest, difficulty bonding with baby, intrusive thoughts, or withdrawing from others. It's treatable \u2014 speak to your doctor."
          : "La depressione postnatale può colpire entrambi i genitori. Segnali d'allarme: tristezza persistente che dura più di 2 settimane, perdita di interesse, difficoltà a legare con il bambino, pensieri intrusivi o ritiro dagli altri. È curabile \u2014 parla con il tuo medico."
        }</p>
      </GuideSection>

      {/* Hospital Bag */}
      <GuideSection title={useT("guide.hospitalBag")}>
        <p className="font-semibold text-stone-700">{en ? "For baby:" : "Per il bambino:"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "6\u20138 bodysuits/vests and sleepsuits" : "6\u20138 body/canottiere e tutine"}</li>
          <li>{en ? "A going-home outfit and hat" : "Un vestito per tornare a casa e un cappellino"}</li>
          <li>{en ? "Scratch mittens and socks" : "Guantini antigraffio e calzini"}</li>
          <li>{en ? "Newborn nappies (pack of 20+)" : "Pannolini per neonati (confezione da 20+)"}</li>
          <li>{en ? "Cotton wool or water wipes" : "Cotone o salviette ad acqua"}</li>
          <li>{en ? "Muslin cloths (5\u20136 \u2014 you'll use them constantly)" : "Mussole (5\u20136 \u2014 le userai costantemente)"}</li>
          <li>{en ? "Blanket for the car/journey home" : "Coperta per l'auto/viaggio a casa"}</li>
          <li>{en ? "Car seat (must be installed before birth)" : "Seggiolino auto (deve essere installato prima della nascita)"}</li>
        </ul>
        <p className="font-semibold text-stone-700 mt-3">{en ? "For parents:" : "Per i genitori:"}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Phone charger (long cable!)" : "Caricatore del telefono (cavo lungo!)"}</li>
          <li>{en ? "Comfortable clothes and slippers" : "Vestiti comodi e pantofole"}</li>
          <li>{en ? "Snacks and drinks" : "Snack e bevande"}</li>
          <li>{en ? "Toiletries and lip balm" : "Articoli da toilette e burrocacao"}</li>
          <li>{en ? "Camera or phone for photos" : "Fotocamera o telefono per le foto"}</li>
          <li>{en ? "Important documents (ID, insurance, birth plan)" : "Documenti importanti (ID, assicurazione, piano del parto)"}</li>
          <li>{en ? "Pillow from home for comfort" : "Cuscino da casa per il comfort"}</li>
        </ul>
      </GuideSection>

      {/* Nappy Bag Essentials */}
      <GuideSection title={useT("guide.nappyBag")}>
        <p>{en
          ? "For going out with a newborn, always have these packed and ready:"
          : "Per uscire con un neonato, tieni sempre pronto:"
        }</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "4\u20136 nappies (you'll be surprised how many you need)" : "4\u20136 pannolini (ti sorprenderà quanti ne servono)"}</li>
          <li>{en ? "Wipes and nappy bags for disposal" : "Salviette e sacchetti per lo smaltimento"}</li>
          <li>{en ? "Portable changing mat" : "Fasciatoio portatile"}</li>
          <li>{en ? "Spare outfit (for baby AND a spare top for you \u2014 spit-up happens)" : "Cambio vestiti (per il bambino E una maglia di ricambio per te \u2014 il rigurgito succede)"}</li>
          <li>{en ? "Muslin cloths (2\u20133)" : "Mussole (2\u20133)"}</li>
          <li>{en ? "Bottles and pre-measured formula portions" : "Biberon e porzioni di formula pre-dosate"}</li>
          <li>{en ? "Dummy/pacifier (if using)" : "Ciuccio (se lo usi)"}</li>
          <li>{en ? "Barrier cream" : "Crema barriera"}</li>
          <li>{en ? "Hat and blanket (for temperature changes)" : "Cappellino e coperta (per i cambi di temperatura)"}</li>
          <li>{en ? "Hand sanitiser" : "Disinfettante per le mani"}</li>
        </ul>
      </GuideSection>

      {/* When to Call the Doctor */}
      <GuideSection title={useT("guide.emergency")}>
        <p className="font-semibold text-red-600 mb-2">{en
          ? "Seek immediate medical help if your baby has:"
          : "Cerca aiuto medico immediato se il tuo bambino ha:"
        }</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{en ? "Fever of 38\u00b0C or higher (under 3 months = always urgent)" : "Febbre di 38\u00b0C o superiore (sotto i 3 mesi = sempre urgente)"}</li>
          <li>{en ? "Difficulty breathing, grunting, or blue/grey lips" : "Difficoltà a respirare, grugniti o labbra blu/grigie"}</li>
          <li>{en ? "Won't feed or feeding much less than usual for 8+ hours" : "Non mangia o mangia molto meno del solito per 8+ ore"}</li>
          <li>{en ? "Very sleepy, floppy, or hard to wake" : "Molto sonnolento, floscio o difficile da svegliare"}</li>
          <li>{en ? "Persistent vomiting (not just normal spit-up)" : "Vomito persistente (non solo il normale rigurgito)"}</li>
          <li>{en ? "Fewer than 6 wet nappies in 24 hours (dehydration)" : "Meno di 6 pannolini bagnati in 24 ore (disidratazione)"}</li>
          <li>{en ? "Yellow skin/eyes getting worse after day 3 (jaundice)" : "Pelle/occhi gialli che peggiorano dopo il giorno 3 (ittero)"}</li>
          <li>{en ? "Rash that doesn't fade when pressed (glass test \u2014 possible meningitis)" : "Eruzione cutanea che non scompare alla pressione (test del bicchiere \u2014 possibile meningite)"}</li>
          <li>{en ? "Bulging or sunken fontanelle" : "Fontanella sporgente o infossata"}</li>
          <li>{en ? "Seizures or unusual jerking movements" : "Convulsioni o movimenti a scatti insoliti"}</li>
          <li>{en ? "Umbilical cord area red, smelly, or oozing" : "Area del cordone ombelicale rossa, maleodorante o con perdite"}</li>
        </ul>
        <p className="mt-3 text-stone-500 text-sm">{en
          ? "Trust your instincts. If something feels wrong, it's always better to get checked. No doctor will ever mind you being cautious with a newborn."
          : "Fidati del tuo istinto. Se qualcosa non ti sembra giusto, è sempre meglio farsi controllare. Nessun medico ti giudicherà mai per essere prudente con un neonato."
        }</p>
      </GuideSection>

      {/* Further Reading */}
      <div className="mt-8 p-5 bg-white/60 rounded-2xl border border-stone-100">
        <h3 className="font-playfair text-lg font-semibold text-deep-teal mb-4">
          {en ? "Further Reading & Resources" : "Approfondimenti e risorse"}
        </h3>
        <p className="text-sm text-stone-600 mb-4">
          {en
            ? "Trusted sources for when you want to dive deeper into any topic:"
            : "Fonti affidabili per quando volete approfondire qualsiasi argomento:"
          }
        </p>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-stone-700 text-sm">{en ? "General Newborn Care" : "Cura generale del neonato"}</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-stone-600">
              <li><a href="https://www.nhs.uk/conditions/baby/" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline hover:text-teal-700">NHS - Your baby</a> {en ? "— comprehensive UK health service guide" : "— guida completa del servizio sanitario britannico"}</li>
              <li><a href="https://kidshealth.org/en/parents/guide-parents.html" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline hover:text-teal-700">KidsHealth - Guide for First-Time Parents</a> {en ? "— clear, practical advice" : "— consigli chiari e pratici"}</li>
              <li><a href="https://www.healthychildren.org/English/ages-stages/baby/Pages/default.aspx" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline hover:text-teal-700">HealthyChildren.org (AAP)</a> {en ? "— American Academy of Pediatrics" : "— Accademia Americana di Pediatria"}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-stone-700 text-sm">{en ? "Feeding" : "Alimentazione"}</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-stone-600">
              <li><a href="https://www.nhs.uk/conditions/baby/breastfeeding-and-bottle-feeding/bottle-feeding/" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline hover:text-teal-700">NHS - Bottle Feeding Advice</a> {en ? "— formula preparation, sterilising, paced feeding" : "— preparazione formula, sterilizzazione, alimentazione a ritmo"}</li>
              <li><a href="https://www.unicef.org.uk/babyfriendly/baby-friendly-resources/bottle-feeding-resources/" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline hover:text-teal-700">UNICEF Baby Friendly - Bottle Feeding</a> {en ? "— responsive bottle feeding guide" : "— guida all'alimentazione responsiva con biberon"}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-stone-700 text-sm">{en ? "Sleep & Safety" : "Sonno e sicurezza"}</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-stone-600">
              <li><a href="https://www.lullabytrust.org.uk/safer-sleep-advice/" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline hover:text-teal-700">The Lullaby Trust - Safer Sleep</a> {en ? "— UK SIDS prevention charity" : "— ente benefico britannico per la prevenzione della SIDS"}</li>
              <li><a href="https://www.basisonline.org.uk/" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline hover:text-teal-700">BASIS - Baby Sleep Info Source</a> {en ? "— evidence-based sleep information" : "— informazioni sul sonno basate sull'evidenza"}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-stone-700 text-sm">{en ? "Crying & Soothing" : "Pianto e consolazione"}</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-stone-600">
              <li><a href="http://www.purplecrying.info/" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline hover:text-teal-700">PURPLE Crying</a> {en ? "— understanding the crying curve in newborns" : "— comprendere la curva del pianto nei neonati"}</li>
              <li><a href="https://www.happiestbaby.com/blogs/baby/the-5-ss-for-soothing-babies" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline hover:text-teal-700">Happiest Baby - The 5 S's</a> {en ? "— Dr. Karp's soothing techniques" : "— tecniche calmanti del Dr. Karp"}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-stone-700 text-sm">{en ? "Mental Health & Wellbeing" : "Salute mentale e benessere"}</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-stone-600">
              <li><a href="https://www.nhs.uk/mental-health/conditions/post-natal-depression/overview/" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline hover:text-teal-700">NHS - Postnatal Depression</a> {en ? "— symptoms, support, and treatment" : "— sintomi, supporto e trattamento"}</li>
              <li><a href="https://www.postpartum.net/" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline hover:text-teal-700">Postpartum Support International</a> {en ? "— helpline and resources for new parents" : "— linea di aiuto e risorse per neo-genitori"}</li>
              <li><a href="https://www.mind.org.uk/information-support/types-of-mental-health-problems/postnatal-depression-and-perinatal-mental-health/" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline hover:text-teal-700">Mind - Perinatal Mental Health</a> {en ? "— for both parents" : "— per entrambi i genitori"}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-stone-700 text-sm">{en ? "Books (Recommended)" : "Libri (consigliati)"}</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-stone-600">
              <li>{en ? "\"The Happiest Baby on the Block\" — Harvey Karp (soothing & sleep)" : "\"Il bambino più felice del mondo\" — Harvey Karp (consolazione e sonno)"}</li>
              <li>{en ? "\"What to Expect the First Year\" — Heidi Murkoff (comprehensive reference)" : "\"Cosa aspettarsi il primo anno\" — Heidi Murkoff (riferimento completo)"}</li>
              <li>{en ? "\"Cribsheet\" — Emily Oster (data-driven parenting decisions)" : "\"Cribsheet\" — Emily Oster (decisioni genitoriali basate sui dati)"}</li>
              <li>{en ? "\"The Wonder Weeks\" — Hetty van de Rijt (developmental leaps)" : "\"Le settimane magiche\" — Hetty van de Rijt (salti di sviluppo)"}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-stone-700 text-sm">{en ? "Apps" : "App"}</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-stone-600">
              <li>{en ? "Huckleberry — feed/sleep/nappy tracking" : "Huckleberry — monitoraggio poppate/sonno/pannolini"}</li>
              <li>{en ? "Wonder Weeks — developmental leap predictions" : "Wonder Weeks — previsioni dei salti di sviluppo"}</li>
              <li>{en ? "Baby Tracker — all-in-one daily log" : "Baby Tracker — diario giornaliero tutto-in-uno"}</li>
            </ul>
          </div>
        </div>
      </div>
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
