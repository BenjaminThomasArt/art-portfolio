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

// Each image gets a size class for the organic collage feel
// "lg" = spans 2 cols + 2 rows, "md" = spans 2 cols or 2 rows, "sm" = 1x1
type ImageSize = "lg" | "wide" | "tall" | "sm";

const sizeMap: ImageSize[] = [
  "lg",    // 0 - hero, large
  "sm",    // 1
  "tall",  // 2
  "sm",    // 3
  "wide",  // 4
  "sm",    // 5
  "sm",    // 6
  "tall",  // 7
  "wide",  // 8
  "sm",    // 9
  "lg",    // 10 - second hero
  "sm",    // 11
  "sm",    // 12
  "wide",  // 13
  "tall",  // 14
  "sm",    // 15
  "sm",    // 16
  "wide",  // 17
  "sm",    // 18
  "tall",  // 19
];

function getSizeClasses(size: ImageSize): string {
  switch (size) {
    case "lg":
      return "col-span-2 row-span-2";
    case "wide":
      return "col-span-2 row-span-1";
    case "tall":
      return "col-span-1 row-span-2";
    case "sm":
    default:
      return "col-span-1 row-span-1";
  }
}

export default function InSituGallery() {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Organic collage - no text, images only */}
      <section className="pt-20 pb-8 sm:pb-12">
        <div className="px-2 sm:px-4 lg:px-6">
          <div
            className="grid gap-1.5 sm:gap-2"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gridAutoRows: "200px",
              gridAutoFlow: "dense",
            }}
          >
            {galleryImages.map((image, index) => {
              const size = sizeMap[index] || "sm";
              return (
                <div
                  key={index}
                  className={`${getSizeClasses(size)} group cursor-pointer overflow-hidden`}
                  onClick={() => setZoomImage(image)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05] group-hover:brightness-110"
                    loading="lazy"
                  />
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
