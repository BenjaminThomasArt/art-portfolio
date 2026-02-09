import { trpc } from "@/lib/trpc";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageZoom } from "@/components/ImageZoom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ArtworkDetail() {
  const [, params] = useRoute("/artwork/:id");
  const artworkId = params?.id ? parseInt(params.id) : 0;
  
  const { data: artwork, isLoading } = trpc.artworks.getById.useQuery({ id: artworkId });
  const submitInquiry = trpc.inquiries.submit.useMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  // Parse gallery images from JSON string
  const galleryImages = artwork?.galleryImages 
    ? JSON.parse(artwork.galleryImages) 
    : [artwork?.imageUrl];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for carousel
  useEffect(() => {
    // Only enable keyboard navigation if there are multiple images and zoom is not open
    if (galleryImages.length <= 1 || zoomImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryImages.length, zoomImage, handlePrevImage, handleNextImage]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitInquiry.mutateAsync({
        type: "print",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        artworkId: artworkId,
      });

      toast.success("Inquiry sent successfully! We'll be in touch soon.");
      setDialogOpen(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to send inquiry. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="py-24">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-muted animate-pulse" />
              <div className="space-y-4">
                <div className="h-12 bg-muted animate-pulse" />
                <div className="h-6 bg-muted animate-pulse w-1/2" />
                <div className="h-24 bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="py-24">
        <div className="container text-center">
          <h1 className="text-3xl font-serif mb-4">Artwork not found</h1>
          <Link href="/gallery">
            <Button variant="outline">Back to Originals</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24">
      <div className="container">
        <Link href="/gallery">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft size={18} /> Back to Originals
          </Button>
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Carousel */}
            <div 
              className="relative aspect-square bg-muted group cursor-zoom-in"
              onClick={() => setZoomImage({ 
                src: galleryImages[currentImageIndex], 
                alt: `${artwork.title} - Image ${currentImageIndex + 1}` 
              })}
            >
              <img
                src={galleryImages[currentImageIndex]}
                alt={`${artwork.title} - Image ${currentImageIndex + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              
              {/* Carousel controls - only show if multiple images */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </div>
                  
                  {/* Thumbnail dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {galleryImages.map((_: string, index: number) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'bg-white w-6' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">
                '{artwork.title}'
              </h1>

              <div className="space-y-2 mb-8 text-muted-foreground">
                {artwork.year && <p>{artwork.year}</p>}
                {artwork.medium && <p>{artwork.medium}</p>}
                {artwork.dimensions && <p>{artwork.dimensions}</p>}
              </div>

              {artwork.description && (
                <div className="mb-8">
                  <p className="text-foreground leading-relaxed">{artwork.description}</p>
                </div>
              )}

              {/* Print Inquiry */}
              <div className="mt-auto pt-8 border-t border-border">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full md:w-auto">
                      Inquire About Prints
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Print Inquiry</DialogTitle>
                      <DialogDescription>
                        Interested in a print of "{artwork.title}"? Fill out the form below and we'll get back to you with details.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          required
                          rows={4}
                          placeholder="Please let us know your preferred size and any other details..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={submitInquiry.isPending}>
                        {submitInquiry.isPending ? "Sending..." : "Send Inquiry"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
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
