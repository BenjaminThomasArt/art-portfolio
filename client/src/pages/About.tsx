import { trpc } from "@/lib/trpc";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export default function About() {
  const { data: artistInfo, isLoading } = trpc.artist.getInfo.useQuery();

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
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-12 text-center">
            About the Artist
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Profile Image */}
            {artistInfo?.profileImageUrl && (
              <div className="md:col-span-1 flex justify-center md:justify-start">
                <div className="aspect-square bg-muted overflow-hidden w-3/4 border border-black rounded-lg">
                  <img
                    src={artistInfo.profileImageUrl}
                    alt={artistInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Bio */}
            <div className={artistInfo?.profileImageUrl ? "md:col-span-2" : "md:col-span-3"}>
              <h2 className="text-2xl font-serif mb-4">
                {artistInfo?.name || "Benjamin Thomas"}
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {artistInfo?.bio ||
                    "Benjamin is a contemporary artist based in east London, whose work takes cues from nature, and is expressed through a range of modern techniques. With a background in creative industry, the foundations of Benjamin's work are creativity, invention and craft. His work is created with meticulous attention to detail and a deep passion for artistic expression. Benjamin's work has been featured in galleries and private collections in the UK and beyond."}
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-border pt-12 mb-12">
            <h3 className="text-2xl font-serif mb-8 text-center">Frequently Asked Questions</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-serif mb-2">What materials do you use for prints?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  We offer three premium print options: Giclée prints on archival fine art paper for museum-quality reproductions, 
                  PVC board prints for a modern, rigid display option, and Canvas inkjet prints for a traditional textured finish. 
                  All materials are carefully selected for longevity and color accuracy.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-serif mb-2">What's the difference between Giclée, PVC board, and Canvas inkjet?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Giclée</strong> uses archival inks on fine art paper for exceptional detail and color depth—ideal for collectors. 
                  <strong>PVC board</strong> offers a sleek, rigid surface perfect for contemporary spaces and easy mounting. 
                  <strong>Canvas inkjet</strong> provides a classic textured finish reminiscent of traditional paintings, ready for stretching or framing.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-serif mb-2">How long does delivery take?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Standard delivery typically takes 2-3 weeks from order confirmation. Custom size orders may require additional time. 
                  You'll receive tracking information once your print ships.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-serif mb-2">Do you offer international shipping?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Yes, we ship worldwide. International delivery times vary by location (typically 3-4 weeks). 
                  Customs duties and import taxes may apply depending on your country.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-serif mb-2">Can prints be framed?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Prints are sold unframed to give you flexibility in choosing frames that match your space. 
                  We're happy to recommend framing services or provide guidance on suitable frame styles. 
                  Contact us for framing consultation.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-serif mb-2">What's your return policy?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  We accept returns within 30 days of delivery for standard size prints in original condition. 
                  Custom size orders are made to order and cannot be returned unless damaged in transit. 
                  Please contact us immediately if your print arrives damaged.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-serif mb-2">How do custom sizes work?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Select "Custom size - contact for details" when ordering, and we'll reach out to discuss your specific dimensions and pricing. 
                  Custom prints maintain the original artwork's proportions and are produced to your exact specifications. 
                  Lead time for custom orders is typically 3-4 weeks.
                </p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-border pt-12">
            <h3 className="text-xl font-serif mb-6 text-center">Connect</h3>
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
