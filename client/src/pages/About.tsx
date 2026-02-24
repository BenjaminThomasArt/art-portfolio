import { trpc } from "@/lib/trpc";
import { Instagram, Facebook, Twitter, Linkedin, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function About() {
  const { data: artistInfo, isLoading } = trpc.artist.getInfo.useQuery();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is your creative process?",
      answer: "Everything starts as a traditional acrylic-on-canvas painting, but nothing stays that way for long. I rework pieces through photography, reprinting and further layers of paint — by brush, by spray, or both — until they become something new. Each piece carries the trace of every stage it's passed through. My 'upcycled' series takes the same idea in a different direction: second-hand vinyl records sourced around Hackney get their covers repainted, with the original record preserved and framed alongside. The process is always about iteration — creating something new from something old."
    },
    {
      question: "What materials do you use for prints?",
      answer: "I offer three premium print options: Giclée prints on archival fine art paper for museum-quality reproductions, PVC board prints for a modern, rigid display option, and Canvas inkjet prints for a traditional textured finish. All materials are carefully selected for longevity and color accuracy."
    },
    {
      question: "What's the difference between Giclée, PVC board, and Canvas inkjet?",
      answer: "Giclée uses archival inks on fine art paper for exceptional detail and color depth—ideal for collectors. PVC board offers a sleek, rigid surface perfect for contemporary spaces and easy mounting. Canvas inkjet provides a classic textured finish reminiscent of traditional paintings, ready for stretching or framing."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery typically takes 2-3 weeks from order confirmation. Custom size orders may require additional time. You'll receive tracking information once your print ships."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, I ship worldwide. International delivery times vary by location (typically 3-4 weeks). Customs duties and import taxes may apply depending on your country."
    },
    {
      question: "Can prints be framed?",
      answer: "Prints are sold unframed to give you flexibility in choosing frames that match your space. I'm happy to recommend framing services or provide guidance on suitable frame styles. Contact me for framing consultation."
    },
    {
      question: "How do custom sizes work?",
      answer: "Select \"Custom size - contact for details\" when ordering, and I'll reach out to discuss your specific dimensions and pricing. Custom prints maintain the original artwork's proportions and are produced to your exact specifications. Lead time for custom orders is typically 3-4 weeks."
    },
    {
      question: "How does payment work?",
      answer: "Payment is handled via PayPal. Once you've placed your order and we've confirmed the details, you can pay securely through my PayPal profile at paypal.me/benjaminthomasg. PayPal accepts all major credit and debit cards as well as PayPal balances, so you don't need a PayPal account to pay. I'll confirm receipt and get your order underway."
    }
  ];

  if (isLoading) {
    return (
      <div className="py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="h-12 bg-muted animate-pulse mb-8" />
            <div className="space-y-4">
              <div className="h-6 bg-muted animate-pulse" />
              <div className="h-6 bg-muted animate-pulse" />
              <div className="h-6 bg-muted animate-pulse w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const socialLinks = [
    {
      icon: Instagram,
      href: artistInfo?.instagramUrl || "https://instagram.com/__benjaminthomas",
      label: "Instagram",
    },
    artistInfo?.facebookUrl && {
      icon: Facebook,
      href: artistInfo.facebookUrl,
      label: "Facebook",
    },
    artistInfo?.twitterUrl && {
      icon: Twitter,
      href: artistInfo.twitterUrl,
      label: "Twitter",
    },
    artistInfo?.linkedinUrl && {
      icon: Linkedin,
      href: artistInfo.linkedinUrl,
      label: "LinkedIn",
    },
  ].filter(Boolean);

  return (
    <div className="py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-12 text-center text-[#003153]">
            About the artist
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Profile Image */}
            {artistInfo?.profileImageUrl && (
              <div className="md:col-span-1 flex justify-center md:justify-start">
                <div className="bg-muted overflow-hidden w-3/4 rounded-lg" style={{ aspectRatio: '5/6' }}>
                  <img
                    src={artistInfo.profileImageUrl}
                    alt={artistInfo.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            )}

            {/* Bio */}
            <div className={artistInfo?.profileImageUrl ? "md:col-span-2" : "md:col-span-3"}>
              <div className="prose prose-lg max-w-none">
                {(() => {
                  const bio = artistInfo?.bio ||
                     "Benjamin Thomas is a contemporary abstract artist based in London.\n\nHe approaches painting through iteration and investigation of process, exploring new works that build on what came before, amounting to an ever-connecting and evolving artistic practice.\n\nShapes, tones and gestures carry from one artwork to the next, returning through layering, repetition and reproduction. This 'recycling' of art creates links across different works, so while each stands independently, they contribute to a cohesive body of work.\n\nHis Upcycled series extends this approach into found objects; vintage vinyl records sourced across East London are reworked, refreshed and reimagined, fusing old life with new.";
                  const parts = bio.split(/(Upcycled)/);
                  return (
                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                      {parts.map((part, i) =>
                        part === "Upcycled" ? (
                          <Link key={i} href="/upcycles" className="text-[#003153] hover:text-[#004a7a] no-underline">
                            Upcycled
                          </Link>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </p>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-border pt-12 mb-12">
            <h3 className="text-2xl font-serif mb-8 text-center text-[#003153]">FAQs</h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-border rounded-lg">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                  >
                    <h4 className="text-sm font-serif pr-4">{faq.question}</h4>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed px-4 pb-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-border pt-12">
            <h3 className="text-xl font-serif mb-6 text-center text-[#003153]">Connect</h3>
            <div className="flex items-center justify-center gap-6">
              {socialLinks.map((link) => {
                if (!link) return null;
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon size={20} />
                    <span className="text-sm">{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
