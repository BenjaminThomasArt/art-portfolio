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

// Organised into visual rows that sum to ~100% each
// Each row has 2-4 images with varied proportions
const layoutRows = [
  // Row 1: 2 images — one dominant, one smaller
  [{ idx: 0, basis: 58 }, { idx: 1, basis: 40 }],
  // Row 2: 3 images — uneven thirds
  [{ idx: 2, basis: 28 }, { idx: 3, basis: 44 }, { idx: 4, basis: 26 }],
  // Row 3: 2 images — roughly equal but not exact
  [{ idx: 5, basis: 53 }, { idx: 6, basis: 45 }],
  // Row 4: 3 images — wide centre
  [{ idx: 7, basis: 24 }, { idx: 8, basis: 50 }, { idx: 9, basis: 24 }],
  // Row 5: 2 images — reversed dominance
  [{ idx: 10, basis: 38 }, { idx: 11, basis: 60 }],
  // Row 6: 3 images — heavy left
  [{ idx: 12, basis: 48 }, { idx: 13, basis: 30 }, { idx: 14, basis: 20 }],
  // Row 7: 2 images — nearly equal
  [{ idx: 15, basis: 44 }, { idx: 16, basis: 54 }],
  // Row 8: 3 images — heavy right
  [{ idx: 17, basis: 22 }, { idx: 18, basis: 30 }, { idx: 19, basis: 46 }],
];

export default function InSituGallery() {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-16 pb-8">
        <div className="px-2 sm:px-3 lg:px-4 max-w-[1600px] mx-auto">
          {layoutRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-start"
              style={{
                gap: "4px",
                marginBottom: "4px",
              }}
            >
              {row.map(({ idx, basis }) => {
                const image = galleryImages[idx];
                return (
                  <div
                    key={idx}
                    className="group cursor-pointer overflow-hidden"
                    onClick={() => setZoomImage(image)}
                    style={{
                      flexBasis: `${basis}%`,
                      flexGrow: 1,
                      flexShrink: 1,
                    }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-auto block transition-all duration-700 group-hover:scale-[1.02] group-hover:brightness-105"
                      loading="lazy"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* Mobile override: stack with alternating widths */}
      <style>{`
        @media (max-width: 639px) {
          .flex.items-start {
            flex-direction: column !important;
            gap: 4px !important;
          }
          .flex.items-start > div {
            flex-basis: 100% !important;
            max-width: 100% !important;
          }
          .flex.items-start > div:nth-child(odd) {
            width: 88% !important;
            margin-left: 0 !important;
          }
          .flex.items-start > div:nth-child(even) {
            width: 78% !important;
            margin-left: auto !important;
          }
        }
      `}</style>

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
