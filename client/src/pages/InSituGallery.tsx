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

// Deliberately irregular width percentages for desktop (basis %)
// Mix of small (~22%), medium (~30%), large (~42%), and extra-large (~55%)
// These don't add up to 100% per row on purpose — flex-wrap handles the flow
const desktopWidths = [
  42,  // 0 - large hero
  28,  // 1 - small
  26,  // 2 - small
  55,  // 3 - extra large
  40,  // 4 - large
  24,  // 5 - small
  32,  // 6 - medium
  38,  // 7 - medium-large
  26,  // 8 - small
  48,  // 9 - large
  22,  // 10 - small
  26,  // 11 - small
  35,  // 12 - medium
  58,  // 13 - extra large
  30,  // 14 - medium
  22,  // 15 - small
  44,  // 16 - large
  30,  // 17 - medium
  38,  // 18 - medium-large
  28,  // 19 - small
];

// Tablet widths (fewer columns, wider images)
const tabletWidths = [
  55,  // 0
  42,  // 1
  52,  // 2
  45,  // 3
  50,  // 4
  46,  // 5
  48,  // 6
  55,  // 7
  42,  // 8
  52,  // 9
  45,  // 10
  50,  // 11
  55,  // 12
  42,  // 13
  52,  // 14
  45,  // 15
  55,  // 16
  42,  // 17
  52,  // 18
  45,  // 19
];

// Small random vertical offsets to break alignment (px)
const verticalOffsets = [
  0, 12, -8, 4, -14, 8, -4, 16, -10, 6,
  -12, 10, -6, 14, -8, 4, -16, 8, -4, 12,
];

export default function InSituGallery() {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-20 pb-8 sm:pb-12">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex flex-wrap items-start" style={{ gap: "8px", margin: "0 -4px" }}>
            {galleryImages.map((image, index) => {
              const dw = desktopWidths[index];
              const tw = tabletWidths[index];
              const vOffset = verticalOffsets[index];

              return (
                <div
                  key={index}
                  className="group cursor-pointer overflow-hidden transition-all duration-500"
                  onClick={() => setZoomImage(image)}
                  style={{
                    flexBasis: `${dw}%`,
                    flexGrow: 0,
                    flexShrink: 0,
                    maxWidth: `${dw}%`,
                    marginTop: `${vOffset}px`,
                    padding: "4px",
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto rounded-sm transition-all duration-700 group-hover:scale-[1.02] group-hover:brightness-105"
                    loading="lazy"
                    style={{ display: "block" }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Responsive overrides for tablet and mobile */}
        <style>{`
          @media (max-width: 1023px) and (min-width: 640px) {
            ${galleryImages.map((_, i) => {
              const tw = tabletWidths[i];
              return `.gallery-item-${i} { flex-basis: ${tw}% !important; max-width: ${tw}% !important; }`;
            }).join("\n")}
          }
          @media (max-width: 639px) {
            .flex-wrap > div {
              flex-basis: 90% !important;
              max-width: 90% !important;
              margin-top: 0 !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }
            .flex-wrap > div:nth-child(odd) {
              flex-basis: 75% !important;
              max-width: 75% !important;
              margin-left: 4% !important;
              margin-right: auto !important;
            }
            .flex-wrap > div:nth-child(even) {
              flex-basis: 85% !important;
              max-width: 85% !important;
              margin-left: auto !important;
              margin-right: 2% !important;
            }
            .flex-wrap > div:nth-child(3n) {
              flex-basis: 65% !important;
              max-width: 65% !important;
              margin-left: 15% !important;
            }
          }
        `}</style>
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
