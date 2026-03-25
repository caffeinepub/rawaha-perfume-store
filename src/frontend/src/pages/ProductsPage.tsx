import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Gender } from "../backend";
import ProductCard from "../components/ProductCard";
import { useGetCategories, useGetProducts } from "../hooks/useQueries";

interface ProductsPageProps {
  onNavigate: (path: string) => void;
}

export default function ProductsPage({ onNavigate }: ProductsPageProps) {
  const { data: products, isLoading } = useGetProducts();
  const { data: categories } = useGetCategories();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.inspiredBy.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !selectedCategory || p.category === selectedCategory;
      const matchesGender = !selectedGender || p.gender === selectedGender;
      return matchesSearch && matchesCategory && matchesGender;
    });
  }, [products, search, selectedCategory, selectedGender]);

  const genderOptions = [
    { value: "", label: "All" },
    { value: Gender.male, label: "Men" },
    { value: Gender.female, label: "Women" },
    { value: Gender.unisex, label: "Unisex" },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-screen-xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-xs tracking-[0.3em] uppercase text-gold">
            All Fragrances
          </p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-luxury text-foreground">
            Our Perfumes
          </h1>
        </motion.div>

        {/* Filters */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              data-ocid="products.search_input"
              type="text"
              placeholder="Search fragrances..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Category filter */}
            <select
              data-ocid="products.select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Gender filter */}
            <div className="flex gap-1" data-ocid="products.tab">
              {genderOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setSelectedGender(opt.value)}
                  className={`rounded px-3 py-2 text-xs uppercase tracking-luxury transition-colors ${
                    selectedGender === opt.value
                      ? "bg-gold text-primary-foreground"
                      : "border border-border text-muted-foreground hover:border-gold hover:text-gold"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <Skeleton className="mb-4 aspect-[3/4] w-full rounded" />
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="products.empty_state"
            className="flex flex-col items-center justify-center gap-4 py-24 text-center"
          >
            <SlidersHorizontal size={48} className="text-muted-foreground" />
            <p className="text-muted-foreground">
              {products?.length === 0
                ? "No products available yet."
                : "No fragrances match your filters."}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
                setSelectedGender("");
              }}
              className="text-sm text-gold underline hover:text-gold/80"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} onNavigate={onNavigate} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
