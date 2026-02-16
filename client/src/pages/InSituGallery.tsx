import { useState } from "react";
import { ImageZoom } from "@/components/ImageZoom";

const galleryImages = [
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/JKwQAykUCThNKCxu.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/FHEwZWeRJRwGxGCK.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/mgttPgXnFISMOLjO.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/UUuEbRqwUpVdJEQQ.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/HleJjzwzYxurfbre.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/gucPaVCcWmrOOpUJ.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/LYurnpsgrfamnnoW.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/DnWizxZCjkShtGHo.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/stbPskkKpFBCvOfr.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/jgGssKdGyRgtxxHA.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/cwCyhzfCzuwxjprO.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/ltHBdAOAzKMbSdkk.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/aOqkPnbBeEbXMmLA.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/VQWZIPnRkKyYxgsb.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/RiHBCpnixkhIumTw.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/lzBGUnJoWdAYerAa.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/VdWXqEGWTNxMiUXF.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/sHeUJVSObcCQvZuq.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/wythBZmbxgvjNKVL.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/YnjfBZPLWPslwNZa.jpeg", alt: "Artwork in situ" },
];

// Define which images should be "featured" (larger) in the collage
// Indices: 0, 4, 9, 14 will span 2 columns for visual variety
const featuredIndices = new Set([0, 4, 9, 14]);

export default function InSituGallery() {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-serif text-[#003153] mb-4">
              Gallery
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Original works finding their place in homes, studios, and living spaces.
            </p>
          </div>
        </div>
      </section>

      {/* Masonry Collage */}
      <section className="pb-20 sm:pb-28">
        <div className="container">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
            {galleryImages.map((image, index) => {
              const isFeatured = featuredIndices.has(index);
              return (
                <div
                  key={index}
                  className={`mb-3 sm:mb-4 break-inside-avoid group cursor-pointer ${
                    isFeatured ? "lg:col-span-2" : ""
                  }`}
                  onClick={() => setZoomImage(image)}
                >
                  <div className="relative overflow-hidden rounded-sm">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    {/* Subtle hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image Zoom */}
      <ImageZoom
        src={zoomImage?.src || ""}
        alt={zoomImage?.alt || ""}
        isOpen={!!zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}
