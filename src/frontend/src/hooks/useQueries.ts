import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Category,
  Gender,
  OrderRecord,
  OrderStatus,
  Product,
  Review,
  SizeVariant,
} from "../backend";
import { useActor } from "./useActor";

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<OrderRecord[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductReviews(productId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductReviews(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      customerName: string;
      phone: string;
      address: string;
      city: string;
      items: Array<{
        productId: string;
        size: bigint;
        quantity: bigint;
        price: bigint;
      }>;
      total: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.placeOrder(
        params.customerName,
        params.phone,
        params.address,
        params.city,
        params.items,
        params.total,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      description: string;
      category: string;
      sizes: SizeVariant[];
      image: null;
      gender: Gender;
      tags: string[];
      featured: boolean;
      inStock: boolean;
      inspiredBy: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createProduct(
        params.name,
        params.description,
        params.category,
        params.sizes,
        params.image,
        params.gender,
        params.tags,
        params.featured,
        params.inStock,
        params.inspiredBy,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      name: string;
      description: string;
      category: string;
      sizes: SizeVariant[];
      image: null;
      gender: Gender;
      tags: string[];
      featured: boolean;
      inStock: boolean;
      inspiredBy: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProduct(
        params.id,
        params.name,
        params.description,
        params.category,
        params.sizes,
        params.image,
        params.gender,
        params.tags,
        params.featured,
        params.inStock,
        params.inspiredBy,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useCreateCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { name: string; description: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createCategory(params.name, params.description, null);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      name: string;
      description: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateCategory(
        params.id,
        params.name,
        params.description,
        null,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteCategory(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { orderId: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateOrderStatus(params.orderId, params.status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      productId: string;
      customerName: string;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addReview(
        params.productId,
        params.customerName,
        params.rating,
        params.comment,
      );
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ["reviews", vars.productId] }),
  });
}
