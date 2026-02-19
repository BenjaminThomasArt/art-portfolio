import { Link, useSearch } from "wouter";
import { Check, ArrowLeft, Mail } from "lucide-react";
import { useEffect } from "react";
import { trackPurchase } from "@/lib/metaPixel";

export default function ThankYou() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const orderRef = params.get("ref");
  const amount = params.get("amount");

  useEffect(() => {
    const value = amount ? parseFloat(amount) : 0;
    trackPurchase({ value: isNaN(value) ? 0 : value, contentName: orderRef ?? undefined });
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-green-600" />
        </div>

        <h1 className="text-3xl font-serif text-[#003153] mb-3">
          Thank you for your order
        </h1>

        {orderRef && (
          <p className="text-sm text-muted-foreground mb-2">
            Order reference: <span className="font-mono font-medium text-foreground">{orderRef}</span>
          </p>
        )}

        <p className="text-muted-foreground leading-relaxed mb-6">
          Your order has been received. Please complete your payment via PayPal if you haven't already, 
          and include your order reference in the payment note so we can match it to your order.
        </p>

        {/* What happens next */}
        <div className="border border-border rounded-lg p-5 mb-6 text-left">
          <h3 className="text-sm font-medium text-[#003153] mb-3">What happens next?</h3>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#003153] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Complete your PayPal payment with your order reference in the note</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#003153] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>We'll confirm your payment and begin preparing your artwork</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#003153] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>You'll receive an email when your artwork has been shipped</span>
            </li>
          </ol>
        </div>

        {/* Confirmation email note */}
        <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground mb-8">
          <Mail size={14} />
          <span>A confirmation email has been sent to your inbox</span>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/prints">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm border border-border text-foreground bg-transparent hover:bg-muted transition-colors rounded-md">
              <ArrowLeft size={14} />
              Browse more prints
            </button>
          </Link>
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm bg-[#003153] text-white hover:bg-[#003153]/90 transition-colors rounded-md">
              Return home
            </button>
          </Link>
        </div>

        {/* Support note */}
        <p className="text-xs text-muted-foreground mt-8 leading-relaxed">
          Questions about your order? Get in touch via{" "}
          <Link href="/contact" className="underline">our contact page</Link>{" "}
          or WhatsApp at +44 7597 765530.
        </p>
      </div>
    </div>
  );
}
