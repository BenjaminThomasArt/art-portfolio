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
              <div className="md:col-span-1">
                <div className="aspect-square bg-muted overflow-hidden">
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
