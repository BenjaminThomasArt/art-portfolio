import { useState } from "react";
import { ImageZoom } from "@/components/ImageZoom";

const galleryImages = [
  // Original 20 images
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
  // 6 new images (indices 20-25)
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/XwmXodDiFZAUXvDM.jpeg", alt: "Artist with artwork" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/vrSnBTBjJXHieUhU.jpeg", alt: "Artist with artwork" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/aBbCVLqPDnLzOcMl.jpeg", alt: "Artist in studio" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/KJVTYMbUZmDXWCxu.jpeg", alt: "Artwork in situ" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/UaAYekILMuUTxyQA.jpeg", alt: "Cat with artwork" },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/miZYbLXUpCJCPvAd.jpeg", alt: "Artist in studio" },
];

// Layout rows with mixed in-situ + artist/studio shots
// Each row sums to ~98% to allow flex-grow to fill naturally
// Some images use object-cover for tighter cropping where it helps composition
const layoutRows: { idx: number; basis: number; aspectRatio?: string; cover?: boolean }[][] = [
  // Row 1: 2 images — large in-situ + artist reflection shot
  [{ idx: 0, basis: 55 }, { idx: 11, basis: 43 }],
  // Row 2: 3 images — framed art + diptych in-situ (new) + triptych room
  [{ idx: 2, basis: 26 }, { idx: 23, basis: 46 }, { idx: 1, basis: 26 }],
  // Row 3: 3 images — artist selfie pink + pink diptych + cat with artwork
  [{ idx: 21, basis: 28, aspectRatio: "4/3", cover: true }, { idx: 5, basis: 44 }, { idx: 24, basis: 26, aspectRatio: "4/3", cover: true }],
  // Row 4: 2 images — blue diptych living room + artist portrait close-up
  [{ idx: 6, basis: 56 }, { idx: 22, basis: 42, aspectRatio: "3/4", cover: true }],
  // Row 5: 3 images — small items + blue sofa + small items
  [{ idx: 7, basis: 24 }, { idx: 8, basis: 50 }, { idx: 9, basis: 24 }],
  // Row 6: 2 images — grey armchair + blue artwork bedroom
  [{ idx: 10, basis: 38 }, { idx: 3, basis: 60 }],
  // Row 7: 3 images — yellow flowers + diptych + artist reflection red painting
  [{ idx: 12, basis: 44 }, { idx: 13, basis: 28 }, { idx: 20, basis: 26, aspectRatio: "4/3", cover: true }],
  // Row 8: 2 images — green triptych + purple flower
  [{ idx: 15, basis: 44 }, { idx: 16, basis: 54 }],
  // Row 9: 3 images — kitchenware + artist painting through glass + dark kitchen
  [{ idx: 17, basis: 28 }, { idx: 25, basis: 36, aspectRatio: "3/4", cover: true }, { idx: 14, basis: 34 }],
  // Row 10: 3 images — living room + concrete wall + green artwork
  [{ idx: 18, basis: 30 }, { idx: 19, basis: 46 }, { idx: 4, basis: 22 }],
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
              className="flex items-stretch"
              style={{
                gap: "4px",
                marginBottom: "4px",
              }}
            >
              {row.map(({ idx, basis, aspectRatio, cover }) => {
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
                      ...(aspectRatio ? { aspectRatio } : {}),
                    }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`w-full block transition-all duration-700 group-hover:scale-[1.02] group-hover:brightness-105 ${
                        cover ? "h-full object-cover" : "h-auto"
                      }`}
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
          .flex.items-stretch {
            flex-direction: column !important;
            gap: 4px !important;
          }
          .flex.items-stretch > div {
            flex-basis: 100% !important;
            max-width: 100% !important;
            aspect-ratio: unset !important;
          }
          .flex.items-stretch > div:nth-child(odd) {
            width: 88% !important;
            margin-left: 0 !important;
          }
          .flex.items-stretch > div:nth-child(even) {
            width: 78% !important;
            margin-left: auto !important;
          }
          .flex.items-stretch > div img {
            height: auto !important;
            object-fit: contain !important;
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
