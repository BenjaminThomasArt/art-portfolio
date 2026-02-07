import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";
import { ImageZoom } from "@/components/ImageZoom";
import { ArtworkCarousel } from "@/components/ArtworkCarousel";

export default function Gallery() {
  const { data: artworks, isLoading } = trpc.artworks.getAll.useQuery();
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

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

              return (
              <div key={artwork.id} className="group">
                {hasCarousel ? (
                  <ArtworkCarousel
                    artworkId={artwork.id}
                    galleryImages={galleryImages}
                    artworkTitle={artwork.title}
                    onImageClick={(src, alt) => setZoomImage({ src, alt })}
                  />
                ) : (
                  <div className="aspect-[3/4] overflow-hidden bg-muted mb-4 relative">
                    <div 
                      className="w-full h-full cursor-zoom-in"
                      onClick={() => setZoomImage({ src: artwork.imageUrl, alt: artwork.title })}
                    >
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        loading="lazy"
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                )}
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
