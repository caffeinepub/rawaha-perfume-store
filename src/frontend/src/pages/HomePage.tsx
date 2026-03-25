import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Leaf, RefreshCw, Shield, Star, Truck } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { useGetProducts } from "../hooks/useQueries";

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const trustBadges = [
  { icon: Truck, label: "Free Shipping", sub: "On orders above Rs.5,000" },
  { icon: Leaf, label: "Pure Ingredients", sub: "100% authentic oils" },
  { icon: Shield, label: "Secure Payment", sub: "Fully encrypted" },
  { icon: RefreshCw, label: "Easy Returns", sub: "7-day return policy" },
];

const staticReviews = [
  {
    name: "Ayesha M.",
    rating: 5,
    text: "Absolutely divine! The Oud Royale is everything I dreamed of. Long-lasting and incredibly unique.",
  },
  {
    name: "Fatima K.",
    rating: 5,
    text: "I bought the floral bouquet for my wedding day — everyone was asking where I got my perfume from!",
  },
  {
    name: "Ahmed R.",
    rating: 5,
    text: "The packaging alone is worth it. Rawaha has elevated my fragrance game completely.",
  },
];

const blogPosts = [
  {
    title: "The Art of Oud: A Journey Through Arabian Fragrance",
    date: "March 10, 2026",
    image: "https://picsum.photos/seed/blog1/600/400",
    excerpt:
      "Discover the rich heritage and complex artistry behind the world's most prized fragrance ingredient.",
  },
  {
    title: "How to Layer Perfumes Like a Pro",
    date: "February 28, 2026",
    image: "https://picsum.photos/seed/blog2/600/400",
    excerpt:
      "Our master perfumers share their top techniques for creating a truly personal signature scent.",
  },
  {
    title: "Gifting Guide: Fragrances for Every Occasion",
    date: "February 14, 2026",
    image: "https://picsum.photos/seed/blog3/600/400",
    excerpt:
      "From weddings to birthdays, find the perfect scent to express your heartfelt sentiments.",
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: products, isLoading } = useGetProducts();
  const featuredProducts = products?.filter((p) => p.featured) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/assets/generated/hero-perfume.dim_1400x800.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="relative z-10 mx-auto max-w-screen-xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-gold">
              Luxury Arabian Fragrances
            </p>
            <h1 className="font-display text-5xl font-bold uppercase leading-tight tracking-[0.1em] text-foreground md:text-6xl lg:text-7xl">
              Wear Your
              <span className="block text-gold">Signature</span>
              Scent
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Crafted from the world's finest oud, jasmine, and rose — each
              Rawaha fragrance tells a story of heritage, luxury, and timeless
              elegance.
            </p>
            <div className="mt-10 flex gap-4">
              <Button
                data-ocid="hero.primary_button"
                onClick={() => onNavigate("/products")}
                className="bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-luxury text-primary-foreground hover:bg-gold/90"
              >
                Shop Now
              </Button>
              <Button
                data-ocid="hero.secondary_button"
                variant="outline"
                onClick={() => onNavigate("/collections")}
                className="border-border bg-transparent px-8 py-3 text-sm uppercase tracking-luxury text-foreground hover:border-gold hover:text-gold"
              >
                Collections <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-screen-xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <badge.icon size={24} className="shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-foreground">
                    {badge.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{badge.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="mx-auto max-w-screen-xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-2 text-xs tracking-[0.3em] uppercase text-gold">
              Handpicked for You
            </p>
            <h2 className="font-display text-3xl font-bold uppercase tracking-luxury text-foreground">
              Featured Fragrances
            </h2>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg border border-border p-4">
                  <Skeleton className="mb-4 aspect-[3/4] w-full rounded" />
                  <Skeleton className="mb-2 h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 4).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} onNavigate={onNavigate} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Static fallback cards */}
              {[
                {
                  name: "Oud Royale",
                  sub: "Inspired by Tom Ford Oud Wood",
                  price: "Rs.4,600",
                  img: "/assets/generated/perfume-oud.dim_600x700.jpg",
                  sizes: ["5ML", "10ML", "30ML"],
                },
                {
                  name: "Jasmine Bloom",
                  sub: "Inspired by Chanel No. 5",
                  price: "Rs.3,200",
                  img: "/assets/generated/perfume-floral.dim_600x700.jpg",
                  sizes: ["10ML", "30ML", "50ML"],
                },
                {
                  name: "Noir Mystique",
                  sub: "Inspired by Dior Sauvage",
                  price: "Rs.5,100",
                  img: "/assets/generated/perfume-noir.dim_600x700.jpg",
                  sizes: ["5ML", "10ML"],
                },
                {
                  name: "Royal Amber",
                  sub: "Inspired by Creed Aventus",
                  price: "Rs.6,800",
                  img: "/assets/generated/perfume-royal.dim_600x700.jpg",
                  sizes: ["10ML", "30ML"],
                },
              ].map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-gold hover:shadow-gold"
                  onClick={() => onNavigate("/products")}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-3 p-4">
                    <div>
                      <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
                        {p.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {p.sub}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.sizes.map((s) => (
                        <span
                          key={s}
                          className="rounded-sm border border-border px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base text-gold">
                        {p.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Unisex
                      </span>
                    </div>
                    <button
                      type="button"
                      className="w-full rounded bg-gold py-2 text-xs font-semibold uppercase tracking-luxury text-primary-foreground hover:bg-gold/90"
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button
              data-ocid="featured.secondary_button"
              onClick={() => onNavigate("/products")}
              variant="outline"
              className="border-gold bg-transparent px-8 text-gold hover:bg-gold hover:text-primary-foreground tracking-luxury uppercase"
            >
              View All Fragrances
            </Button>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="bg-card py-20">
        <div className="mx-auto max-w-screen-xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-2 text-xs tracking-[0.3em] uppercase text-gold">
              Explore
            </p>
            <h2 className="font-display text-3xl font-bold uppercase tracking-luxury text-foreground">
              Collections
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                title: "The Oud Collection",
                img: "/assets/generated/collection-oud.dim_800x600.jpg",
                sub: "Rich & Smoky",
              },
              {
                title: "The Floral Collection",
                img: "/assets/generated/collection-floral.dim_800x600.jpg",
                sub: "Light & Romantic",
              },
            ].map((col, i) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative cursor-pointer overflow-hidden rounded-lg"
                onClick={() => onNavigate("/products")}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={col.img}
                    alt={col.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-xs tracking-[0.25em] uppercase text-gold">
                    {col.sub}
                  </p>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                    {col.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section className="py-20">
        <div className="mx-auto max-w-screen-xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-2 text-xs tracking-[0.3em] uppercase text-gold">
              Perfect Gifts
            </p>
            <h2 className="font-display text-3xl font-bold uppercase tracking-luxury text-foreground">
              Exclusive Bundles
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: "The Royal Gift Set",
                sub: "3 Bestsellers + Gift Box",
                img: "/assets/generated/bundle-gift.dim_600x500.jpg",
              },
              {
                title: "His & Hers Duo",
                sub: "2 Signature Fragrances",
                img: "https://picsum.photos/seed/bundle2/600/500",
              },
              {
                title: "Discovery Collection",
                sub: "5 × 5ML Samples",
                img: "https://picsum.photos/seed/bundle3/600/500",
              },
            ].map((bundle, i) => (
              <motion.div
                key={bundle.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative cursor-pointer overflow-hidden rounded-lg border border-border"
                onClick={() => onNavigate("/products")}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={bundle.img}
                    alt={bundle.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="font-display text-base font-bold uppercase tracking-wide text-foreground">
                    {bundle.title}
                  </h3>
                  <p className="text-xs text-gold">{bundle.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-card py-20">
        <div className="mx-auto max-w-screen-xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-2 text-xs tracking-[0.3em] uppercase text-gold">
              Testimonials
            </p>
            <h2 className="font-display text-3xl font-bold uppercase tracking-luxury text-foreground">
              Customer Reviews
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {staticReviews.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg border border-border bg-background p-6"
              >
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={14}
                      className={
                        n <= review.rating
                          ? "fill-gold text-gold"
                          : "text-muted-foreground"
                      }
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground">
                  {review.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-20">
        <div className="mx-auto max-w-screen-xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-2 text-xs tracking-[0.3em] uppercase text-gold">
              Insights
            </p>
            <h2 className="font-display text-3xl font-bold uppercase tracking-luxury text-foreground">
              Latest from the Journal
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="mb-2 text-xs text-muted-foreground">
                    {post.date}
                  </p>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
