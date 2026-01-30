import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Gallery() {
  const { data: artworks, isLoading } = trpc.artworks.getAll.useQuery();

  return (
    <div className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Gallery</h1>
          <p className="text-lg text-muted-foreground">Explore the complete collection</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse" />
            ))}
          </div>
        ) : artworks && artworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork) => (
              <Link key={artwork.id} href={`/artwork/${artwork.id}`}>
                <div className="group cursor-pointer">
                  <div className="aspect-square overflow-hidden bg-muted mb-4">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-lg font-serif mb-1">{artwork.title}</h3>
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
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-lg text-muted-foreground">No artworks available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
