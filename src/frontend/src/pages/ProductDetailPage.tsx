import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddReview,
  useGetProduct,
  useGetProductReviews,
} from "../hooks/useQueries";
import { formatPrice, formatSize } from "../lib/formatters";
import { useCartStore } from "../store/cartStore";

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (path: string) => void;
}

export default function ProductDetailPage({
  productId,
  onNavigate,
}: ProductDetailPageProps) {
  const { data: product, isLoading } = useGetProduct(productId);
  const { data: reviews } = useGetProductReviews(productId);
  const addReview = useAddReview();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedSize, setSelectedSize] = useState<bigint | null>(null);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const selectedVariant = product?.sizes.find((s) => s.size === selectedSize);
  const imageUrl = product?.image ? product.image.getDirectURL() : null;

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedVariant) {
      toast.error("Please select a size first");
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

  const handleSubmitReview = async () => {
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error("Please fill in all review fields");
      return;
    }
    try {
      await addReview.mutateAsync({
        productId,
        customerName: reviewName,
        rating: BigInt(reviewRating),
        comment: reviewComment,
      });
      toast.success("Review submitted!");
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
    } catch {
      toast.error("Failed to submit review");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Product not found.</p>
        <Button
          onClick={() => onNavigate("/products")}
          className="border border-gold bg-transparent text-gold hover:bg-gold hover:text-primary-foreground"
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-screen-xl px-6">
        {/* Back */}
        <button
          type="button"
          data-ocid="product_detail.link"
          onClick={() => onNavigate("/products")}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft size={16} /> Back to Perfumes
        </button>

        {/* Product */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-lg border border-border bg-card"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center">
                <ShoppingBag size={80} className="text-muted-foreground" />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="mb-1 text-xs tracking-[0.25em] uppercase text-gold">
                {product.gender}
              </p>
              <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-foreground">
                {product.name}
              </h1>
              {product.inspiredBy && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Inspired by {product.inspiredBy}
                </p>
              )}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Size selector */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-luxury text-foreground">
                Select Size
              </p>
              <div
                className="flex flex-wrap gap-2"
                data-ocid="product_detail.select"
              >
                {product.sizes.map((variant) => (
                  <button
                    type="button"
                    key={variant.size.toString()}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`flex flex-col items-center rounded border px-4 py-3 text-sm transition-colors ${
                      selectedSize === variant.size
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                    }`}
                  >
                    <span className="font-medium">
                      {formatSize(variant.size)}
                    </span>
                    <span className="text-xs">
                      {formatPrice(variant.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            {selectedVariant && (
              <div className="text-3xl font-display text-gold">
                {formatPrice(selectedVariant.price)}
              </div>
            )}

            {/* Add to Cart */}
            <Button
              data-ocid="product_detail.primary_button"
              onClick={handleAddToCart}
              disabled={!product.inStock || !selectedVariant}
              className="w-full bg-gold py-6 text-sm font-semibold uppercase tracking-luxury text-primary-foreground hover:bg-gold/90 disabled:opacity-40"
            >
              {!product.inStock
                ? "Out of Stock"
                : !selectedVariant
                  ? "Select a Size"
                  : "Add to Cart"}
            </Button>

            {!product.inStock && (
              <p className="text-sm text-destructive">
                This product is currently out of stock.
              </p>
            )}
          </motion.div>
        </div>

        {/* Reviews */}
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl font-bold uppercase tracking-luxury text-foreground">
            Customer Reviews
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Existing reviews */}
            <div className="flex flex-col gap-4">
              {reviews?.length === 0 && (
                <p
                  data-ocid="reviews.empty_state"
                  className="text-sm text-muted-foreground"
                >
                  No reviews yet. Be the first!
                </p>
              )}
              {reviews?.map((review, i) => (
                <div
                  key={review.id.toString()}
                  data-ocid={`reviews.item.${i + 1}`}
                  className="rounded-lg border border-border bg-card p-5"
                >
                  <div className="mb-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={13}
                        className={
                          n <= Number(review.rating)
                            ? "fill-gold text-gold"
                            : "text-muted-foreground"
                        }
                      />
                    ))}
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wide text-foreground">
                    {review.customerName}
                  </p>
                </div>
              ))}
            </div>

            {/* Add review */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-sm uppercase tracking-luxury text-foreground">
                Write a Review
              </h3>
              <div className="flex flex-col gap-4">
                <input
                  data-ocid="review.input"
                  type="text"
                  placeholder="Your name"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="rounded border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
                />
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setReviewRating(r)}
                    >
                      <Star
                        size={20}
                        className={
                          r <= reviewRating
                            ? "fill-gold text-gold"
                            : "text-muted-foreground"
                        }
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  data-ocid="review.textarea"
                  placeholder="Share your experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  className="rounded border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none resize-none"
                />
                <Button
                  data-ocid="review.submit_button"
                  onClick={handleSubmitReview}
                  disabled={addReview.isPending}
                  className="bg-gold text-primary-foreground hover:bg-gold/90 tracking-luxury uppercase"
                >
                  {addReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
