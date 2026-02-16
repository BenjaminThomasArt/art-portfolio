import { useState, useEffect, useRef, useCallback } from "react";
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

// Scale factors to create non-uniform sizing
// Values > 1 make the image wider (takes more visual weight)
const scaleFactors: Record<number, number> = {
  0: 1.6,   // larger
  4: 1.4,   // wider
  7: 1.3,   // slightly wider
  10: 1.6,  // larger
  13: 1.4,  // wider
  17: 1.3,  // slightly wider
};

export default function InSituGallery() {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);
  const [columns, setColumns] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive column count
  useEffect(() => {
    const updateColumns = () => {
      const w = window.innerWidth;
      if (w < 640) setColumns(2);
      else if (w < 1024) setColumns(3);
      else setColumns(4);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Distribute images into columns using a balanced approach
  // Images with scale factors get placed in columns with least total height
  const distributeImages = useCallback(() => {
    const cols: { images: typeof galleryImages; totalWeight: number }[] = 
      Array.from({ length: columns }, () => ({ images: [], totalWeight: 0 }));

    galleryImages.forEach((image, index) => {
      const scale = scaleFactors[index] || 1;
      // Find the column with the least total weight
      let minCol = 0;
      let minWeight = Infinity;
      for (let c = 0; c < cols.length; c++) {
        if (cols[c].totalWeight < minWeight) {
          minWeight = cols[c].totalWeight;
          minCol = c;
        }
      }
      cols[minCol].images.push({ ...image, _index: index } as any);
      cols[minCol].totalWeight += scale;
    });

    return cols;
  }, [columns]);

  const distributedColumns = distributeImages();

  return (
    <div className="min-h-screen bg-background">
      {/* Organic collage - images only, no cropping */}
      <section className="pt-20 pb-8 sm:pb-12">
        <div className="px-2 sm:px-3 lg:px-4" ref={containerRef}>
          <div className="flex gap-2 sm:gap-3">
            {distributedColumns.map((col, colIndex) => (
              <div key={colIndex} className="flex-1 flex flex-col gap-2 sm:gap-3">
                {col.images.map((image: any) => {
                  const index = image._index;
                  const scale = scaleFactors[index] || 1;
                  return (
                    <div
                      key={index}
                      className="group cursor-pointer overflow-hidden rounded-sm"
                      onClick={() => setZoomImage(image)}
                      style={{
                        // Larger scale = more padding around image for visual weight variation
                        padding: scale > 1 ? `${(scale - 1) * 4}px` : undefined,
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-auto object-contain transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-105"
                        loading="lazy"
                      />
                    </div>
                  );
                })}
              </div>
            ))}
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
