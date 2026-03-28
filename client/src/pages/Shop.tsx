import { trpc } from "@/lib/trpc";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { ImageZoom } from "@/components/ImageZoom";
import { OrderDialog } from "@/components/OrderDialog";
import { trackInitiateCheckout } from "@/lib/metaPixel";
import { ChevronLeft, ChevronRight, ArrowLeft, ShoppingBag, ZoomIn } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ───────────────────────────────────────────────────────────
interface PrintableArtwork {
  id: number;
  title: string;
  imageUrl: string;
  galleryImages?: string | null;
  medium?: string | null;
  dimensions?: string | null;
  year?: number | null;
}

type ViewMode = "browse" | "configure";

// ─── Pricing ─────────────────────────────────────────────────────────
const MATERIALS = [
  { value: "canvas", label: "Canvas Inkjet" },
  { value: "pvc", label: "PVC Board" },
  { value: "giclee", label: "Giclée Fine Art" },
] as const;

const SIZES = [
  { value: "30x40", label: "30 × 40 cm", shortLabel: "30×40cm" },
  { value: "80x60", label: "60 × 80 cm", shortLabel: "60×80cm" },
  { value: "120x100", label: "100 × 120 cm", shortLabel: "100×120cm" },
  { value: "custom", label: "Custom size — contact for details", shortLabel: "Custom" },
] as const;

const PRICE_MAP: Record<string, Record<string, number>> = {
  canvas:  { "30x40": 75, "80x60": 125, "120x100": 200 },
  pvc:     { "30x40": 75, "80x60": 125, "120x100": 200 },
  giclee:  { "30x40": 90, "80x60": 150, "120x100": 225 },
};

function getPrice(material: string, size: string): string {
  if (size === "custom") return "Contact for pricing";
  const price = PRICE_MAP[material]?.[size];
  return price ? `£${price}` : "Contact for pricing";
}

// ─── Main Component ──────────────────────────────────────────────────
export default function Shop() {
  const { data: artworks, isLoading } = trpc.artworks.getAll.useQuery();

  const [viewMode, setViewMode] = useState<ViewMode>("browse");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);
  const [orderItem, setOrderItem] = useState<{
    title: string;
    price: string;
    details: string;
    section: "prints" | "upcycles";
    size?: string;
  } | null>(null);

  // Configuration state
  const [material, setMaterial] = useState("canvas");
  const [size, setSize] = useState("30x40");

  // Carousel ref for scrolling
  const carouselRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const printableArtworks: PrintableArtwork[] = useMemo(() => {
    if (!artworks) return [];
    return artworks.map((a) => ({
      id: a.id,
      title: a.title,
      imageUrl: a.imageUrl,
      galleryImages: a.galleryImages,
      medium: a.medium,
      dimensions: a.dimensions,
      year: a.year,
    }));
  }, [artworks]);

  const selectedArtwork = printableArtworks[selectedIndex] || null;

  const currentPrice = useMemo(() => getPrice(material, size), [material, size]);
  const currentPriceNum = useMemo(() => {
    const match = currentPrice.match(/£(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }, [currentPrice]);

  // Scroll selected thumbnail into view
  useEffect(() => {
    const thumb = thumbnailRefs.current[selectedIndex];
    if (thumb) {
      thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedIndex]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < printableArtworks.length) {
        setSelectedIndex(index);
      }
    },
    [printableArtworks.length]
  );

  const prevSlide = useCallback(() => {
    setSelectedIndex((i) => (i > 0 ? i - 1 : printableArtworks.length - 1));
  }, [printableArtworks.length]);

  const nextSlide = useCallback(() => {
    setSelectedIndex((i) => (i < printableArtworks.length - 1 ? i + 1 : 0));
  }, [printableArtworks.length]);

  const handleSelectPrint = useCallback(() => {
    setMaterial("canvas");
    setSize("30x40");
    setViewMode("configure");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBackToBrowse = useCallback(() => {
    setViewMode("browse");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleOrder = useCallback(() => {
    if (!selectedArtwork) return;
    if (size === "custom") {
      window.location.href = `/contact?subject=${encodeURIComponent(
        `Custom size enquiry: '${selectedArtwork.title}'`
      )}&message=${encodeURIComponent(
        `Hi, I'm interested in a custom size print of '${selectedArtwork.title}' in ${
          MATERIALS.find((m) => m.value === material)?.label || material
        }. Could you provide pricing and availability?`
      )}`;
      return;
    }
    const materialLabel = MATERIALS.find((m) => m.value === material)?.label || material;
    const sizeLabel = SIZES.find((s) => s.value === size)?.shortLabel || size;

    if (currentPriceNum > 0) {
      trackInitiateCheckout({ contentName: selectedArtwork.title, value: currentPriceNum });
    }

    setOrderItem({
      title: selectedArtwork.title,
      price: currentPrice,
      details: `${materialLabel} · ${sizeLabel}`,
      section: "prints",
      size,
    });
  }, [selectedArtwork, material, size, currentPrice, currentPriceNum]);

  // ─── Loading ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <div className="aspect-[16/9] md:aspect-[21/9] bg-muted animate-pulse" />
          <div className="container py-8">
            <div className="h-8 bg-muted animate-pulse w-48 mx-auto mb-4" />
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-16 h-16 bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!printableArtworks.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">No prints available at the moment</p>
        </div>
      </div>
    );
  }

  // ─── Browse Mode ─────────────────────────────────────────────────
  if (viewMode === "browse") {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero carousel */}
        <section className="relative bg-[#f5f3f0]">
          {/* Main image */}
          <div className="relative aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10 md:p-16">
              <img
                src={selectedArtwork?.imageUrl}
                alt={selectedArtwork?.title || ""}
                className="max-w-full max-h-full object-contain drop-shadow-lg transition-opacity duration-500"
                key={selectedIndex}
              />
            </div>

            {/* Nav arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white text-foreground rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105"
              aria-label="Previous artwork"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white text-foreground rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105"
              aria-label="Next artwork"
            >
              <ChevronRight size={20} />
            </button>

            {/* Zoom button */}
            <button
              onClick={() =>
                selectedArtwork && setZoomImage({ src: selectedArtwork.imageUrl, alt: selectedArtwork.title })
              }
              className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-9 h-9 bg-white/80 hover:bg-white text-foreground rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105"
              aria-label="Zoom image"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </section>

        {/* Artwork info + select button */}
        <section className="py-6 md:py-8 border-b border-border">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-serif mb-1">'{selectedArtwork?.title}'</h2>
            {selectedArtwork?.medium && (
              <p className="text-sm text-muted-foreground mb-4">{selectedArtwork.medium}</p>
            )}
            <button
              onClick={handleSelectPrint}
              className="inline-flex items-center gap-2 px-8 py-3 text-sm border border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background transition-colors"
            >
              <ShoppingBag size={16} />
              Order as print
            </button>
          </div>
        </section>

        {/* Thumbnail strip */}
        <section className="py-6 md:py-8">
          <div className="container">
            <p className="text-xs text-muted-foreground uppercase tracking-widest text-center mb-4">
              {printableArtworks.length} artworks available as prints
            </p>
            <div
              ref={carouselRef}
              className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {printableArtworks.map((artwork, index) => (
                <button
                  key={artwork.id}
                  ref={(el) => { thumbnailRefs.current[index] = el; }}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden transition-all duration-200 ${
                    index === selectedIndex
                      ? "ring-2 ring-foreground ring-offset-2 opacity-100"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 md:py-16 bg-[#f5f3f0]">
          <div className="container max-w-3xl">
            <h3 className="text-lg font-serif text-center mb-8">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-3 text-sm font-medium">
                  1
                </div>
                <p className="text-sm font-medium mb-1">Browse</p>
                <p className="text-xs text-muted-foreground">
                  Swipe through the collection and find a piece you love.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-3 text-sm font-medium">
                  2
                </div>
                <p className="text-sm font-medium mb-1">Configure</p>
                <p className="text-xs text-muted-foreground">
                  Choose your size and finish — canvas, PVC board, or giclée.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-3 text-sm font-medium">
                  3
                </div>
                <p className="text-sm font-medium mb-1">Checkout</p>
                <p className="text-xs text-muted-foreground">
                  Enter your delivery details and pay securely via PayPal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Zoom modal */}
        <ImageZoom
          src={zoomImage?.src || ""}
          alt={zoomImage?.alt || ""}
          isOpen={!!zoomImage}
          onClose={() => setZoomImage(null)}
        />
      </div>
    );
  }

  // ─── Configure Mode ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        {/* Back button */}
        <button
          onClick={handleBackToBrowse}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to gallery
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: artwork image */}
          <div>
            <div className="bg-[#f5f3f0] aspect-[3/4] flex items-center justify-center p-8 md:p-12 sticky top-24">
              <img
                src={selectedArtwork?.imageUrl}
                alt={selectedArtwork?.title || ""}
                className="max-w-full max-h-full object-contain drop-shadow-lg cursor-zoom-in"
                onClick={() =>
                  selectedArtwork && setZoomImage({ src: selectedArtwork.imageUrl, alt: selectedArtwork.title })
                }
              />
            </div>
          </div>

          {/* Right: configuration */}
          <div className="py-2 lg:py-8">
            <h1 className="text-2xl md:text-3xl font-serif mb-1">'{selectedArtwork?.title}'</h1>
            {selectedArtwork?.medium && (
              <p className="text-sm text-muted-foreground mb-1">{selectedArtwork.medium}</p>
            )}
            <p className="text-sm text-muted-foreground mb-6">Print reproduction</p>

            {/* Material */}
            <div className="mb-5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                Finish
              </label>
              <div className="grid grid-cols-3 gap-2">
                {MATERIALS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMaterial(m.value)}
                    className={`px-3 py-2.5 text-xs border transition-colors text-center ${
                      material === m.value
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:border-foreground/50"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                Size
              </label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-2xl font-serif">{currentPrice}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Delivery costs calculated at checkout based on your location.
              </p>
            </div>

            {/* Order button */}
            <button
              onClick={handleOrder}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              <ShoppingBag size={16} />
              {size === "custom" ? "Enquire about custom size" : "Proceed to checkout"}
            </button>

            {/* Info notes */}
            <div className="mt-8 space-y-4 text-xs text-muted-foreground">
              <div className="border-t border-border pt-4">
                <p className="font-medium text-foreground mb-1">About our prints</p>
                <p>
                  Each print is a faithful reproduction of the original work, produced using
                  professional-grade printing on your choice of material. All prints are made to
                  order and shipped flat or rolled depending on size.
                </p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="font-medium text-foreground mb-1">Materials</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Canvas Inkjet</strong> — Museum-quality inkjet on stretched canvas</li>
                  <li><strong>PVC Board</strong> — Rigid, lightweight board with a smooth finish</li>
                  <li><strong>Giclée Fine Art</strong> — Archival giclée on heavyweight fine art paper</li>
                </ul>
              </div>
              <div className="border-t border-border pt-4">
                <p className="font-medium text-foreground mb-1">Delivery</p>
                <p>
                  UK delivery typically 5–7 working days. European and international shipping
                  available — costs calculated at checkout.
                </p>
              </div>
            </div>
          </div>
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

      {/* Zoom modal */}
      <ImageZoom
        src={zoomImage?.src || ""}
        alt={zoomImage?.alt || ""}
        isOpen={!!zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}
