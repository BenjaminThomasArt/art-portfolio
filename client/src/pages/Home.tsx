import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram } from "lucide-react";

export default function Home() {
  const { data: featuredArtworks, isLoading } = trpc.artworks.getFeatured.useQuery();
  const { data: artistInfo } = trpc.artist.getInfo.useQuery();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center bg-muted/30 overflow-hidden group">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45 transition-transform duration-[3000ms] ease-out group-hover:scale-110"
          style={{
            backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/artworks/subject-of-paint-1-1769770549126.jpeg)'
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-background/60" />
        <div className="container text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6">
            {artistInfo?.name || "Benjamin Thomas"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contemporary artist exploring themes of idea, imagination and revival
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/gallery">
              <Button size="lg" className="gap-2">
                View Gallery <ArrowRight size={18} />
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
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-4">Featured Works</h2>
            <p className="text-muted-foreground">A selection of recent pieces</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse" />
              ))}
            </div>
          ) : featuredArtworks && featuredArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtworks.slice(0, 6).map((artwork) => (
                <Link key={artwork.id} href={`/artwork/${artwork.id}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-square overflow-hidden bg-muted mb-4">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-lg font-serif mb-1">{artwork.title}</h3>
                    {artwork.year && (
                      <p className="text-sm text-muted-foreground">{artwork.year}</p>
                    )}
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
          <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-6">
            Interested in a Print?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            High-quality prints of selected works are available. Get in touch to inquire about sizes and pricing.
          </p>
          <Link href="/contact">
            <Button size="lg">Contact Me</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
