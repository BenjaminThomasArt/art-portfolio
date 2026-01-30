import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";

export default function Shop() {
  const { data: artworks, isLoading } = trpc.shop.getArtworks.useQuery();

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] hover:scale-110"
          style={{
            backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/shop-hero/shop-hero-image.jpg)',
            opacity: 0.45
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight mb-4">Shop</h1>
            <p className="text-lg md:text-xl text-muted-foreground">High-quality prints available to purchase</p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="py-24">
      <div className="container">

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-muted animate-pulse" />
                <div className="h-6 bg-muted animate-pulse w-3/4" />
                <div className="h-8 bg-muted animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        ) : artworks && artworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork) => (
              <div key={artwork.id} className="group">
                <Link href={`/artwork/${artwork.id}`}>
                  <div className="aspect-square overflow-hidden bg-muted mb-4 cursor-pointer">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-serif mb-1">{artwork.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {artwork.year && <span>{artwork.year}</span>}
                      {artwork.medium && (
                        <>
                          {artwork.year && <span>•</span>}
                          <span>{artwork.medium}</span>
                        </>
                      )}
                    </div>
                    {artwork.dimensions && (
                      <p className="text-sm text-muted-foreground mt-1">{artwork.dimensions}</p>
                    )}
                  </div>

                  {artwork.price && (
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xl font-serif">{artwork.price}</span>
                      
                      {artwork.paypalButtonId ? (
                        <form
                          action="https://www.paypal.com/cgi-bin/webscr"
                          method="post"
                          target="_blank"
                        >
                          <input type="hidden" name="cmd" value="_s-xclick" />
                          <input type="hidden" name="hosted_button_id" value={artwork.paypalButtonId} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
                          >
                            <ShoppingCart size={16} />
                            Buy Now
                          </button>
                        </form>
                      ) : (
                        <Link href={`/contact`}>
                          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm">
                            Inquire
                          </button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <ShoppingCart size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-8">No artworks available for purchase at the moment</p>
            <Link href="/gallery">
              <button className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Browse Gallery
              </button>
            </Link>
          </div>
         )}      </div>
      </div>
    </div>
  );
}
