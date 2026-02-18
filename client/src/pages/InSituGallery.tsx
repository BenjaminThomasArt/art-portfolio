import { useState } from "react";
import { ImageZoom } from "@/components/ImageZoom";

const galleryImages = [
  // Original 20 images
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/JKwQAykUCThNKCxu.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/FHEwZWeRJRwGxGCK.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/mgttPgXnFISMOLjO.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/UUuEbRqwUpVdJEQQ.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/HleJjzwzYxurfbre.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/gucPaVCcWmrOOpUJ.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/LYurnpsgrfamnnoW.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/DnWizxZCjkShtGHo.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/stbPskkKpFBCvOfr.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/jgGssKdGyRgtxxHA.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/cwCyhzfCzuwxjprO.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/ltHBdAOAzKMbSdkk.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/aOqkPnbBeEbXMmLA.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/VQWZIPnRkKyYxgsb.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/RiHBCpnixkhIumTw.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/lzBGUnJoWdAYerAa.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/VdWXqEGWTNxMiUXF.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/sHeUJVSObcCQvZuq.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/wythBZmbxgvjNKVL.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/YnjfBZPLWPslwNZa.jpeg", alt: "Artwork in situ", isArtwork: false },
  // 6 new images (indices 20-25)
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/XwmXodDiFZAUXvDM.jpeg", alt: "Artist with artwork", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/vrSnBTBjJXHieUhU.jpeg", alt: "Artist with artwork", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/aBbCVLqPDnLzOcMl.jpeg", alt: "Artist in studio", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/KJVTYMbUZmDXWCxu.jpeg", alt: "Artwork in situ", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/UaAYekILMuUTxyQA.jpeg", alt: "Cat with artwork", isArtwork: false },
  { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/miZYbLXUpCJCPvAd.jpeg", alt: "Artist in studio", isArtwork: false },
];

// Desktop layout: each row has a fixed height via aspect ratio, all images use object-cover
// to eliminate white space. Non-artwork photos are safe to crop.
interface RowConfig {
  images: { idx: number; basis: number; objectPosition?: string }[];
  rowAspect: string;
}

const desktopRows: RowConfig[] = [
  // Row 1: hero — green sofa + blue triptych room
  {
    rowAspect: "3.2/1",
    images: [
      { idx: 0, basis: 52, objectPosition: "center 80%" },
      { idx: 11, basis: 48, objectPosition: "center 45%" },
    ],
  },
  // Row 2: framed art + diptych in-situ + triptych room
  {
    rowAspect: "2.8/1",
    images: [
      { idx: 2, basis: 28 },
      { idx: 23, basis: 44 },
      { idx: 1, basis: 28 },
    ],
  },
  // Row 3: artist selfie + pink diptych + cat
  {
    rowAspect: "2.6/1",
    images: [
      { idx: 21, basis: 26, objectPosition: "center 20%" },
      { idx: 5, basis: 48 },
      { idx: 24, basis: 26, objectPosition: "center 30%" },
    ],
  },
  // Row 4: blue diptych living room + artist portrait
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 6, basis: 55 },
      { idx: 22, basis: 45, objectPosition: "center 15%" },
    ],
  },
  // Row 5: small items + blue sofa + small items
  {
    rowAspect: "3/1",
    images: [
      { idx: 7, basis: 26 },
      { idx: 8, basis: 48 },
      { idx: 9, basis: 26 },
    ],
  },
  // Row 6: grey armchair + blue artwork bedroom
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 10, basis: 40 },
      { idx: 3, basis: 60 },
    ],
  },
  // Row 7: yellow flowers + diptych + artist reflection
  {
    rowAspect: "2.8/1",
    images: [
      { idx: 12, basis: 42 },
      { idx: 13, basis: 30 },
      { idx: 20, basis: 28, objectPosition: "center 25%" },
    ],
  },
  // Row 8: green triptych + purple flower
  {
    rowAspect: "2.6/1",
    images: [
      { idx: 15, basis: 42 },
      { idx: 16, basis: 58 },
    ],
  },
  // Row 9: kitchenware + artist painting through glass + dark kitchen
  {
    rowAspect: "2.8/1",
    images: [
      { idx: 17, basis: 30 },
      { idx: 25, basis: 34, objectPosition: "center 20%" },
      { idx: 14, basis: 36 },
    ],
  },
  // Row 10: living room + concrete wall + green artwork
  {
    rowAspect: "3/1",
    images: [
      { idx: 18, basis: 32 },
      { idx: 19, basis: 42 },
      { idx: 4, basis: 26 },
    ],
  },
];

// Mobile layout: sophisticated masonry using rows with varied aspect ratios
// Each row defines images and a row aspect ratio, similar to desktop but optimized for narrow screens
interface MobileRowConfig {
  images: { idx: number; basis: number; objectPosition?: string }[];
  rowAspect: string;
}

const mobileRows: MobileRowConfig[] = [
  // Hero: green sofa full width
  {
    rowAspect: "4/3",
    images: [
      { idx: 0, basis: 100, objectPosition: "center 75%" },
    ],
  },
  // Two side by side: blue triptych + framed art
  {
    rowAspect: "5/3",
    images: [
      { idx: 11, basis: 55, objectPosition: "center 40%" },
      { idx: 2, basis: 45 },
    ],
  },
  // Full width: diptych in-situ
  {
    rowAspect: "16/9",
    images: [
      { idx: 23, basis: 100 },
    ],
  },
  // Three across: artist selfie + cat + triptych room
  {
    rowAspect: "5/3",
    images: [
      { idx: 21, basis: 35, objectPosition: "center 20%" },
      { idx: 24, basis: 30, objectPosition: "center 30%" },
      { idx: 1, basis: 35 },
    ],
  },
  // Full width: pink diptych
  {
    rowAspect: "16/9",
    images: [
      { idx: 5, basis: 100 },
    ],
  },
  // Two: blue diptych + artist portrait
  {
    rowAspect: "3/2",
    images: [
      { idx: 6, basis: 55 },
      { idx: 22, basis: 45, objectPosition: "center 15%" },
    ],
  },
  // Full width: blue sofa
  {
    rowAspect: "16/9",
    images: [
      { idx: 8, basis: 100 },
    ],
  },
  // Two side by side: small items
  {
    rowAspect: "5/3",
    images: [
      { idx: 7, basis: 50 },
      { idx: 9, basis: 50 },
    ],
  },
  // Full width: blue artwork bedroom
  {
    rowAspect: "4/3",
    images: [
      { idx: 3, basis: 100 },
    ],
  },
  // Two: grey armchair + artist reflection
  {
    rowAspect: "3/2",
    images: [
      { idx: 10, basis: 50 },
      { idx: 20, basis: 50, objectPosition: "center 25%" },
    ],
  },
  // Full width: yellow flowers
  {
    rowAspect: "16/9",
    images: [
      { idx: 12, basis: 100 },
    ],
  },
  // Two: diptych + green triptych
  {
    rowAspect: "5/3",
    images: [
      { idx: 13, basis: 45 },
      { idx: 15, basis: 55 },
    ],
  },
  // Full width: purple flower
  {
    rowAspect: "4/3",
    images: [
      { idx: 16, basis: 100 },
    ],
  },
  // Three across: kitchenware + artist painting + dark kitchen
  {
    rowAspect: "5/3",
    images: [
      { idx: 17, basis: 30 },
      { idx: 25, basis: 38, objectPosition: "center 20%" },
      { idx: 14, basis: 32 },
    ],
  },
  // Full width: concrete wall
  {
    rowAspect: "16/9",
    images: [
      { idx: 19, basis: 100 },
    ],
  },
  // Final two: living room + green artwork
  {
    rowAspect: "3/2",
    images: [
      { idx: 18, basis: 55 },
      { idx: 4, basis: 45 },
    ],
  },
];

export default function InSituGallery() {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  const renderRow = (row: RowConfig | MobileRowConfig, rowIndex: number, gap: string, mb: string) => (
    <div
      key={rowIndex}
      className="flex"
      style={{
        gap,
        marginBottom: mb,
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

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-16 pb-8">
        {/* Desktop layout */}
        <div className="hidden sm:block px-1 lg:px-2 max-w-[1600px] mx-auto">
          {desktopRows.map((row, i) => renderRow(row, i, "3px", "3px"))}
        </div>

        {/* Mobile layout: row-based masonry with varied rhythms */}
        <div className="sm:hidden px-[2px]">
          {mobileRows.map((row, i) => renderRow(row, i, "2px", "2px"))}
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
