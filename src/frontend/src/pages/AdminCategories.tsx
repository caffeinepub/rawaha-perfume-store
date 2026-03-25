import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Category } from "../backend";
import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategories,
  useUpdateCategory,
} from "../hooks/useQueries";

interface AdminCategoriesProps {
  onNavigate: (path: string) => void;
}

export default function AdminCategories({
  onNavigate: _onNavigate,
}: AdminCategoriesProps) {
  const { data: categories, isLoading } = useGetCategories();
  const createCat = useCreateCategory();
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const openCreate = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateCat.mutateAsync({ id: editingId, ...form });
        toast.success("Category updated!");
      } else {
        await createCat.mutateAsync(form);
        toast.success("Category created!");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCat.mutateAsync(id);
      toast.success("Category deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold uppercase tracking-luxury text-foreground">
          Categories
        </h1>
        <Button
          data-ocid="categories.primary_button"
          onClick={openCreate}
          className="bg-gold text-primary-foreground hover:bg-gold/90 tracking-luxury uppercase"
        >
          <Plus size={16} className="mr-2" /> Add Category
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs uppercase tracking-luxury text-muted-foreground">
                Name
              </th>
              <th className="hidden px-4 py-3 text-left text-xs uppercase tracking-luxury text-muted-foreground md:table-cell">
                Description
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
                  colSpan={3}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && (!categories || categories.length === 0) && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No categories yet.
                </td>
              </tr>
            )}
            {categories?.map((cat, i) => (
              <tr
                key={cat.id}
                data-ocid={`categories.row.${i + 1}`}
                className="border-b border-border bg-background hover:bg-card"
              >
                <td className="px-4 py-4 font-medium text-foreground">
                  {cat.name}
                </td>
                <td className="hidden px-4 py-4 text-muted-foreground md:table-cell">
                  {cat.description}
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      data-ocid={`categories.edit_button.${i + 1}`}
                      onClick={() => openEdit(cat)}
                      className="rounded p-1.5 text-muted-foreground hover:text-gold"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      data-ocid={`categories.delete_button.${i + 1}`}
                      onClick={() => setDeleteConfirm(cat.id)}
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            data-ocid="categories.dialog"
            className="w-full max-w-md rounded-lg border border-border bg-card p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase tracking-luxury text-foreground">
                {editingId ? "Edit Category" : "Add Category"}
              </h2>
              <button
                type="button"
                data-ocid="categories.close_button"
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="cat-name"
                  className="mb-1.5 block text-xs uppercase tracking-luxury text-muted-foreground"
                >
                  Name
                </label>
                <input
                  id="cat-name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full rounded border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="cat-desc"
                  className="mb-1.5 block text-xs uppercase tracking-luxury text-muted-foreground"
                >
                  Description
                </label>
                <textarea
                  id="cat-desc"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                data-ocid="categories.cancel_button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-border bg-transparent"
              >
                Cancel
              </Button>
              <Button
                data-ocid="categories.save_button"
                onClick={handleSave}
                disabled={createCat.isPending || updateCat.isPending}
                className="bg-gold text-primary-foreground hover:bg-gold/90"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            data-ocid="categories.dialog"
            className="w-full max-w-sm rounded-lg border border-border bg-card p-6"
          >
            <h3 className="mb-3 font-display text-lg font-bold text-foreground">
              Delete Category?
            </h3>
            <p className="mb-6 text-sm text-muted-foreground">
              This will permanently delete this category.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                data-ocid="categories.cancel_button"
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                className="border-border bg-transparent"
              >
                Cancel
              </Button>
              <Button
                data-ocid="categories.confirm_button"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteCat.isPending}
                className="bg-destructive text-destructive-foreground"
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
