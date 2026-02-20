import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown, Instagram, Mail } from "lucide-react";

export default function Home() {
  const { data: artistInfo } = trpc.artist.getInfo.useQuery();
  
  // Hardcoded featured artworks for homepage - using first single-painting images from Prints section
  const featuredArtworks = [
    {
      id: 1,
      title: 'The Subject of Paint',
      year: 2026,
      imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/MWJVdOgEzUOCqJqg.jpeg',
      medium: 'Mixed media on PVC board'
    },
    {
      id: 3,
      title: 'Chrysalis',
      year: 2026,
      imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/ptVwaEZnLpjzVezQ.jpeg',
      medium: 'Mixed media on canvas'
    }
  ];
  const isLoading = false;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center bg-muted/30 overflow-hidden group">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45 transition-transform duration-[3000ms] ease-out group-hover:scale-110"
          style={{
            backgroundImage: 'url(https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/RcShSgUXwbChGdpY.jpeg)'
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-background/60" />
        <div className="container text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6 text-[#003153]">
            {artistInfo?.name || "Benjamin Thomas"}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-[#D87093] font-light tracking-wide">
            Contemporary mixed media artist, London UK
          </p>
          <div className="flex items-center justify-center gap-1.5 sm:gap-3">
            <Link href="/originals">
              <Button variant="outline" className="text-[11px] sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
                Originals
              </Button>
            </Link>
            <Link href="/prints">
              <Button variant="outline" className="text-[11px] sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
                Prints
              </Button>
            </Link>
            <Link href="/upcycles">
              <Button variant="outline" className="text-[11px] sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
                Upcycles
              </Button>
            </Link>
            <a
              href={artistInfo?.instagramUrl || "https://instagram.com/__benjaminthomas"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="px-2 sm:px-3 h-8 sm:h-10">
                <Instagram size={14} className="sm:w-[18px] sm:h-[18px]" />
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" className="px-2 sm:px-3 h-8 sm:h-10">
                <Mail size={14} className="sm:w-[18px] sm:h-[18px]" />
              </Button>
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={24} className="text-muted-foreground/60" />
        </div>
      </section>

      {/* Featured works */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-4 text-[#003153]">Featured works</h2>
            <p className="text-sm md:text-base text-muted-foreground">A selection of recent highlights</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse" />
              ))}
            </div>
          ) : featuredArtworks && featuredArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {featuredArtworks.slice(0, 6).map((artwork) => (
                <Link key={artwork.id} href={`/artwork/${artwork.id}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-square overflow-hidden bg-muted mb-4">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-lg font-serif mb-1">'{artwork.title}'</h3>
                    <p className="text-sm text-muted-foreground">
                      {artwork.year}{artwork.medium && ` • ${artwork.medium}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured artworks yet</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/originals">
              <Button variant="outline" size="lg">
                View originals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-6 text-[#003153]">
            Printed reproductions
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
            High-quality prints of selected works are available.<br />Get in touch to enquire about sizes and pricing.
          </p>
          <Link href="/prints">
            <Button size="lg" variant="outline">Browse prints</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
