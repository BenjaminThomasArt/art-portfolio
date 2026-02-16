import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { ImageZoom } from "@/components/ImageZoom";
import { useSwipe } from "@/hooks/useSwipe";
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
  const [confirmOrder, setConfirmOrder] = useState<{ title: string; price: string; material: string; size: string } | null>(null);
  const notifyMutation = trpc.orders.notifyPayPalClick.useMutation();

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
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4 text-[#003153]">Prints</h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">Faithful reproductions of original works, available to order in a range of materials and sizes. Custom orders available on request.</p>
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
                <PrintCard key={print.id} print={print} onImageClick={(src: string) => setZoomImage({ src, alt: print.title })} onOrder={(details) => setConfirmOrder(details)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <ShoppingBag size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-8">No prints available at the moment</p>
              <Link href="/gallery">
                <button className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Browse originals
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmOrder(null)} />
          <div className="relative bg-background border border-border rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
            <button
              onClick={() => setConfirmOrder(null)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-serif mb-1">Confirm order</h3>
            <p className="text-sm text-muted-foreground mb-4">You'll be redirected to PayPal to complete payment.</p>
            <div className="border border-border rounded-md p-4 mb-5">
              <p className="font-medium">'{confirmOrder.title}'</p>
              <p className="text-sm text-muted-foreground">{confirmOrder.material} &middot; {confirmOrder.size}</p>
              <p className="text-lg font-medium mt-2">{confirmOrder.price}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOrder(null)}
                className="flex-1 px-4 py-2 text-sm border border-border text-foreground bg-transparent hover:bg-muted transition-colors rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const amount = confirmOrder.price.replace('£', '');
                  notifyMutation.mutate({
                    title: confirmOrder.title,
                    price: confirmOrder.price,
                    material: confirmOrder.material,
                    size: confirmOrder.size,
                    section: "prints",
                  });
                  window.open(`https://paypal.me/benjaminthomasg/${amount}GBP`, '_blank');
                  setConfirmOrder(null);
                }}
                className="flex-1 px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md"
              >
                Pay with PayPal
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
              All payments are processed securely through PayPal. Your purchase is covered by PayPal Buyer Protection — if there's any issue with your order, you're fully protected.
            </p>
          </div>
        </div>
      )}

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

function PrintCard({ print, onImageClick, onOrder }: { print: any; onImageClick: (src: string) => void; onOrder: (details: { title: string; price: string; material: string; size: string }) => void }) {
  const [material, setMaterial] = useState<string>("giclee");
  const [size, setSize] = useState<string>("80x60");
  const [panelSelection, setPanelSelection] = useState<string>("left"); // left, right, both
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  const isDiptych = print.isDiptych === 1;
  
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
  
  const { ref: swipeRef, dragOffset, isDragging } = useSwipe({
    onSwipeLeft: () => {
      if (currentImageIndex < allImages.length - 1) {
        nextImage();
      }
    },
    onSwipeRight: () => {
      if (currentImageIndex > 0) {
        prevImage();
      }
    }
  });

  // Price mapping based on material and size
  const priceMap: Record<string, Record<string, string>> = {
    giclee: {
      "80x60": "£150",
      "120x100": "£225",
      "custom": "Contact for pricing"
    },
    pvc: {
      "80x60": "£125",
      "120x100": "£200",
      "custom": "Contact for pricing"
    },
    canvas: {
      "80x60": "£125",
      "120x100": "£200",
      "custom": "Contact for pricing"
    }
  };

  // Calculate price based on panel selection for diptychs
  let currentPrice = priceMap[material]?.[size] || "Contact for pricing";
  if (isDiptych && panelSelection === "both" && currentPrice.startsWith("£")) {
    const singlePrice = parseInt(currentPrice.replace("£", ""));
    currentPrice = `£${singlePrice * 2}`;
  }

  const materialLabels: Record<string, string> = {
    giclee: "Giclée",
    pvc: "PVC Board",
    canvas: "Canvas Inkjet"
  };
  const sizeLabels: Record<string, string> = {
    "80x60": "60×80cm",
    "120x100": "100×120cm",
    custom: "Custom size"
  };

  const handleOrder = () => {
    onOrder({
      title: print.title,
      price: currentPrice,
      material: materialLabels[material] || material,
      size: sizeLabels[size] || size
    });
  };

  return (
    <div className="group">
      <div ref={swipeRef} className="aspect-[3/4] overflow-hidden bg-[#f5f3f0] border border-gray-200 mb-4 relative group shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div 
          className="w-full h-full cursor-zoom-in p-[8%]"
          onClick={() => !isDragging && onImageClick(currentImage)}
          style={{
            transform: `translateX(${dragOffset}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <img
            src={currentImage}
            alt={print.title}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
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
          <h3 className="text-lg font-serif mb-2">'{print.title}'</h3>

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
              <SelectItem value="80x60">60 x 80 cm</SelectItem>
              <SelectItem value="120x100">100 x 120 cm</SelectItem>
              <SelectItem value="custom">Custom size - contact for details</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Diptych Panel Selector - only show for diptychs */}
        {isDiptych && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Panels</label>
            <Select value={panelSelection} onValueChange={setPanelSelection}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select panels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left panel</SelectItem>
                <SelectItem value="right">Right panel</SelectItem>
                <SelectItem value="both">Both panels</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price Display */}
        <div className="pt-2 pb-1 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {isDiptych && panelSelection === "both" ? "Total price:" : "Price:"}
            </span>
            <span className="text-xl font-serif">{currentPrice}</span>
          </div>
        </div>

        <button 
          onClick={handleOrder}
          className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs border border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background transition-colors"
        >
          <ShoppingBag size={13} />
          Order
        </button>
      </div>
    </div>
  );
}
