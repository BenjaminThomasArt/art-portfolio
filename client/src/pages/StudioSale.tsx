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
  images: string[];
  panelCount: number; // 1 = single, 2 = diptych, 3 = triptych
  singlePrice: number;
  setPrice: number;
  hasFrameOption?: boolean;
  framedSinglePrice?: number;
  framedSetPrice?: number;
  setOnly?: boolean; // sold only as complete set, no per-panel option
}

type PanelSelection = "left" | "centre" | "right" | "both";
type FrameOption = "unframed" | "framed";

// ─── Sale Artworks ──────────────────────────────────────────────────
const saleArtworks: SaleArtwork[] = [
  {
    id: 1,
    title: "The Subject of Paint",
    medium: "Mixed media diptych on PVC board",
    dimensions: "80 × 60 cm (each panel)",
    year: 2024,
    images: [
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/MWJVdOgEzUOCqJqg.jpeg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/tScekjOtLlzvxkrS.jpeg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/gDaTJysOZkIUEOEB.jpg",
    ],
    panelCount: 2,
    singlePrice: 150,
    setPrice: 250,
  },
  {
    id: 4,
    title: "Tiefenschwarz",
    medium: "Mixed media diptych on canvas",
    dimensions: "80 × 60 cm (each panel)",
    year: 2025,
    images: [
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/FXJQbMhAtfjsTITp.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/ykMgjlFOTgWVvDvJ.jpeg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/iFwzTINRPHkqFBuZ.jpeg",
    ],
    panelCount: 2,
    singlePrice: 100,
    setPrice: 175,
  },
  {
    id: 5,
    title: "Beg, Steal and Borrow",
    medium: "Acrylic on canvas (triptych)",
    dimensions: "80 × 60 cm (each canvas)",
    year: 2025,
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/WhatsAppImage2026-04-21at18.14.22(1)_b77c9211.jpeg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/WhatsAppImage2026-04-21at18.14.21(3)_330de9fe.jpeg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/WhatsAppImage2026-04-21at18.14.22_7f9ff71f.jpeg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/WhatsAppImage2026-04-21at18.14.21(4)_7a0e64a7.jpeg",
    ],
    panelCount: 3,
    singlePrice: 200,
    setPrice: 200,
    hasFrameOption: true,
    framedSinglePrice: 350,
    framedSetPrice: 350,
    setOnly: true,
  },
  {
    id: 6,
    title: "Ashi",
    medium: "Acrylic on canvas (diptych)",
    dimensions: "80 × 60 cm (each canvas)",
    year: 2025,
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/WhatsAppImage2026-04-21at18.14.05_051f94d9.jpeg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/Unknown-2copy_238d28d7.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/Unknown-1copy_8e71d0dd.webp",
    ],
    panelCount: 2,
    singlePrice: 150,
    setPrice: 150,
    hasFrameOption: true,
    framedSinglePrice: 250,
    framedSetPrice: 250,
    setOnly: true,
  },
  {
    id: 7,
    title: "Lights Out",
    medium: "Acrylic on canvas (diptych)",
    dimensions: "70 × 50 cm (each canvas)",
    year: 2025,
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/WhatsAppImage2026-04-21at18.14.21(1)_1122908e.jpeg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/WhatsAppImage2026-04-21at18.14.21(2)_b553e896.jpeg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/WhatsAppImage2026-04-21at18.14.21_b84980cd.jpeg",
    ],
    panelCount: 2,
    singlePrice: 75,
    setPrice: 150,
    hasFrameOption: true,
    framedSinglePrice: 250,
    framedSetPrice: 250,
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
            A small selection of original paintings available at reduced prices
            while I move studios. Once they're gone, they're gone.
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
    artwork.setOnly || artwork.panelCount <= 1 ? "both" : "left"
  );
  const [frameOption, setFrameOption] = useState<FrameOption>("unframed");

  // ── Price calculation ──
  const isSingle = artwork.panelCount > 1 && panelSelection !== "both";
  const isFramed = artwork.hasFrameOption && frameOption === "framed";

  let currentPrice: number;
  if (isFramed) {
    // Framed pricing — for framed, "both" is the set price
    currentPrice = isSingle
      ? (artwork.framedSinglePrice ?? artwork.singlePrice)
      : (artwork.framedSetPrice ?? artwork.setPrice);
  } else {
    // Unframed pricing
    currentPrice = isSingle ? artwork.singlePrice : artwork.setPrice;
  }

  const priceLabel = `£${currentPrice}`;

  // ── Panel label ──
  const panelLabel =
    panelSelection === "left"
      ? "Left panel"
      : panelSelection === "centre"
        ? "Centre panel"
        : panelSelection === "right"
          ? "Right panel"
          : artwork.panelCount === 3
            ? "All three canvases (triptych)"
            : artwork.panelCount === 2
              ? "Both panels (diptych)"
              : "";

  // ── Set type label ──
  const setTypeLabel =
    artwork.panelCount === 3 ? "triptych" : "diptych";

  const handleOrder = () => {
    trackInitiateCheckout({
      contentName: artwork.title,
      value: currentPrice,
    });
    const frameLabel = artwork.hasFrameOption
      ? frameOption === "framed"
        ? "Framed"
        : "Unframed"
      : "";
    onOrder({
      title: artwork.title,
      price: `£${currentPrice}`,
      details: [panelLabel, frameLabel, artwork.medium]
        .filter(Boolean)
        .join(" · "),
      section: "prints",
      size: "120x100",
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
      <h3 className="text-xl md:text-2xl font-serif mb-1">
        '{artwork.title}'
      </h3>
      <p className="text-sm text-muted-foreground mb-1">{artwork.medium}</p>
      <p className="text-sm text-muted-foreground mb-1">
        {artwork.dimensions}
      </p>
      <p className="text-sm text-muted-foreground mb-4">{artwork.year}</p>

      {/* Panel selection for diptychs/triptychs (only if not set-only) */}
      {artwork.panelCount > 1 && !artwork.setOnly && (
        <div className="mb-4">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
            Panel selection
          </label>
          {artwork.panelCount === 3 ? (
            <div className="grid grid-cols-4 gap-2">
              {(["left", "centre", "right", "both"] as PanelSelection[]).map(
                (sel) => (
                  <button
                    key={sel}
                    onClick={() => setPanelSelection(sel)}
                    className={`px-3 py-2.5 text-xs border transition-colors text-center ${
                      panelSelection === sel
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:border-foreground/50"
                    }`}
                  >
                    {sel === "left"
                      ? "Left"
                      : sel === "centre"
                        ? "Centre"
                        : sel === "right"
                          ? "Right"
                          : "All three"}
                  </button>
                )
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {(["left", "right", "both"] as PanelSelection[]).map((sel) => (
                <button
                  key={sel}
                  onClick={() => setPanelSelection(sel)}
                  className={`px-3 py-2.5 text-xs border transition-colors text-center ${
                    panelSelection === sel
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground hover:border-foreground/50"
                  }`}
                >
                  {sel === "left"
                    ? "Left panel"
                    : sel === "right"
                      ? "Right panel"
                      : "Both panels"}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Framed / Unframed toggle */}
      {artwork.hasFrameOption && (
        <div className="mb-4">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
            Finish
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFrameOption("unframed")}
              className={`px-3 py-2.5 text-xs border transition-colors text-center ${
                frameOption === "unframed"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground/50"
              }`}
            >
              Unframed
            </button>
            <button
              onClick={() => setFrameOption("framed")}
              className={`px-3 py-2.5 text-xs border transition-colors text-center ${
                frameOption === "framed"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground/50"
              }`}
            >
              Framed
            </button>
          </div>
        </div>
      )}

      {/* Price */}
      <div className="border-t border-border pt-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {isSingle ? "Price per panel" : "Price"}
          </span>
          <span className="text-2xl font-serif">{priceLabel}</span>
        </div>
        {isSingle && !isFramed && (
          <p className="text-xs text-muted-foreground mt-1">
            Or £{artwork.setPrice} for the full {setTypeLabel}
          </p>
        )}
        {isSingle && isFramed && (
          <p className="text-xs text-muted-foreground mt-1">
            Or £{artwork.framedSetPrice} for the full {setTypeLabel} framed
          </p>
        )}
        {!isSingle && artwork.hasFrameOption && !isFramed && (
          <p className="text-xs text-muted-foreground mt-1">
            Or £{artwork.framedSetPrice} framed
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
