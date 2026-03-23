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
  // Bo Carter upcycled LP images (indices 26-27)
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/bo-carter-detail_70d6a08b.jpeg", alt: "Bo Carter - detail" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/bo-carter-full_8d971c69.jpeg", alt: "Bo Carter - full view" },
  // Madame Butterfly (index 28)
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/madame-butterfly-new_9f43d1ce.png", alt: "Madame Butterfly" },
  // The Lonely Heart (indices 29-30)
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/lonely-heart-studio_0dd847f3.jpeg", alt: "The Lonely Heart - studio" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/lonely-heart-framed_3d36675b.jpeg", alt: "The Lonely Heart - framed" },
  // Something Good (indices 31-32)
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/IMG_8767alt2copy_bad8efc7.jpg", alt: "Something Good - gallery wall" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/IMG_8598copy_d77c623d.webp", alt: "Something Good - artist in studio" },
];

// Desktop layout: rows use aspect ratios tuned to avoid cropping artworks in photos.
interface RowConfig {
  images: { idx: number; basis: number; objectPosition?: string }[];
  rowAspect: string;
}

const desktopRows: RowConfig[] = [
  {
    // Something Good gallery wall + green sofa
    rowAspect: "1.6/1",
    images: [
      { idx: 31, basis: 50, objectPosition: "center center" },
      { idx: 0, basis: 50, objectPosition: "center 30%" },
    ],
  },
  {
    rowAspect: "2.6/1",
    images: [
      { idx: 2, basis: 30, objectPosition: "center 40%" },
      { idx: 23, basis: 40 },
      { idx: 1, basis: 30, objectPosition: "center 35%" },
    ],
  },
  {
    // Lonely Heart framed + artist selfie + cat with artwork
    rowAspect: "2.4/1",
    images: [
      { idx: 30, basis: 34, objectPosition: "center center" },
      { idx: 21, basis: 32, objectPosition: "center 20%" },
      { idx: 24, basis: 34, objectPosition: "center 30%" },
    ],
  },
  {
    rowAspect: "2.2/1",
    images: [
      { idx: 6, basis: 55, objectPosition: "center 35%" },
      { idx: 22, basis: 45, objectPosition: "center 15%" },
    ],
  },
  {
    // Madame Butterfly mixed in with existing images
    rowAspect: "2.4/1",
    images: [
      { idx: 7, basis: 30, objectPosition: "center 30%" },
      { idx: 28, basis: 40, objectPosition: "center center" },
      { idx: 9, basis: 30, objectPosition: "center 40%" },
    ],
  },
  {
    rowAspect: "2/1",
    images: [
      { idx: 10, basis: 42, objectPosition: "center 30%" },
      { idx: 3, basis: 58, objectPosition: "center 40%" },
    ],
  },
  {
    // Bo Carter detail + pink diptych + artist reflection
    rowAspect: "2.4/1",
    images: [
      { idx: 26, basis: 34, objectPosition: "center center" },
      { idx: 5, basis: 38, objectPosition: "center 45%" },
      { idx: 20, basis: 28, objectPosition: "center 25%" },
    ],
  },
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 12, basis: 38, objectPosition: "center 40%" },
      { idx: 13, basis: 34, objectPosition: "center 45%" },
      { idx: 8, basis: 28, objectPosition: "center 35%" },
    ],
  },
  {
    // Something Good artist in studio + Lonely Heart studio
    rowAspect: "2.4/1",
    images: [
      { idx: 32, basis: 45, objectPosition: "center 30%" },
      { idx: 29, basis: 55, objectPosition: "center 30%" },
    ],
  },
  {
    // green botanical pair + blue sofa
    rowAspect: "2.4/1",
    images: [
      { idx: 15, basis: 60, objectPosition: "center 40%" },
      { idx: 11, basis: 40, objectPosition: "center 40%" },
    ],
  },
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 16, basis: 40, objectPosition: "center 45%" },
      { idx: 17, basis: 30, objectPosition: "center 40%" },
      { idx: 27, basis: 30, objectPosition: "center center" },
    ],
  },
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 25, basis: 30, objectPosition: "center 20%" },
      { idx: 14, basis: 36, objectPosition: "center 35%" },
      { idx: 18, basis: 34, objectPosition: "center 35%" },
    ],
  },
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 19, basis: 36, objectPosition: "center 45%" },
      { idx: 4, basis: 30, objectPosition: "center 40%" },
      { idx: 9, basis: 34, objectPosition: "center 40%" },
    ],
  },
];

// ─── Mobile layout ───────────────────────────────────────────────────
// Nearly all source images are 1:1 (square). The previous layout forced
// them into wide containers (16/9, 3/2) which cropped artworks heavily.
//
// New approach: each image gets a container matching its NATURAL aspect
// ratio. Square images → 1/1. The one landscape (idx18) → 3/2.
// Portrait images (idx19, idx22, idx25) → 4/5 or 3/4.
//
// Layout rhythm varies: full-width heroes, asymmetric pairs (60/40,
// 65/35), and occasional tight pairs — never a uniform grid.
//
// For pairs of square images side by side, the ROW aspect is 2/1
// (two squares next to each other). For a square + portrait pair,
// we let each image keep its own aspect ratio via the flex approach.

// Mobile uses a different rendering approach: instead of a fixed row
// aspect ratio that forces all images to the same height (causing crop),
// each image declares its own aspect ratio and the row flexes to fit.
interface MobileItem {
  idx: number;
  aspect: string;    // natural aspect ratio of this image
  basis: number;     // flex-basis percentage within the row
  objectPosition?: string;
}

interface MobileRowConfig {
  items: MobileItem[];
  gap?: string;
}

const mobileLayout: MobileRowConfig[] = [
  // 1. Hero: Something Good gallery wall — full width
  { items: [{ idx: 31, aspect: "4/5", basis: 100 }] },

  // 2. Pair: green sofa + framed art (sq) — asymmetric
  { items: [
    { idx: 0, aspect: "1/1", basis: 58 },
    { idx: 2, aspect: "1/1", basis: 42 },
  ]},

  // 3. Full width: The Lonely Heart framed on wall
  { items: [{ idx: 30, aspect: "1/1", basis: 100 }] },

  // 4. Pair: diptych in-situ + artist selfie
  { items: [
    { idx: 23, aspect: "1/1", basis: 62 },
    { idx: 21, aspect: "1/1", basis: 38, objectPosition: "center 20%" },
  ]},

  // 5. Full width: pink diptych (sq)
  { items: [{ idx: 5, aspect: "1/1", basis: 100 }] },

  // 6. Pair: cat with artwork (sq) + Madame Butterfly
  { items: [
    { idx: 24, aspect: "1/1", basis: 45 },
    { idx: 28, aspect: "1/1", basis: 55 },
  ]},

  // 7. Full width: artist portrait (portrait 0.77:1)
  { items: [{ idx: 22, aspect: "3/4", basis: 100, objectPosition: "center 15%" }] },

  // 8. Pair: blue sofa (sq) + small framed artwork (sq)
  { items: [
    { idx: 8, aspect: "1/1", basis: 60 },
    { idx: 7, aspect: "1/1", basis: 40 },
  ]},

  // 9. Full width: Bo Carter detail
  { items: [{ idx: 26, aspect: "1/1", basis: 100 }] },

  // 10. Pair: triptych room + blue diptych living room
  { items: [
    { idx: 1, aspect: "1/1", basis: 45 },
    { idx: 6, aspect: "1/1", basis: 55 },
  ]},

  // 11. Full width: sideboard with artworks (sq)
  { items: [{ idx: 9, aspect: "1/1", basis: 100 }] },

  // 12. Pair: grey armchair clouds + blue artwork bedroom
  { items: [
    { idx: 10, aspect: "1/1", basis: 45 },
    { idx: 3, aspect: "1/1", basis: 55 },
  ]},

  // 13. Something Good artist in studio + Lonely Heart studio
  { items: [
    { idx: 32, aspect: "1/1", basis: 50, objectPosition: "center 30%" },
    { idx: 29, aspect: "1/1", basis: 50 },
  ]},

  // 14. Pair: yellow flowers + dark diptych
  { items: [
    { idx: 12, aspect: "1/1", basis: 50 },
    { idx: 13, aspect: "1/1", basis: 50 },
  ]},

  // 15. Full width: green botanical pair (sq)
  { items: [{ idx: 15, aspect: "1/1", basis: 100 }] },

  // 16. Pair: purple flower + Bo Carter full view
  { items: [
    { idx: 16, aspect: "1/1", basis: 55 },
    { idx: 27, aspect: "1/1", basis: 45 },
  ]},

  // 17. Full width: artist painting through glass (portrait)
  { items: [{ idx: 25, aspect: "2/3", basis: 100, objectPosition: "center 20%" }] },

  // 18. Pair: artist reflection + green artwork bench
  { items: [
    { idx: 20, aspect: "1/1", basis: 45, objectPosition: "center 25%" },
    { idx: 17, aspect: "1/1", basis: 55 },
  ]},

  // 19. Pair: kitchen with art + living room two artworks
  { items: [
    { idx: 14, aspect: "1/1", basis: 48 },
    { idx: 18, aspect: "3/2", basis: 52 },
  ]},

  // 20. Full width: concrete wall artwork (portrait)
  { items: [{ idx: 19, aspect: "4/5", basis: 100 }] },

  // 21. Final: two framed dark artworks (sq)
  { items: [{ idx: 4, aspect: "1/1", basis: 100 }] },
];

export default function InSituGallery() {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  // Desktop renderer: fixed row aspect ratio, all images same height
  const renderDesktopRow = (row: RowConfig, rowIndex: number) => (
    <div
      key={rowIndex}
      className="flex"
      style={{
        gap: "3px",
        marginBottom: "3px",
        aspectRatio: row.rowAspect,
      }}
    >
      {row.images.map(({ idx, basis, objectPosition }) => {
        const image = galleryImages[idx];
        return (
          <div
            key={idx}
            className="group cursor-pointer overflow-hidden h-full"
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
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02] group-hover:brightness-105"
              style={{ objectPosition: objectPosition || "center center" }}
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );

  // Mobile renderer: each image has its OWN aspect ratio so nothing gets cropped
  const renderMobileRow = (row: MobileRowConfig, rowIndex: number) => (
    <div
      key={rowIndex}
      className="flex items-start"
      style={{
        gap: "2px",
        marginBottom: "2px",
      }}
    >
      {row.items.map(({ idx, aspect, basis, objectPosition }) => {
        const image = galleryImages[idx];
        return (
          <div
            key={idx}
            className="group cursor-pointer overflow-hidden"
            onClick={() => setZoomImage(image)}
            style={{
              flexBasis: `${basis}%`,
              flexGrow: 0,
              flexShrink: 0,
              aspectRatio: aspect,
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02] group-hover:brightness-105"
              style={{ objectPosition: objectPosition || "center center" }}
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-16 pb-8">
        {/* Desktop layout */}
        <div className="hidden sm:block px-1 lg:px-2 max-w-[1600px] mx-auto">
          {desktopRows.map((row, i) => renderDesktopRow(row, i))}
        </div>

        {/* Mobile layout: each image keeps its natural aspect ratio */}
        <div className="sm:hidden px-[2px]">
          {mobileLayout.map((row, i) => renderMobileRow(row, i))}
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
