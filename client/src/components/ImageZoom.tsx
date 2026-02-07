import { X } from "lucide-react";
import { useEffect } from "react";

interface ImageZoomProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoom({ src, alt, isOpen, onClose }: ImageZoomProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close zoom"
      >
        <X size={24} />
      </button>

      {/* Zoomed image */}
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[90vh] object-contain animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Click anywhere to close hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        Click anywhere or press ESC to close
      </div>
    </div>
  );
}
