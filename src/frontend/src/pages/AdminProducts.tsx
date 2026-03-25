import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Gender } from "../backend";
import type { Product } from "../backend";
import {
  useCreateProduct,
  useDeleteProduct,
  useGetProducts,
  useUpdateProduct,
} from "../hooks/useQueries";
import { formatPrice, formatSize } from "../lib/formatters";

interface AdminProductsProps {
  onNavigate: (path: string) => void;
}

type ProductForm = {
  name: string;
  description: string;
  category: string;
  gender: Gender;
  inspiredBy: string;
  tags: string;
  featured: boolean;
  inStock: boolean;
  sizes: string; // JSON: [{size: 10, price: 100000}]
};

const defaultForm: ProductForm = {
  name: "",
  description: "",
  category: "",
  gender: Gender.unisex,
  inspiredBy: "",
  tags: "",
  featured: false,
  inStock: true,
  sizes: '[{"size":10,"price":100000}]',
};

export default function AdminProducts({
  onNavigate: _onNavigate,
}: AdminProductsProps) {
  const { data: products, isLoading } = useGetProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openCreate = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      gender: product.gender,
      inspiredBy: product.inspiredBy,
      tags: product.tags.join(", "),
      featured: product.featured,
      inStock: product.inStock,
      sizes: JSON.stringify(
        product.sizes.map((s) => ({
          size: Number(s.size),
          price: Number(s.price),
        })),
      ),
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const sizesArr = JSON.parse(form.sizes).map(
        (s: { size: number; price: number }) => ({
          size: BigInt(s.size),
          price: BigInt(s.price),
        }),
      );
      const params = {
        name: form.name,
        description: form.description,
        category: form.category,
        sizes: sizesArr,
        image: null,
        gender: form.gender,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        featured: form.featured,
        inStock: form.inStock,
        inspiredBy: form.inspiredBy,
      };
      if (editingId) {
        await updateProduct.mutateAsync({ id: editingId, ...params });
        toast.success("Product updated!");
      } else {
        await createProduct.mutateAsync(params);
        toast.success("Product created!");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold uppercase tracking-luxury text-foreground">
          Products
        </h1>
        <Button
          data-ocid="products.primary_button"
          onClick={openCreate}
          className="bg-gold text-primary-foreground hover:bg-gold/90 tracking-luxury uppercase"
        >
          <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs uppercase tracking-luxury text-muted-foreground">
                Product
              </th>
              <th className="hidden px-4 py-3 text-left text-xs uppercase tracking-luxury text-muted-foreground md:table-cell">
                Category
              </th>
              <th className="hidden px-4 py-3 text-left text-xs uppercase tracking-luxury text-muted-foreground md:table-cell">
                Sizes / Prices
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-luxury text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-luxury text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && (!products || products.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No products yet.
                </td>
              </tr>
            )}
            {products?.map((product, i) => (
              <tr
                key={product.id}
                data-ocid={`products.row.${i + 1}`}
                className="border-b border-border bg-background hover:bg-card"
              >
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {product.gender}
                    </p>
                  </div>
                </td>
                <td className="hidden px-4 py-4 text-muted-foreground md:table-cell">
                  {product.category}
                </td>
                <td className="hidden px-4 py-4 md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.map((s) => (
                      <span
                        key={s.size.toString()}
                        className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {formatSize(s.size)} / {formatPrice(s.price)}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      product.inStock
                        ? "bg-green-900/50 text-green-400"
                        : "bg-red-900/50 text-red-400"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      data-ocid={`products.edit_button.${i + 1}`}
                      onClick={() => openEdit(product)}
                      className="rounded p-1.5 text-muted-foreground hover:text-gold"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      data-ocid={`products.delete_button.${i + 1}`}
                      onClick={() => setDeleteConfirm(product.id)}
                      className="rounded p-1.5 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            data-ocid="products.dialog"
            className="w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-6 max-h-[90vh]"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase tracking-luxury text-foreground">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button
                type="button"
                data-ocid="products.close_button"
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {(
                [
                  ["name", "Product Name", "text"],
                  ["inspiredBy", "Inspired By", "text"],
                  ["category", "Category ID", "text"],
                  ["tags", "Tags (comma-separated)", "text"],
                ] as [keyof ProductForm, string, string][]
              ).map(([key, label, type]) => (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="mb-1.5 block text-xs uppercase tracking-luxury text-muted-foreground"
                  >
                    {label}
                  </label>
                  <input
                    id={key}
                    type={type}
                    value={form[key] as string}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label
                  htmlFor="desc"
                  className="mb-1.5 block text-xs uppercase tracking-luxury text-muted-foreground"
                >
                  Description
                </label>
                <textarea
                  id="desc"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none resize-none"
                />
              </div>
              <div>
                <label
                  htmlFor="gender-select"
                  className="mb-1.5 block text-xs uppercase tracking-luxury text-muted-foreground"
                >
                  Gender
                </label>
                <select
                  id="gender-select"
                  value={form.gender}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, gender: e.target.value as Gender }))
                  }
                  className="w-full rounded border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                >
                  <option value={Gender.unisex}>Unisex</option>
                  <option value={Gender.male}>Male</option>
                  <option value={Gender.female}>Female</option>
                </select>
              </div>
              <div className="flex items-center gap-6 pt-5">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, featured: e.target.checked }))
                    }
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, inStock: e.target.checked }))
                    }
                  />
                  In Stock
                </label>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="sizes-json"
                  className="mb-1.5 block text-xs uppercase tracking-luxury text-muted-foreground"
                >
                  Sizes JSON (e.g. [{`{"size":10,"price":100000}`}])
                </label>
                <input
                  id="sizes-json"
                  type="text"
                  value={form.sizes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, sizes: e.target.value }))
                  }
                  className="w-full rounded border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none font-mono"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Price in paise (100 = Rs.1). e.g. 460000 = Rs.4,600
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                data-ocid="products.cancel_button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-border bg-transparent text-foreground hover:border-gold hover:text-gold"
              >
                Cancel
              </Button>
              <Button
                data-ocid="products.save_button"
                onClick={handleSave}
                disabled={createProduct.isPending || updateProduct.isPending}
                className="bg-gold text-primary-foreground hover:bg-gold/90 tracking-luxury uppercase"
              >
                {createProduct.isPending || updateProduct.isPending
                  ? "Saving..."
                  : "Save Product"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            data-ocid="products.dialog"
            className="w-full max-w-sm rounded-lg border border-border bg-card p-6"
          >
            <h3 className="mb-3 font-display text-lg font-bold text-foreground">
              Delete Product?
            </h3>
            <p className="mb-6 text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                data-ocid="products.cancel_button"
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                className="border-border bg-transparent"
              >
                Cancel
              </Button>
              <Button
                data-ocid="products.confirm_button"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteProduct.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
