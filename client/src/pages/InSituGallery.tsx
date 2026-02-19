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

// Desktop layout: rows use aspect ratios tuned to avoid cropping artworks in photos.
// Taller rows (lower ratio) = less vertical crop. Wider basis = less horizontal crop.
// objectPosition focuses on the artwork area within each photo.
interface RowConfig {
  images: { idx: number; basis: number; objectPosition?: string }[];
  rowAspect: string;
}

const desktopRows: RowConfig[] = [
  // Row 1: green sofa (artwork at top) + blue triptych room
  // Made taller (2.4/1 from 3.2/1) so the painting above the sofa isn't cropped
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 0, basis: 50, objectPosition: "center 60%" },
      { idx: 11, basis: 50, objectPosition: "center 40%" },
    ],
  },
  // Row 2: framed art + diptych in-situ + triptych room
  // Wider basis for side images to avoid horizontal crop of framed artworks
  {
    rowAspect: "2.6/1",
    images: [
      { idx: 2, basis: 30, objectPosition: "center 40%" },
      { idx: 23, basis: 40 },
      { idx: 1, basis: 30, objectPosition: "center 35%" },
    ],
  },
  // Row 3: artist selfie + pink diptych + cat
  // Pink diptych gets more space; person/cat photos can be cropped more freely
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 21, basis: 24, objectPosition: "center 20%" },
      { idx: 5, basis: 52, objectPosition: "center 45%" },
      { idx: 24, basis: 24, objectPosition: "center 30%" },
    ],
  },
  // Row 4: blue diptych living room + artist portrait
  // Blue diptych artworks are well-framed at this ratio
  {
    rowAspect: "2.2/1",
    images: [
      { idx: 6, basis: 55, objectPosition: "center 35%" },
      { idx: 22, basis: 45, objectPosition: "center 15%" },
    ],
  },
  // Row 5: small items + blue sofa + small items
  // Made taller (2.4/1 from 3/1) so artwork above blue sofa isn't cropped at top
  // Wider side columns (30% from 26%) to show framed artworks better
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 7, basis: 30, objectPosition: "center 30%" },
      { idx: 8, basis: 40, objectPosition: "center 35%" },
      { idx: 9, basis: 30, objectPosition: "center 40%" },
    ],
  },
  // Row 6: grey armchair (cloud artworks) + blue artwork bedroom
  // Made taller (2/1 from 2.4/1) so cloud artworks above armchair aren't cropped
  {
    rowAspect: "2/1",
    images: [
      { idx: 10, basis: 42, objectPosition: "center 30%" },
      { idx: 3, basis: 58, objectPosition: "center 40%" },
    ],
  },
  // Row 7: yellow flowers + diptych + artist reflection
  // Yellow flowers artwork is well-framed; diptych gets wider basis
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 12, basis: 38, objectPosition: "center 40%" },
      { idx: 13, basis: 34, objectPosition: "center 45%" },
      { idx: 20, basis: 28, objectPosition: "center 25%" },
    ],
  },
  // Row 8: green botanical pair + purple flower
  // Both contain prominent artworks, keep ratio moderate
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 15, basis: 42, objectPosition: "center 40%" },
      { idx: 16, basis: 58, objectPosition: "center 45%" },
    ],
  },
  // Row 9: green artwork with bench + artist painting + kitchen with art
  // Wider basis for artwork images, artist photo can crop more
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 17, basis: 34, objectPosition: "center 40%" },
      { idx: 25, basis: 30, objectPosition: "center 20%" },
      { idx: 14, basis: 36, objectPosition: "center 35%" },
    ],
  },
  // Row 10: living room (two artworks) + concrete wall + framed artworks
  // Made taller (2.4/1 from 3/1) to avoid cropping artworks on wall
  // Wider side columns to show framed artworks
  {
    rowAspect: "2.4/1",
    images: [
      { idx: 18, basis: 34, objectPosition: "center 35%" },
      { idx: 19, basis: 36, objectPosition: "center 45%" },
      { idx: 4, basis: 30, objectPosition: "center 40%" },
    ],
  },
];

// Mobile layout: taller aspect ratios to preserve artwork visibility on narrow screens.
// Full-width images use 4/3 or 3/2 (not 16/9) to avoid heavy vertical cropping.
// Two-image rows use 1/1 or 4/3 to keep images tall enough.
// Three-across rows avoided where possible; when used, aspect ratio is taller.
const mobileRows: RowConfig[] = [
  // Hero: green sofa full width — artwork above sofa needs to be visible
  {
    rowAspect: "3/2",
    images: [
      { idx: 0, basis: 100, objectPosition: "center 55%" },
    ],
  },
  // Two side by side: blue triptych + framed art
  {
    rowAspect: "1/1",
    images: [
      { idx: 11, basis: 55, objectPosition: "center 35%" },
      { idx: 2, basis: 45, objectPosition: "center 40%" },
    ],
  },
  // Full width: diptych in-situ — artworks on wall
  {
    rowAspect: "4/3",
    images: [
      { idx: 23, basis: 100, objectPosition: "center 40%" },
    ],
  },
  // Two: artist selfie + triptych room (cat moved to own row to avoid 3-across crop)
  {
    rowAspect: "1/1",
    images: [
      { idx: 21, basis: 40, objectPosition: "center 20%" },
      { idx: 1, basis: 60, objectPosition: "center 35%" },
    ],
  },
  // Full width: cat with artwork
  {
    rowAspect: "4/3",
    images: [
      { idx: 24, basis: 100, objectPosition: "center 30%" },
    ],
  },
  // Full width: pink diptych — prominent artworks
  {
    rowAspect: "4/3",
    images: [
      { idx: 5, basis: 100, objectPosition: "center 45%" },
    ],
  },
  // Two: blue diptych + artist portrait
  {
    rowAspect: "1/1",
    images: [
      { idx: 6, basis: 55, objectPosition: "center 35%" },
      { idx: 22, basis: 45, objectPosition: "center 15%" },
    ],
  },
  // Full width: blue sofa with artwork above
  {
    rowAspect: "3/2",
    images: [
      { idx: 8, basis: 100, objectPosition: "center 35%" },
    ],
  },
  // Two side by side: framed artworks
  {
    rowAspect: "1/1",
    images: [
      { idx: 7, basis: 50, objectPosition: "center 35%" },
      { idx: 9, basis: 50, objectPosition: "center 40%" },
    ],
  },
  // Full width: blue artwork bedroom
  {
    rowAspect: "3/2",
    images: [
      { idx: 3, basis: 100, objectPosition: "center 40%" },
    ],
  },
  // Two: grey armchair (cloud artworks) + artist reflection
  {
    rowAspect: "1/1",
    images: [
      { idx: 10, basis: 55, objectPosition: "center 30%" },
      { idx: 20, basis: 45, objectPosition: "center 25%" },
    ],
  },
  // Full width: yellow flowers artwork
  {
    rowAspect: "3/2",
    images: [
      { idx: 12, basis: 100, objectPosition: "center 40%" },
    ],
  },
  // Two: dark diptych + green botanical pair
  {
    rowAspect: "1/1",
    images: [
      { idx: 13, basis: 45, objectPosition: "center 45%" },
      { idx: 15, basis: 55, objectPosition: "center 40%" },
    ],
  },
  // Full width: purple flower artwork
  {
    rowAspect: "3/2",
    images: [
      { idx: 16, basis: 100, objectPosition: "center 45%" },
    ],
  },
  // Two: green artwork with bench + kitchen with art (artist painting moved to own row)
  {
    rowAspect: "1/1",
    images: [
      { idx: 17, basis: 50, objectPosition: "center 40%" },
      { idx: 14, basis: 50, objectPosition: "center 35%" },
    ],
  },
  // Full width: artist painting through glass
  {
    rowAspect: "4/3",
    images: [
      { idx: 25, basis: 100, objectPosition: "center 20%" },
    ],
  },
  // Full width: concrete wall artwork
  {
    rowAspect: "3/2",
    images: [
      { idx: 19, basis: 100, objectPosition: "center 45%" },
    ],
  },
  // Final two: living room artworks + framed artworks
  {
    rowAspect: "1/1",
    images: [
      { idx: 18, basis: 55, objectPosition: "center 35%" },
      { idx: 4, basis: 45, objectPosition: "center 40%" },
    ],
  },
];

export default function InSituGallery() {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  const renderRow = (row: RowConfig, rowIndex: number, gap: string, mb: string) => (
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

        {/* Mobile layout: row-based with taller aspect ratios to preserve artwork visibility */}
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
