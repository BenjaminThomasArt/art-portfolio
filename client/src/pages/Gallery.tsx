import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";
import { ImageZoom } from "@/components/ImageZoom";
import { ArtworkCarousel } from "@/components/ArtworkCarousel";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableArtworkProps {
  artwork: any;
  isEditMode: boolean;
  onImageClick: (src: string, alt: string) => void;
}

function SortableArtwork({ artwork, isEditMode, onImageClick }: SortableArtworkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: artwork.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const galleryImages = artwork.galleryImages ? JSON.parse(artwork.galleryImages as string) : [];
  const hasCarousel = galleryImages.length > 0;

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing bg-white/90 p-2 rounded-md shadow-md hover:bg-white"
        >
          <GripVertical className="w-5 h-5 text-gray-600" />
        </div>
      )}
      
      {hasCarousel ? (
        <ArtworkCarousel
          artworkId={artwork.id}
          galleryImages={galleryImages}
          artworkTitle={artwork.title}
          onImageClick={onImageClick}
        />
      ) : (
        <div className="aspect-[3/4] overflow-hidden bg-white mb-2 relative">
          <div 
            className="w-full h-full cursor-zoom-in"
            onClick={() => onImageClick(artwork.imageUrl, artwork.title)}
          >
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-103"
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Link href={`/artwork/${artwork.id}`}>
          <h3 className="text-lg font-serif mb-2 hover:underline cursor-pointer">'{artwork.title}'</h3>
        </Link>
        {artwork.available === 'sold' && (
          <div className="w-2.5 h-2.5 bg-red-600 rounded-full flex-shrink-0" title="Sold" />
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {artwork.year && <span>{artwork.year}</span>}
        {artwork.medium && (
          <>
            {artwork.year && <span>•</span>}
            <span>{artwork.medium}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function Gallery() {
  const { user } = useAuth();
  const { data: artworks, isLoading, refetch } = trpc.artworks.getAll.useQuery();
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [localArtworks, setLocalArtworks] = useState<any[]>([]);
  
  const updateDisplayOrder = trpc.artworks.updateDisplayOrder.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update local artworks when data changes
  useState(() => {
    if (artworks) {
      setLocalArtworks(artworks);
    }
  });

  if (artworks && localArtworks.length === 0) {
    setLocalArtworks(artworks);
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localArtworks.findIndex((item) => item.id === active.id);
      const newIndex = localArtworks.findIndex((item) => item.id === over.id);

      const newArtworks = arrayMove(localArtworks, oldIndex, newIndex);
      setLocalArtworks(newArtworks);

      // Update display order in database for all affected artworks
      const updates = newArtworks.map((artwork, index) => {
        const newDisplayOrder = (index + 1) * 10; // Use increments of 10 for easier future insertions
        return updateDisplayOrder.mutateAsync({
          artworkId: artwork.id,
          newDisplayOrder,
        });
      });

      await Promise.all(updates);
    }
  };

  const isAdmin = user?.role === 'admin';
  const displayArtworks = isEditMode ? localArtworks : (artworks || []);

  return (
    <div className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-[#003153]">Originals</h1>
            {isAdmin && (
              <Button
                variant={isEditMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? "Done Editing" : "Reorder"}
              </Button>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            {isEditMode ? "Drag artworks to reorder them" : "Explore more works"}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
            ))}
          </div>
        ) : displayArtworks && displayArtworks.length > 0 ? (
          isEditMode ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={displayArtworks.map((a) => a.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayArtworks.map((artwork) => (
                    <SortableArtwork
                      key={artwork.id}
                      artwork={artwork}
                      isEditMode={isEditMode}
                      onImageClick={(src, alt) => setZoomImage({ src, alt })}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayArtworks.map((artwork) => (
                <SortableArtwork
                  key={artwork.id}
                  artwork={artwork}
                  isEditMode={false}
                  onImageClick={(src, alt) => setZoomImage({ src, alt })}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-24">
            <p className="text-lg text-muted-foreground">No artworks available yet</p>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      <ImageZoom
        src={zoomImage?.src || ""}
        alt={zoomImage?.alt || ""}
        isOpen={!!zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}
