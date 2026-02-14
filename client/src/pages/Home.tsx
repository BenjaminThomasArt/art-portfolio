import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram } from "lucide-react";

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
      title: 'Portmanteau',
      year: 2026,
      imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/FzuGrrPCmrknQgBR.jpg',
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
            Fine art & more
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="gap-2">
                View Originals <ArrowRight size={18} />
              </Button>
            </Link>
            <a
              href={artistInfo?.instagramUrl || "https://instagram.com/__benjaminthomas"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="gap-2">
                <Instagram size={18} /> Follow on Instagram
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-4 text-[#003153]">Featured Works</h2>
            <p className="text-muted-foreground">A selection of recent pieces</p>
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
            <Link href="/gallery">
              <Button variant="outline" size="lg">
                View All Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-6 text-[#003153]">
            Interested in a print?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            High-quality prints of selected works are available. Get in touch to enquire about sizes and pricing.
          </p>
          <Link href="/contact">
            <Button size="lg">Contact Me</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
