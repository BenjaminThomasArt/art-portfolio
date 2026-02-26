import { useState } from "react";
import { ImageZoom } from "@/components/ImageZoom";
import { UpcycleCarousel } from "@/components/UpcycleCarousel";
import { OrderDialog } from "@/components/OrderDialog";
import { ShoppingBag } from "lucide-react";
import { trackInitiateCheckout } from "@/lib/metaPixel";

const upcycleArtworks = [
  {
    id: 4,
    title: "Bo Carter",
    description: 'Upcycled vintage LP, 12"x12"',
    price: null,
    forSale: false,
    images: [
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/yyLwjcyVrZWmUvwE.jpeg",
    ],
  },
  {
    id: 1,
    title: "Pre & Post",
    description: 'Upcycled vintage vinyl artwork diptych; 2 x 12"x12"',
    price: 75,
    forSale: true,
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
    forSale: true,
    images: [
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/CuRLZscWwxTUWdoG.jpeg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/xLMzCLgwUiGZIvZV.jpeg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/jmzIfLdjoGYFyhxU.jpeg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/rHPDXGPIfKvuAQPR.jpg",
    ],
  },
  {
    id: 3,
    title: "Goodbye Horses",
    description: 'Upcycled vintage LP, 12"x12"',
    price: 50,
    forSale: true,
    images: [
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/jxQddmkdhYqUZLKK.PNG",
    ],
  },
];

export default function Upcycles() {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);
  const [orderItem, setOrderItem] = useState<{ title: string; price: string; details: string; section: "prints" | "upcycles" } | null>(null);

  return (
    <div className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-[#003153] mb-4">Upcycles</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">Salvaged vinyl 12" records given a new life; each reimagined as a new, original artwork, framed with the original vinyl record included. Perfect for walls & record players alike.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcycleArtworks.map((artwork) => (
            <div key={artwork.id} className="group relative">
              <UpcycleCarousel
                images={artwork.images}
                title={artwork.title}
                onImageClick={(src, alt) => setZoomImage({ src, alt })}
              />
              <h3 className="text-lg font-serif mb-1 flex items-center gap-2">
                '{artwork.title}'
                {!artwork.forSale && (
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 flex-shrink-0" title="Sold" />
                )}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{artwork.description}</p>
              {artwork.forSale && artwork.price != null && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <span className="text-xl font-serif">£{artwork.price}</span>
                  </div>
                  <button
                    onClick={() => {
                      trackInitiateCheckout({ contentName: artwork.title, value: artwork.price! });
                      setOrderItem({
                        title: artwork.title,
                        price: `£${artwork.price}`,
                        details: artwork.description,
                        section: "upcycles",
                      });
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs border border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background transition-colors"
                  >
                    <ShoppingBag size={13} />
                    Order
                  </button>
                </>
              )}
            </div>
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
