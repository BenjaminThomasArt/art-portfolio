import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { ImageZoom } from "@/components/ImageZoom";
import { OrderDialog } from "@/components/OrderDialog";
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
  const [orderItem, setOrderItem] = useState<{ title: string; price: string; details: string; section: "prints" | "upcycles" } | null>(null);

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
                <PrintCard key={print.id} print={print} onImageClick={(src: string) => setZoomImage({ src, alt: print.title })} onOrder={(details) => setOrderItem(details)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <ShoppingBag size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-8">No prints available at the moment</p>
              <Link href="/originals">
                <button className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Browse originals
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Order Dialog */}
      {orderItem && (
        <OrderDialog
          item={orderItem}
          onClose={() => setOrderItem(null)}
          paypalUsername="benjaminthomasg"
        />
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

function PrintCard({ print, onImageClick, onOrder }: { print: any; onImageClick: (src: string) => void; onOrder: (details: { title: string; price: string; details: string; section: "prints" | "upcycles" }) => void }) {
  const [material, setMaterial] = useState<string>("canvas");
  const [size, setSize] = useState<string>("80x60");
  const [panelSelection, setPanelSelection] = useState<string>("left"); // left, right, both
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  // Robust fallback: check panelCount, then isDiptych flag, then description text
  const panelCount = print.panelCount && print.panelCount > 1
    ? print.panelCount
    : print.isDiptych === 1
      ? 2
      : print.description?.toLowerCase().includes('triptych')
        ? 3
        : print.description?.toLowerCase().includes('diptych')
          ? 2
          : 1;
  const isMultiPanel = panelCount > 1;
  const isDiptych = panelCount === 2;
  const isTriptych = panelCount === 3;
  
  // Build array of all images
  // Build carousel from artwork gallery images + print-specific gallery images
  let allImages: string[] = [];
  
  // Start with artwork gallery images (from Gallery/Originals section)
  if (print.artworkGalleryImages) {
    try {
      const artworkGalleryArray = JSON.parse(print.artworkGalleryImages);
      if (artworkGalleryArray && artworkGalleryArray.length > 0) {
        allImages = [...artworkGalleryArray];
      }
    } catch (e) {
      console.error('Failed to parse artwork gallery images:', e);
    }
  }
  
  // Then append print-specific gallery images (detail shots, in-situ photos, etc.)
  if (print.galleryImages) {
    try {
      const printGalleryArray = JSON.parse(print.galleryImages);
      if (printGalleryArray && printGalleryArray.length > 0) {
        if (allImages.length === 0) {
          // No artwork gallery — use main image as first, then print gallery
          allImages = [print.imageUrl, ...printGalleryArray];
        } else {
          // Append print gallery images after artwork gallery images
          allImages = [...allImages, ...printGalleryArray];
        }
      }
    } catch (e) {
      console.error('Failed to parse print gallery images:', e);
    }
  }
  
  // Fallback to main image if no gallery images at all
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
    canvas: {
      "80x60": "£125",
      "120x100": "£200",
      "custom": "Contact for pricing"
    },
    pvc: {
      "80x60": "£125",
      "120x100": "£200",
      "custom": "Contact for pricing"
    },
    giclee: {
      "80x60": "£150",
      "120x100": "£225",
      "custom": "Contact for pricing"
    }
  };

  // Calculate price based on panel selection for multi-panel works
  let currentPrice = priceMap[material]?.[size] || "Contact for pricing";
  if (isMultiPanel && panelSelection === "all" && currentPrice.startsWith("£")) {
    const singlePrice = parseInt(currentPrice.replace("£", ""));
    currentPrice = `£${singlePrice * panelCount}`;
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

  const panelLabels: Record<string, string> = {
    left: "Left panel",
    centre: "Centre panel",
    right: "Right panel",
    all: isDiptych ? "Both panels" : `All ${panelCount} panels`,
  };

  const handleOrder = () => {
    if (size === "custom") {
      // Route to contact page for custom sizes
      window.location.href = "/contact";
      return;
    }
    const detailParts = [
      materialLabels[material] || material,
      sizeLabels[size] || size,
    ];
    if (isMultiPanel) {
      detailParts.push(panelLabels[panelSelection] || panelSelection);
    }
    onOrder({
      title: print.title,
      price: currentPrice,
      details: detailParts.join(" \u00b7 "),
      section: "prints",
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
              <SelectItem value="canvas">Canvas Inkjet</SelectItem>
              <SelectItem value="pvc">PVC Board</SelectItem>
              <SelectItem value="giclee">Giclée</SelectItem>
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

        {/* Panel Selector - show for diptychs and triptychs */}
        {isMultiPanel && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Panels</label>
            <Select value={panelSelection} onValueChange={setPanelSelection}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select panels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left panel</SelectItem>
                {isTriptych && <SelectItem value="centre">Centre panel</SelectItem>}
                <SelectItem value="right">Right panel</SelectItem>
                <SelectItem value="all">{isDiptych ? 'Both panels' : `All ${panelCount} panels`}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price Display */}
        <div className="pt-2 pb-1 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {isMultiPanel && panelSelection === "all" ? "Total price:" : "Price:"}
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
