import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { formatPrice, formatSize } from "../lib/formatters";
import { useCartStore } from "../store/cartStore";

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<bigint | null>(
    product.sizes.length > 0 ? product.sizes[0].size : null,
  );
  const addItem = useCartStore((s) => s.addItem);

  const selectedVariant = product.sizes.find((s) => s.size === selectedSize);
  const imageUrl = product.image ? product.image.getDirectURL() : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedVariant) {
      toast.error("Please select a size");
      return;
    }
    addItem({
      productId: product.id,
      productName: product.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      quantity: 1,
      image: imageUrl ?? undefined,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <button
      type="button"
      className="group flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-all duration-300 hover:border-gold hover:shadow-gold cursor-pointer"
      onClick={() => onNavigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag size={48} className="text-muted-foreground" />
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded border border-muted-foreground px-3 py-1 text-xs tracking-luxury uppercase text-muted-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
            {product.name}
          </h3>
          {product.inspiredBy && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Inspired by {product.inspiredBy}
            </p>
          )}
        </div>

        {/* Size chips */}
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((variant) => (
              <button
                type="button"
                key={variant.size.toString()}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(variant.size);
                }}
                className={`rounded-sm px-2 py-0.5 text-xs tracking-wide uppercase transition-colors ${
                  selectedSize === variant.size
                    ? "bg-gold text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-gold hover:text-gold"
                }`}
              >
                {formatSize(variant.size)}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="font-display text-base text-gold">
            {selectedVariant ? formatPrice(selectedVariant.price) : "N/A"}
          </span>
          <span className="text-xs capitalize text-muted-foreground">
            {product.gender}
          </span>
        </div>

        {/* Add to Cart */}
        <Button
          data-ocid="product.primary_button"
          onClick={handleAddToCart}
          disabled={!product.inStock || !selectedVariant}
          className="w-full bg-gold text-primary-foreground tracking-luxury uppercase text-xs hover:bg-gold/90 disabled:opacity-40"
        >
          Add to Cart
        </Button>
      </div>
    </button>
  );
}
