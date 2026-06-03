import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// ============ COUNTDOWN COMPONENT ============
function Countdown() {
  const dueDate = useMemo(() => new Date("2026-10-11T00:00:00"), []);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(dueDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(dueDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [dueDate]);

  return (
    <div className="text-center py-12">
      <p className="font-nunito text-sm uppercase tracking-[0.3em] text-terracotta mb-4">
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
      <p className="font-nunito text-sm text-stone-500 mt-6">
        October 11, 2026 — Hospital Español, Polanco, Mexico City
      </p>
    </div>
  );
}

function getTimeLeft(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// ============ TIMELINE/CHECKLIST COMPONENT ============
function Timeline() {
  const { data: items = [], refetch } = trpc.bambina.checklist.getAll.useQuery();
  const { isAuthenticated } = useAuth();
  const toggleMutation = trpc.bambina.checklist.toggle.useMutation({ onSuccess: () => refetch() });
  const updateNotesMutation = trpc.bambina.checklist.updateNotes.useMutation({ onSuccess: () => refetch() });
  const snoozeMutation = trpc.bambina.checklist.snooze.useMutation({ onSuccess: () => refetch() });
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  const phases = useMemo(() => {
    const grouped: Record<string, typeof items> = {};
    items.forEach((item) => {
      if (!grouped[item.phase]) grouped[item.phase] = [];
      grouped[item.phase].push(item);
    });
    return grouped;
  }, [items]);

  const phaseLabels: Record<string, string> = {
    pre_pregnancy: "Pre-Pregnancy",
    first_trimester: "First Trimester (Weeks 1-12)",
    second_trimester: "Second Trimester (Weeks 13-27)",
    third_trimester: "Third Trimester (Weeks 28-40)",
    birth: "Birth & Delivery",
    post_birth: "Post-Birth",
  };

  const phaseOrder = ["pre_pregnancy", "first_trimester", "second_trimester", "third_trimester", "birth", "post_birth"];
  const sortedPhases = phaseOrder.filter((p) => phases[p]).map((p) => [p, phases[p]] as const);

  return (
    <div className="space-y-8">
      {sortedPhases.map(([phase, phaseItems]) => (
        <div key={phase}>
          <h3 className="font-playfair text-xl font-semibold text-deep-teal mb-4 border-b border-terracotta/20 pb-2">
            {phaseLabels[phase] || phase}
          </h3>
          <div className="space-y-3">
            {phaseItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-all ${
                  item.completed ? "bg-cream/50 border-sage/30" : "bg-white border-terracotta/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={!!item.completed}
                    disabled={!isAuthenticated}
                    onCheckedChange={(checked) => {
                      toggleMutation.mutate({ id: item.id, completed: !!checked });
                    }}
                    className="mt-1 border-terracotta/40 data-[state=checked]:bg-deep-teal data-[state=checked]:border-deep-teal"
                  />
                  <div className="flex-1">
                    <p className={`font-nunito font-medium ${item.completed ? "line-through text-stone-400" : "text-stone-700"}`}>
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="font-nunito text-sm text-stone-500 mt-1">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-nunito px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta">
                        {item.category}
                      </span>
                      {item.dueWeek && (
                        <span className="text-xs font-nunito text-stone-400">Week {item.dueWeek}</span>
                      )}
                      {item.snoozedWeeks > 0 && (
                        <span className="text-xs font-nunito text-amber-600">Snoozed {item.snoozedWeeks}w</span>
                      )}
                    </div>
                    {item.notes && editingNotes !== item.id && (
                      <p className="font-nunito text-sm text-stone-500 mt-2 italic border-l-2 border-terracotta/20 pl-2">
                        {item.notes}
                      </p>
                    )}
                    {editingNotes === item.id && (
                      <div className="mt-2 flex gap-2">
                        <Textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="text-sm font-nunito"
                          rows={2}
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            updateNotesMutation.mutate({ id: item.id, notes: noteText });
                            setEditingNotes(null);
                          }}
                          className="bg-deep-teal hover:bg-deep-teal/90"
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                  {isAuthenticated && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingNotes(item.id);
                          setNoteText(item.notes || "");
                        }}
                        className="text-xs font-nunito text-stone-400 hover:text-terracotta transition-colors"
                        title="Add note"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => {
                          snoozeMutation.mutate({ id: item.id, weeks: (item.snoozedWeeks || 0) + 1 });
                          toast.info("Snoozed for 1 more week");
                        }}
                        className="text-xs font-nunito text-stone-400 hover:text-amber-600 transition-colors"
                        title="Snooze 1 week"
                      >
                        ⏰
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="font-nunito text-stone-400 text-center py-8">Loading timeline...</p>
      )}
    </div>
  );
}

// ============ PAYMENTS COMPONENT ============
function Payments() {
  const { data: payments = [], refetch } = trpc.bambina.payments.getAll.useQuery();
  const { isAuthenticated } = useAuth();
  const toggleMutation = trpc.bambina.payments.toggle.useMutation({ onSuccess: () => refetch() });

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
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 rounded-lg bg-sage/10 border border-sage/20">
          <p className="font-playfair text-2xl font-bold text-deep-teal">{totalsByStatus.paid}</p>
          <p className="font-nunito text-xs text-stone-500">Paid</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-terracotta/10 border border-terracotta/20">
          <p className="font-playfair text-2xl font-bold text-terracotta">{totalsByStatus.unpaid}</p>
          <p className="font-nunito text-xs text-stone-500">Remaining</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-cream border border-stone-200">
          <p className="font-playfair text-2xl font-bold text-stone-600">{totalsByStatus.total}</p>
          <p className="font-nunito text-xs text-stone-500">Total</p>
        </div>
      </div>

      {Object.entries(grouped).map(([month, monthPayments]) => (
        <div key={month}>
          <h3 className="font-playfair text-lg font-semibold text-deep-teal mb-3 border-b border-terracotta/20 pb-2">
            {month}
          </h3>
          <div className="space-y-2">
            {monthPayments.map((payment) => (
              <div
                key={payment.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  payment.paid ? "bg-sage/5 border-sage/20" : "bg-white border-terracotta/10"
                }`}
              >
                <Checkbox
                  checked={!!payment.paid}
                  disabled={!isAuthenticated}
                  onCheckedChange={(checked) => {
                    toggleMutation.mutate({ id: payment.id, paid: !!checked });
                  }}
                  className="border-terracotta/40 data-[state=checked]:bg-deep-teal data-[state=checked]:border-deep-teal"
                />
                <div className="flex-1">
                  <p className={`font-nunito text-sm ${payment.paid ? "line-through text-stone-400" : "text-stone-700"}`}>
                    {payment.description}
                  </p>
                  <span className="text-xs font-nunito px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta">
                    {payment.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className={`font-nunito font-semibold text-sm ${payment.paid ? "text-stone-400" : "text-deep-teal"}`}>
                    {payment.amount}
                  </p>
                  <p className="font-nunito text-xs text-stone-400">{payment.currency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
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
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-cream border border-stone-200">
        <div className="flex justify-between items-center mb-2">
          <span className="font-nunito text-sm text-stone-600">Shopping Progress</span>
          <span className="font-nunito text-sm font-semibold text-deep-teal">{progress.pct}%</span>
        </div>
        <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
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
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  item.purchased ? "bg-sage/5 border-sage/20" : "bg-white border-terracotta/10"
                }`}
              >
                <Checkbox
                  checked={!!item.purchased}
                  disabled={!isAuthenticated}
                  onCheckedChange={(checked) => {
                    toggleMutation.mutate({ id: item.id, purchased: !!checked });
                  }}
                  className="border-terracotta/40 data-[state=checked]:bg-deep-teal data-[state=checked]:border-deep-teal"
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
    <div className="space-y-4">
      {contacts.map((contact, i) => (
        <div key={i} className="p-5 rounded-lg border border-terracotta/10 bg-white hover:border-terracotta/30 transition-colors">
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
  const createMutation = trpc.bambina.notes.create.useMutation({ onSuccess: () => { refetch(); setNewNote({ category: "general", title: "", content: "" }); } });
  const deleteMutation = trpc.bambina.notes.delete.useMutation({ onSuccess: () => refetch() });
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
    <div className="space-y-6">
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
            <div className="p-4 rounded-lg border border-terracotta/20 bg-cream/50 space-y-3">
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
              <div key={note.id} className="p-4 rounded-lg border border-terracotta/10 bg-white">
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
    <div className="mt-12 pt-8 border-t border-terracotta/20">
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
            className="font-nunito text-sm text-stone-600 hover:text-deep-teal transition-colors p-3 rounded-lg border border-terracotta/10 hover:border-terracotta/30 text-center"
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

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Mexican tile border strip */}
      <div className="h-3 bg-gradient-to-r from-terracotta via-burnt-orange to-deep-teal" />

      {/* Header */}
      <header className="text-center py-12 px-4">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-deep-teal mb-2">
          Ben & Fed's Mexico Adventure
        </h1>
        <p className="font-nunito text-stone-500 text-lg">
          Our surrogacy journey — planning hub
        </p>
        {!isAuthenticated && (
          <a
            href={getLoginUrl()}
            className="inline-block mt-4 font-nunito text-sm text-terracotta hover:text-burnt-orange underline transition-colors"
          >
            Sign in to edit & sync →
          </a>
        )}
        {isAuthenticated && user && (
          <p className="font-nunito text-xs text-stone-400 mt-2">
            Signed in as {user.name || user.email || "User"} ✓
          </p>
        )}
      </header>

      {/* Decorative tile pattern */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-sm"
              style={{
                backgroundColor: i % 3 === 0 ? "#C2703E" : i % 3 === 1 ? "#1B5E5E" : "#D4845A",
                opacity: 0.6 + (i % 3) * 0.15,
              }}
            />
          ))}
        </div>
      </div>

      {/* Countdown */}
      <Countdown />

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <Tabs defaultValue="timeline" className="mt-12">
          <TabsList className="w-full flex flex-wrap justify-center gap-1 bg-cream border border-terracotta/10 p-1 rounded-xl h-auto">
            {[
              { value: "timeline", label: "Timeline" },
              { value: "payments", label: "Payments" },
              { value: "shopping", label: "To Buy" },
              { value: "contacts", label: "Contacts" },
              { value: "notes", label: "Notes" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="font-nunito text-sm data-[state=active]:bg-deep-teal data-[state=active]:text-white rounded-lg px-4 py-2"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-8">
            <TabsContent value="timeline"><Timeline /></TabsContent>
            <TabsContent value="payments"><Payments /></TabsContent>
            <TabsContent value="shopping"><ShoppingList /></TabsContent>
            <TabsContent value="contacts"><Contacts /></TabsContent>
            <TabsContent value="notes"><Notes /></TabsContent>
          </div>
        </Tabs>

        <Resources />

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="font-nunito text-xs text-stone-400">
            Made with love for our bambina 🇲🇽 🇬🇧 🇮🇹
          </p>
        </div>
      </div>

      {/* Bottom tile border */}
      <div className="h-3 bg-gradient-to-r from-deep-teal via-burnt-orange to-terracotta" />
    </div>
  );
}
