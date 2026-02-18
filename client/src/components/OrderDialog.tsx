import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { X, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

interface OrderItem {
  title: string;
  price: string;
  details?: string; // e.g. "Canvas Inkjet · 60×80cm"
  section: "prints" | "upcycles";
}

interface OrderDialogProps {
  item: OrderItem;
  onClose: () => void;
  paypalUsername: string;
}

type Step = "summary" | "delivery" | "confirm";

interface DeliveryForm {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

const INITIAL_FORM: DeliveryForm = {
  buyerName: "",
  buyerEmail: "",
  buyerPhone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  county: "",
  postcode: "",
  country: "United Kingdom",
};

export function OrderDialog({ item, onClose, paypalUsername }: OrderDialogProps) {
  const [step, setStep] = useState<Step>("summary");
  const [form, setForm] = useState<DeliveryForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryForm, string>>>({});
  const [orderRef, setOrderRef] = useState<string | null>(null);

  const createOrderMutation = trpc.orders.create.useMutation();

  const updateField = (field: keyof DeliveryForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateDeliveryForm = (): boolean => {
    const newErrors: Partial<Record<keyof DeliveryForm, string>> = {};

    if (!form.buyerName.trim()) newErrors.buyerName = "Name is required";
    if (!form.buyerEmail.trim()) {
      newErrors.buyerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.buyerEmail)) {
      newErrors.buyerEmail = "Please enter a valid email";
    }
    if (!form.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.postcode.trim()) newErrors.postcode = "Postcode is required";
    if (!form.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === "summary") {
      setStep("delivery");
    } else if (step === "delivery") {
      if (validateDeliveryForm()) {
        setStep("confirm");
      }
    }
  };

  const handleBack = () => {
    if (step === "delivery") setStep("summary");
    if (step === "confirm") setStep("delivery");
  };

  const handleConfirmAndPay = async () => {
    try {
      const result = await createOrderMutation.mutateAsync({
        buyerName: form.buyerName.trim(),
        buyerEmail: form.buyerEmail.trim(),
        buyerPhone: form.buyerPhone.trim() || undefined,
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim() || undefined,
        city: form.city.trim(),
        county: form.county.trim() || undefined,
        postcode: form.postcode.trim(),
        country: form.country.trim(),
        section: item.section,
        itemTitle: item.title,
        itemDetails: item.details,
        price: item.price,
      });

      setOrderRef(result.orderRef);

      // Open PayPal with order ref in the note
      const amount = item.price.replace("£", "");
      window.open(
        `https://paypal.me/${paypalUsername}/${amount}GBP`,
        "_blank"
      );
    } catch (err) {
      console.error("Failed to create order:", err);
    }
  };

  // Success state — order placed
  if (orderRef) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-background border border-border rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="text-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Check size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-serif mb-1">Order placed</h3>
            <p className="text-sm text-muted-foreground">
              Thank you for your order! Please complete payment via PayPal.
            </p>
          </div>

          <div className="border border-border rounded-md p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Order ref</span>
              <span className="font-mono text-sm font-medium">{orderRef}</span>
            </div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Item</span>
              <span className="text-sm text-right">'{item.title}'</span>
            </div>
            {item.details && (
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Details</span>
                <span className="text-sm text-right">{item.details}</span>
              </div>
            )}
            <div className="flex justify-between items-start">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
              <span className="text-lg font-serif">{item.price}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mb-4 leading-relaxed">
            Please include your order reference <strong>{orderRef}</strong> in the PayPal payment note. If the PayPal window didn't open, click below.
          </p>

          <button
            onClick={() => {
              const amount = item.price.replace("£", "");
              window.open(`https://paypal.me/${paypalUsername}/${amount}GBP`, "_blank");
            }}
            className="w-full px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md mb-2"
          >
            Open PayPal
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm border border-border text-foreground bg-transparent hover:bg-muted transition-colors rounded-md"
          >
            Done
          </button>

          <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
            All payments are processed securely through PayPal. Your purchase is covered by PayPal Buyer Protection — if there's any issue with your order, you're fully protected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background border border-border rounded-lg shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          {(["summary", "delivery", "confirm"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  s === step
                    ? "bg-foreground text-background"
                    : (["summary", "delivery", "confirm"].indexOf(step) > i)
                      ? "bg-foreground/20 text-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Order Summary */}
        {step === "summary" && (
          <>
            <h3 className="text-lg font-serif mb-1">Order summary</h3>
            <p className="text-sm text-muted-foreground mb-4">Review your selection before continuing.</p>
            <div className="border border-border rounded-md p-4 mb-5">
              <p className="font-medium">'{item.title}'</p>
              {item.details && <p className="text-sm text-muted-foreground">{item.details}</p>}
              <p className="text-lg font-medium mt-2">{item.price}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm border border-border text-foreground bg-transparent hover:bg-muted transition-colors rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md inline-flex items-center justify-center gap-1.5"
              >
                Continue
                <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Delivery Details */}
        {step === "delivery" && (
          <>
            <h3 className="text-lg font-serif mb-1">Delivery details</h3>
            <p className="text-sm text-muted-foreground mb-4">Where should we send your artwork?</p>

            <div className="space-y-3 mb-5">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.buyerName}
                  onChange={(e) => updateField("buyerName", e.target.value)}
                  className={`mt-1 w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground ${
                    errors.buyerName ? "border-red-400" : "border-border"
                  }`}
                  placeholder="Your full name"
                />
                {errors.buyerName && <p className="text-xs text-red-500 mt-0.5">{errors.buyerName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.buyerEmail}
                  onChange={(e) => updateField("buyerEmail", e.target.value)}
                  className={`mt-1 w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground ${
                    errors.buyerEmail ? "border-red-400" : "border-border"
                  }`}
                  placeholder="your@email.com"
                />
                {errors.buyerEmail && <p className="text-xs text-red-500 mt-0.5">{errors.buyerEmail}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Phone <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={form.buyerPhone}
                  onChange={(e) => updateField("buyerPhone", e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="+44 7700 900000"
                />
              </div>

              <hr className="border-border" />

              {/* Address Line 1 */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Address line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.addressLine1}
                  onChange={(e) => updateField("addressLine1", e.target.value)}
                  className={`mt-1 w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground ${
                    errors.addressLine1 ? "border-red-400" : "border-border"
                  }`}
                  placeholder="Street address"
                />
                {errors.addressLine1 && <p className="text-xs text-red-500 mt-0.5">{errors.addressLine1}</p>}
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Address line 2 <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.addressLine2}
                  onChange={(e) => updateField("addressLine2", e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="Flat, suite, unit, etc."
                />
              </div>

              {/* City + County row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className={`mt-1 w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground ${
                      errors.city ? "border-red-400" : "border-border"
                    }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-0.5">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    County <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.county}
                    onChange={(e) => updateField("county", e.target.value)}
                    className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                    placeholder="County"
                  />
                </div>
              </div>

              {/* Postcode + Country row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Postcode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.postcode}
                    onChange={(e) => updateField("postcode", e.target.value)}
                    className={`mt-1 w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground ${
                      errors.postcode ? "border-red-400" : "border-border"
                    }`}
                    placeholder="SW1A 1AA"
                  />
                  {errors.postcode && <p className="text-xs text-red-500 mt-0.5">{errors.postcode}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className={`mt-1 w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground ${
                      errors.country ? "border-red-400" : "border-border"
                    }`}
                    placeholder="United Kingdom"
                  />
                  {errors.country && <p className="text-xs text-red-500 mt-0.5">{errors.country}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-2 text-sm border border-border text-foreground bg-transparent hover:bg-muted transition-colors rounded-md inline-flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md inline-flex items-center justify-center gap-1.5"
              >
                Review order
                <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Confirm & Pay */}
        {step === "confirm" && (
          <>
            <h3 className="text-lg font-serif mb-1">Confirm & pay</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Review your order details, then proceed to PayPal.
            </p>

            <div className="border border-border rounded-md p-4 mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Item</p>
              <p className="font-medium">'{item.title}'</p>
              {item.details && <p className="text-sm text-muted-foreground">{item.details}</p>}
              <p className="text-lg font-serif mt-1">{item.price}</p>
            </div>

            <div className="border border-border rounded-md p-4 mb-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Deliver to</p>
              <p className="font-medium">{form.buyerName}</p>
              <p className="text-sm text-muted-foreground">{form.buyerEmail}</p>
              {form.buyerPhone && <p className="text-sm text-muted-foreground">{form.buyerPhone}</p>}
              <p className="text-sm text-muted-foreground mt-1">
                {[form.addressLine1, form.addressLine2].filter(Boolean).join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">
                {[form.city, form.county, form.postcode].filter(Boolean).join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">{form.country}</p>
            </div>

            {createOrderMutation.error && (
              <p className="text-sm text-red-500 mb-3">
                Something went wrong. Please try again.
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                disabled={createOrderMutation.isPending}
                className="flex-1 px-4 py-2 text-sm border border-border text-foreground bg-transparent hover:bg-muted transition-colors rounded-md inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                onClick={handleConfirmAndPay}
                disabled={createOrderMutation.isPending}
                className="flex-1 px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm & pay with PayPal"
                )}
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
              All payments are processed securely through PayPal. Your purchase is covered by PayPal Buyer Protection — if there's any issue with your order, you're fully protected.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
