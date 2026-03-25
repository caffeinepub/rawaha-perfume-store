import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export type OrderId = bigint;
export type Time = bigint;
export interface Category {
    id: CategoryId;
    name: string;
    description: string;
    image?: ExternalBlob;
}
export type Size = bigint;
export interface OrderRecord {
    id: OrderId;
    customerName: string;
    status: OrderStatus;
    total: Price;
    city: string;
    createdAt: Time;
    address: string;
    phone: string;
    items: Array<OrderItem>;
}
export interface OrderItem {
    size: Size;
    productId: string;
    quantity: bigint;
    price: Price;
}
export type Price = bigint;
export interface SizeVariant {
    size: Size;
    price: Price;
}
export type CategoryId = string;
export type ReviewId = bigint;
export type ProductId = string;
export interface Review {
    id: ReviewId;
    customerName: string;
    createdAt: Time;
    productId: ProductId;
    comment: string;
    rating: bigint;
}
export interface Product {
    id: ProductId;
    featured: boolean;
    inStock: boolean;
    inspiredBy: string;
    name: string;
    createdAt: Time;
    tags: Array<string>;
    description: string;
    sizes: Array<SizeVariant>;
    gender: Gender;
    category: CategoryId;
    image?: ExternalBlob;
}
export enum Gender {
    female = "female",
    male = "male",
    unisex = "unisex"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addReview(productId: ProductId, customerName: string, rating: bigint, comment: string): Promise<ReviewId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCategory(name: string, description: string, image: ExternalBlob | null): Promise<CategoryId>;
    createProduct(name: string, description: string, category: CategoryId, sizes: Array<SizeVariant>, image: ExternalBlob | null, gender: Gender, tags: Array<string>, featured: boolean, inStock: boolean, inspiredBy: string): Promise<ProductId>;
    deleteCategory(id: CategoryId): Promise<void>;
    deleteProduct(id: ProductId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getCategory(id: CategoryId): Promise<Category>;
    getOrders(): Promise<Array<OrderRecord>>;
    getProduct(id: ProductId): Promise<Product>;
    getProductReviews(productId: ProductId): Promise<Array<Review>>;
    getProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(customerName: string, phone: string, address: string, city: string, items: Array<OrderItem>, total: Price): Promise<OrderId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCategory(id: CategoryId, name: string, description: string, image: ExternalBlob | null): Promise<void>;
    updateOrderStatus(orderId: OrderId, status: OrderStatus): Promise<void>;
    updateProduct(id: ProductId, name: string, description: string, category: CategoryId, sizes: Array<SizeVariant>, image: ExternalBlob | null, gender: Gender, tags: Array<string>, featured: boolean, inStock: boolean, inspiredBy: string): Promise<void>;
}
