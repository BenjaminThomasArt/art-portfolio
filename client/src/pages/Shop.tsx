import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { ImageZoom } from "@/components/ImageZoom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Shop() {
  const { data: prints, isLoading } = trpc.prints.getAll.useQuery();
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] hover:scale-110"
          style={{
            backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/shop-backgrounds/print-photo-bg.jpg)',
            opacity: 0.45
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center px-8 md:px-16 lg:px-24">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight mb-4">Shop</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">Quality prints available to order in a range of materials and sizes. Custom orders available on request.</p>
          </div>
        </div>
      </div>

      {/* Print Catalog Section */}
      <div className="py-24">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <div className="h-6 bg-muted animate-pulse w-3/4" />
                  <div className="h-10 bg-muted animate-pulse w-full" />
                </div>
              ))}
            </div>
          ) : prints && prints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {prints.map((print) => (
                <PrintCard key={print.id} print={print} onImageClick={() => setZoomImage({ src: print.imageUrl, alt: print.title })} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <ShoppingBag size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-8">No prints available at the moment</p>
              <Link href="/gallery">
                <button className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Browse Gallery
                </button>
              </Link>
            </div>
          )}
        </div>
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

function PrintCard({ print, onImageClick }: { print: any; onImageClick: () => void }) {
  const [material, setMaterial] = useState<string>("giclee");
  const [size, setSize] = useState<string>("80x60");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  // Build array of all images
  // Prioritize artwork gallery images from Gallery section (which already include the main image)
  let allImages: string[] = [];
  
  // First try to use artwork gallery images (from Gallery section)
  if (print.artworkGalleryImages) {
    try {
      const artworkGalleryArray = JSON.parse(print.artworkGalleryImages);
      if (artworkGalleryArray && artworkGalleryArray.length > 0) {
        allImages = artworkGalleryArray;
      }
    } catch (e) {
      console.error('Failed to parse artwork gallery images:', e);
    }
  }
  
  // If no artwork gallery images, use print-specific gallery images
  if (allImages.length === 0 && print.galleryImages) {
    try {
      const galleryArray = JSON.parse(print.galleryImages);
      allImages = galleryArray;
    } catch (e) {
      console.error('Failed to parse print gallery images:', e);
    }
  }
  
  // Fallback to main image if no gallery images
  if (allImages.length === 0) {
    allImages = [print.imageUrl];
  }
  
  const hasMultipleImages = allImages.length > 1;
  const currentImage = allImages[currentImageIndex];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Price mapping based on size
  const priceMap: Record<string, string> = {
    "80x60": "£150",
    "120x100": "£225",
    "custom": "Contact for pricing"
  };

  const currentPrice = priceMap[size] || "Contact for pricing";

  const handleOrder = () => {
    // Build query params with selected options
    const params = new URLSearchParams({
      printTitle: print.title,
      material: material,
      size: size
    });
    window.location.href = `/contact?${params.toString()}`;
  };

  return (
    <div className="group">
      <div className="relative aspect-square overflow-hidden bg-white border border-gray-200 mb-4">
        <div 
          className="w-full h-full cursor-zoom-in"
          onClick={onImageClick}
        >
          <img
            src={currentImage}
            alt={print.title}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
        
        {hasMultipleImages && (
          <>
            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              ‹
            </button>
            
            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              ›
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-serif mb-2">'{print.title}'</h3>
          {print.description && (
            <p className="text-sm text-muted-foreground mb-2">{print.description}</p>
          )}
          {print.price && (
            <p className="text-lg font-serif mt-2">{print.price}</p>
          )}
        </div>

        {/* Material Selector */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Material</label>
          <Select value={material} onValueChange={setMaterial}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="giclee">Giclée</SelectItem>
              <SelectItem value="pvc">PVC board</SelectItem>
              <SelectItem value="canvas">Canvas inkjet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Size Selector */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Size</label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="80x60">80 x 60 cm</SelectItem>
              <SelectItem value="120x100">120 x 100 cm</SelectItem>
              <SelectItem value="custom">Custom size - contact for details</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Display */}
        <div className="pt-2 pb-1 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Price (per piece):</span>
            <span className="text-xl font-serif">{currentPrice}</span>
          </div>
        </div>

        <button 
          onClick={handleOrder}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ShoppingBag size={18} />
          Order
        </button>
      </div>
    </div>
  );
}
