import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipe } from "@/hooks/useSwipe";

interface UpcycleCarouselProps {
  images: string[];
  title: string;
  onImageClick: (src: string, alt: string) => void;
}

export function UpcycleCarousel({ images, title, onImageClick }: UpcycleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images.length;
  const displayImage = images[currentIndex];

  const { ref: swipeRef, dragOffset, isDragging } = useSwipe({
    onSwipeLeft: () => {
      if (currentIndex < totalImages - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    },
    onSwipeRight: () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  });

  return (
    <div ref={swipeRef} className="aspect-square overflow-hidden bg-[#f5f3f0] border border-gray-200 mb-2 relative shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div 
        className="w-full h-full p-[8%] cursor-zoom-in"
        onClick={() => !isDragging && onImageClick(displayImage, title)}
        style={{
          transform: `translateX(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <img
          src={displayImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
        />
      </div>
      
      {/* Carousel Navigation */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(currentIndex - 1);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {currentIndex < totalImages - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(currentIndex + 1);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>
      )}
      
      {/* Dot Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {Array.from({ length: totalImages }).map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "bg-gray-800 w-6"
                : "bg-gray-400 hover:bg-gray-600"
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
      
      {/* Image Counter */}
      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {currentIndex + 1} / {totalImages}
      </div>
    </div>
  );
}
