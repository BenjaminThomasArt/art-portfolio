import { useState } from "react";
import { ImageZoom } from "@/components/ImageZoom";
import { UpcycleCarousel } from "@/components/UpcycleCarousel";
import { ShoppingBag } from "lucide-react";

const upcycleArtworks = [
  {
    id: 1,
    title: "Pre & Post",
    description: 'Upcycled vintage vinyl artwork diptych; 2 x 12"x12"',
    price: 75,
    images: [
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/BuDNLXqkpRNyTRgX.jpeg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/kozKpAhIvAcgYroL.jpeg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/daBEyMRlzltbtKQt.jpg",
    ],
  },
  {
    id: 2,
    title: "Do You Wanna Dance",
    description: 'Upcycled vintage LP triptych, 3 x 12"x12"',
    price: 100,
    images: [
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/CuRLZscWwxTUWdoG.jpeg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/xLMzCLgwUiGZIvZV.jpeg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/jmzIfLdjoGYFyhxU.jpeg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/rHPDXGPIfKvuAQPR.jpg",
    ],
  },
];

export default function Upcycles() {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  const handlePurchase = (artwork: typeof upcycleArtworks[0]) => {
    window.open(`https://paypal.me/benjaminthomasg/${artwork.price}GBP`, '_blank');
  };

  return (
    <div className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-[#003153] mb-4">Upcycles</h1>
          <p className="text-[0.7rem] text-muted-foreground max-w-xl mx-auto">Salvaged vinyl records given new life.<br />Each cover is reimagined as an original artwork, framed and available with the original vinyl record included.<br />A treat for walls and record players alike.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcycleArtworks.map((artwork) => (
            <div key={artwork.id} className="group relative">
              <UpcycleCarousel
                images={artwork.images}
                title={artwork.title}
                onImageClick={(src, alt) => setZoomImage({ src, alt })}
              />
              <h3 className="text-lg font-serif mb-1">'{artwork.title}'</h3>
              <p className="text-sm text-muted-foreground mb-3">{artwork.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">£{artwork.price}</span>
                <button
                  onClick={() => handlePurchase(artwork)}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs border border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background transition-colors"
                >
                  <ShoppingBag size={13} />
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImageZoom
        src={zoomImage?.src || ""}
        alt={zoomImage?.alt || ""}
        isOpen={!!zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}
