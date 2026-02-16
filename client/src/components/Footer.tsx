import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Footer() {
  const { data: artistInfo } = trpc.artist.getInfo.useQuery();

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

  const navLinks = [
    { label: "Originals", href: "/originals" },
    { label: "Prints", href: "/prints" },
    { label: "Upcycles", href: "/upcycles" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => {
              if (!link) return null;
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={link.label}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="text-xs text-muted-foreground text-center">
            <p>© {new Date().getFullYear()} {artistInfo?.name || "Benjamin Thomas"}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
