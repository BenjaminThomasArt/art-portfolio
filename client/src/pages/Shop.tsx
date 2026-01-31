import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Shop() {
  const { data: prints, isLoading } = trpc.prints.getAll.useQuery();

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] hover:scale-110"
          style={{
            backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663325255079/TGNsMbsGdWXQhRmCtYbG6q/shop-backgrounds/print-photo-bg.jpg)',
            opacity: 0.45
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight mb-4">Shop</h1>
            <p className="text-lg md:text-xl text-muted-foreground">Quality prints available to order in a range of materials and sizes. Custom orders available on request.</p>
          </div>
        </div>
      </div>

      {/* Print Catalog Section */}
      <div className="py-24">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <div className="h-6 bg-muted animate-pulse w-3/4" />
                  <div className="h-10 bg-muted animate-pulse w-full" />
                </div>
              ))}
            </div>
          ) : prints && prints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {prints.map((print) => (
                <PrintCard key={print.id} print={print} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <ShoppingBag size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-8">No prints available at the moment</p>
              <Link href="/gallery">
                <button className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Browse Gallery
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PrintCard({ print }: { print: any }) {
  const [material, setMaterial] = useState<string>("giclee");
  const [size, setSize] = useState<string>("80x60");

  // Price mapping based on size
  const priceMap: Record<string, string> = {
    "80x60": "£150",
    "120x100": "£225",
    "custom": "Contact for pricing"
  };

  const currentPrice = priceMap[size] || "Contact for pricing";

  const handleOrder = () => {
    // Build query params with selected options
    const params = new URLSearchParams({
      printTitle: print.title,
      material: material,
      size: size
    });
    window.location.href = `/contact?${params.toString()}`;
  };

  return (
    <div className="group">
      <div className="aspect-square overflow-hidden bg-muted mb-4">
        <img
          src={print.imageUrl}
          alt={print.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-serif mb-2">{print.title}</h3>
          {print.description && (
            <p className="text-sm text-muted-foreground mb-2">{print.description}</p>
          )}
          {print.price && (
            <p className="text-lg font-serif mt-2">{print.price}</p>
          )}
        </div>

        {/* Material Selector */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Material</label>
          <Select value={material} onValueChange={setMaterial}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="giclee">Giclée</SelectItem>
              <SelectItem value="pvc">PVC board</SelectItem>
              <SelectItem value="canvas">Canvas inkjet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Size Selector */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Size</label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="80x60">80 x 60 cm</SelectItem>
              <SelectItem value="120x100">120 x 100 cm</SelectItem>
              <SelectItem value="custom">Custom size - contact for details</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Display */}
        <div className="pt-2 pb-1 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Price:</span>
            <span className="text-xl font-serif">{currentPrice}</span>
          </div>
        </div>

        <button 
          onClick={handleOrder}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ShoppingBag size={18} />
          Order
        </button>
      </div>
    </div>
  );
}
