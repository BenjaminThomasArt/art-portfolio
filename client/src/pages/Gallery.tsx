import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";
import { ImageZoom } from "@/components/ImageZoom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery() {
  const { data: artworks, isLoading } = trpc.artworks.getAll.useQuery();
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);
  const [carouselIndices, setCarouselIndices] = useState<Record<number, number>>({});

  const getCarouselIndex = (artworkId: number) => carouselIndices[artworkId] || 0;
  const setCarouselIndex = (artworkId: number, index: number) => {
    setCarouselIndices(prev => ({ ...prev, [artworkId]: index }));
  };

  return (
    <div className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Gallery</h1>
          <p className="text-lg text-muted-foreground">Explore more works</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
            ))}
          </div>
        ) : artworks && artworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork) => {
              const galleryImages = artwork.galleryImages ? JSON.parse(artwork.galleryImages as string) : [];
              const hasCarousel = galleryImages.length > 0;
              const currentIndex = getCarouselIndex(artwork.id);
              const displayImage = hasCarousel ? galleryImages[currentIndex] : artwork.imageUrl;
              const totalImages = hasCarousel ? galleryImages.length : 1;

              return (
              <div key={artwork.id} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-muted mb-4 relative">
                  <div 
                    className="w-full h-full cursor-zoom-in"
                    onClick={() => setZoomImage({ src: displayImage, alt: artwork.title })}
                  >
                    <img
                      src={displayImage}
                      alt={artwork.title}
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  
                  {hasCarousel && (
                    <>
                      {/* Carousel Navigation */}
                      {currentIndex > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCarouselIndex(artwork.id, currentIndex - 1);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={20} />
                        </button>
                      )}
                      {currentIndex < totalImages - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCarouselIndex(artwork.id, currentIndex + 1);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Next image"
                        >
                          <ChevronRight size={20} />
                        </button>
                      )}
                      
                      {/* Dot Indicators */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {Array.from({ length: totalImages }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCarouselIndex(artwork.id, idx);
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentIndex
                                ? "bg-white w-6"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                      
                      {/* Image Counter */}
                      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {currentIndex + 1} / {totalImages}
                      </div>
                    </>
                  )}
                </div>
                <Link href={`/artwork/${artwork.id}`}>
                  <h3 className="text-lg font-serif mb-1 hover:underline cursor-pointer">'{artwork.title}'</h3>
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {artwork.year && <span>{artwork.year}</span>}
                  {artwork.medium && (
                    <>
                      {artwork.year && <span>•</span>}
                      <span>{artwork.medium}</span>
                    </>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-lg text-muted-foreground">No artworks available yet</p>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      <ImageZoom
        src={zoomImage?.src || ""}
        alt={zoomImage?.alt || ""}
        isOpen={!!zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}
