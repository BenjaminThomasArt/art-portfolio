import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ImageZoom } from "@/components/ImageZoom";
import { UpcycleCarousel } from "@/components/UpcycleCarousel";
import { ShoppingBag, X } from "lucide-react";

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
  const [confirmArtwork, setConfirmArtwork] = useState<typeof upcycleArtworks[0] | null>(null);
  const notifyMutation = trpc.orders.notifyPayPalClick.useMutation();

  const handleConfirmPurchase = () => {
    if (confirmArtwork) {
      notifyMutation.mutate({
        title: confirmArtwork.title,
        price: `£${confirmArtwork.price}`,
        section: "upcycles",
      });
      window.open(`https://paypal.me/benjaminthomasg/${confirmArtwork.price}GBP`, '_blank');
      setConfirmArtwork(null);
    }
  };

  return (
    <div className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-[#003153] mb-4">Upcycles</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">Salvaged vinyl 12" records given new life; each reimagined as an original artwork, framed with the original vinyl record included.<br />A treat for walls & record players alike.</p>
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
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Price:</span>
                <span className="text-xl font-serif">£{artwork.price}</span>
              </div>
              <button
                onClick={() => setConfirmArtwork(artwork)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs border border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background transition-colors"
              >
                <ShoppingBag size={13} />
                Order
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmArtwork(null)} />
          <div className="relative bg-background border border-border rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
            <button
              onClick={() => setConfirmArtwork(null)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-serif mb-1">Confirm Order</h3>
            <p className="text-sm text-muted-foreground mb-4">You'll be redirected to PayPal to complete payment.</p>
            <div className="border border-border rounded-md p-4 mb-5">
              <p className="font-medium">'{confirmArtwork.title}'</p>
              <p className="text-sm text-muted-foreground">{confirmArtwork.description}</p>
              <p className="text-lg font-medium mt-2">£{confirmArtwork.price}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmArtwork(null)}
                className="flex-1 px-4 py-2 text-sm border border-border text-foreground bg-transparent hover:bg-muted transition-colors rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md"
              >
                Pay with PayPal
              </button>
            </div>
          </div>
        </div>
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
