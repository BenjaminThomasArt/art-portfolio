import { useState } from "react";
import { ImageZoom } from "@/components/ImageZoom";
import { UpcycleCarousel } from "@/components/UpcycleCarousel";
import { OrderDialog } from "@/components/OrderDialog";
import { ShoppingBag } from "lucide-react";
import { trackInitiateCheckout } from "@/lib/metaPixel";

// ─── Types ───────────────────────────────────────────────────────────
interface SaleArtwork {
  id: number;
  title: string;
  medium: string;
  dimensions: string;
  year: number;
  images: string[]; // carousel images: diptych, left panel, right panel, detail
  panelCount: number; // 1 = single, 2 = diptych, 3 = triptych
  singlePrice: number;
  setPrice: number;
}

type PanelSelection = "left" | "right" | "both";

// ─── Sale Artworks ──────────────────────────────────────────────────
const saleArtworks: SaleArtwork[] = [
  {
    id: 1,
    title: "The Subject of Paint",
    medium: "Mixed media diptych on PVC board",
    dimensions: "120 × 80 cm (each panel)",
    year: 2024,
    images: [
      // Diptych (both panels together on gallery wall)
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/RcShSgUXwbChGdpY.jpeg",
      // Left panel
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/MWJVdOgEzUOCqJqg.jpeg",
      // Right panel
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/tScekjOtLlzvxkrS.jpeg",
      // Detail close-up
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/gDaTJysOZkIUEOEB.jpg",
    ],
    panelCount: 2,
    singlePrice: 150,
    setPrice: 250,
  },
];

// ─── Component ──────────────────────────────────────────────────────
export default function StudioSale() {
  const [zoomImage, setZoomImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [orderItem, setOrderItem] = useState<{
    title: string;
    price: string;
    details: string;
    section: "prints" | "upcycles";
    size?: string;
  } | null>(null);

  return (
    <div className="py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-[#D87093] mb-4">
            Studio sale
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            A small selection of original paintings available at reduced prices while I move studios. Once they're gone, they're gone.
          </p>
        </div>

        {/* Artworks grid */}
        <div className="max-w-4xl mx-auto space-y-16">
          {saleArtworks.map((artwork) => (
            <SaleCard
              key={artwork.id}
              artwork={artwork}
              onImageClick={(src, alt) => setZoomImage({ src, alt })}
              onOrder={(item) => setOrderItem(item)}
            />
          ))}
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

      <ImageZoom
        src={zoomImage?.src || ""}
        alt={zoomImage?.alt || ""}
        isOpen={!!zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}

// ─── Sale Card ──────────────────────────────────────────────────────
function SaleCard({
  artwork,
  onImageClick,
  onOrder,
}: {
  artwork: SaleArtwork;
  onImageClick: (src: string, alt: string) => void;
  onOrder: (item: {
    title: string;
    price: string;
    details: string;
    section: "prints" | "upcycles";
    size?: string;
  }) => void;
}) {
  const [panelSelection, setPanelSelection] = useState<PanelSelection>(
    artwork.panelCount > 1 ? "left" : "both"
  );

  const currentPrice =
    artwork.panelCount > 1 && panelSelection !== "both"
      ? artwork.singlePrice
      : artwork.setPrice;

  const priceLabel =
    artwork.panelCount > 1 && panelSelection !== "both"
      ? `£${artwork.singlePrice}`
      : `£${artwork.setPrice}`;

  const panelLabel =
    panelSelection === "left"
      ? "Left panel"
      : panelSelection === "right"
        ? "Right panel"
        : artwork.panelCount > 1
          ? "Both panels (diptych)"
          : "";

  const handleOrder = () => {
    trackInitiateCheckout({
      contentName: artwork.title,
      value: currentPrice,
    });
    onOrder({
      title: artwork.title,
      price: `£${currentPrice}`,
      details: [panelLabel, artwork.medium].filter(Boolean).join(" · "),
      section: "prints",
      size: "120x100", // use largest shipping bracket for originals
    });
  };

  return (
    <div className="group relative">
      {/* Image Carousel */}
      <UpcycleCarousel
        images={artwork.images}
        title={artwork.title}
        onImageClick={(src, alt) => onImageClick(src, alt)}
      />

      {/* Info */}
      <h3 className="text-xl md:text-2xl font-serif mb-1">'{artwork.title}'</h3>
      <p className="text-sm text-muted-foreground mb-1">{artwork.medium}</p>
      <p className="text-sm text-muted-foreground mb-1">{artwork.dimensions}</p>
      <p className="text-sm text-muted-foreground mb-4">{artwork.year}</p>

      {/* Panel selection for diptychs/triptychs */}
      {artwork.panelCount > 1 && (
        <div className="mb-4">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
            Panel selection
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPanelSelection("left")}
              className={`px-3 py-2.5 text-xs border transition-colors text-center ${
                panelSelection === "left"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground/50"
              }`}
            >
              Left panel
            </button>
            <button
              onClick={() => setPanelSelection("right")}
              className={`px-3 py-2.5 text-xs border transition-colors text-center ${
                panelSelection === "right"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground/50"
              }`}
            >
              Right panel
            </button>
            <button
              onClick={() => setPanelSelection("both")}
              className={`px-3 py-2.5 text-xs border transition-colors text-center ${
                panelSelection === "both"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground/50"
              }`}
            >
              Both panels
            </button>
          </div>
        </div>
      )}

      {/* Price */}
      <div className="border-t border-border pt-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {artwork.panelCount > 1 && panelSelection !== "both"
              ? "Price per panel"
              : "Price"}
          </span>
          <span className="text-2xl font-serif">{priceLabel}</span>
        </div>
        {artwork.panelCount > 1 && panelSelection !== "both" && (
          <p className="text-xs text-muted-foreground mt-1">
            Or £{artwork.setPrice} for both panels
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Delivery costs calculated at checkout based on your location.
        </p>
      </div>

      {/* Order button */}
      <button
        onClick={handleOrder}
        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs border border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background transition-colors"
      >
        <ShoppingBag size={13} />
        Order
      </button>
    </div>
  );
}
