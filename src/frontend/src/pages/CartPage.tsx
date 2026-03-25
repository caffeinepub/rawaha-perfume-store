import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { formatPrice, formatSize } from "../lib/formatters";
import { useCartStore } from "../store/cartStore";

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6">
        <ShoppingBag size={64} className="text-muted-foreground" />
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold uppercase tracking-luxury text-foreground">
            Your Cart is Empty
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover our luxury fragrances and add them to your cart.
          </p>
        </div>
        <Button
          data-ocid="cart.primary_button"
          onClick={() => onNavigate("/products")}
          className="bg-gold px-8 text-primary-foreground hover:bg-gold/90 tracking-luxury uppercase"
        >
          Browse Fragrances
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-screen-xl px-6">
        <button
          type="button"
          onClick={() => onNavigate("/products")}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </button>

        <h1 className="mb-10 font-display text-4xl font-bold uppercase tracking-luxury text-foreground">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-4">
              {items.map((item, idx) => (
                <motion.div
                  key={`${item.productId}-${item.size}`}
                  data-ocid={`cart.item.${idx + 1}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-5 rounded-lg border border-border bg-card p-5"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="h-28 w-20 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-20 items-center justify-center rounded bg-muted">
                      <ShoppingBag
                        size={24}
                        className="text-muted-foreground"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-display text-base font-semibold uppercase tracking-wide text-foreground">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatSize(item.size)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm hover:border-gold hover:text-gold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm hover:border-gold hover:text-gold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-display text-base text-gold">
                        {formatPrice(item.price * BigInt(item.quantity))}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    data-ocid={`cart.delete_button.${idx + 1}`}
                    onClick={() => removeItem(item.productId, item.size)}
                    className="self-start text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-6 font-display text-xl font-bold uppercase tracking-luxury text-foreground">
                Order Summary
              </h2>
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="text-foreground">
                      {formatPrice(item.price * BigInt(item.quantity))}
                    </span>
                  </div>
                ))}
                <div className="my-2 border-t border-border" />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Shipping
                  </span>
                  <span className="text-sm text-foreground">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium uppercase tracking-luxury text-foreground">
                    Total
                  </span>
                  <span className="font-display text-xl text-gold">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
              </div>
              <Button
                data-ocid="cart.primary_button"
                onClick={() => onNavigate("/checkout")}
                className="mt-6 w-full bg-gold text-primary-foreground hover:bg-gold/90 tracking-luxury uppercase"
              >
                Proceed to Checkout
              </Button>
              <button
                type="button"
                data-ocid="cart.delete_button"
                onClick={clearCart}
                className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-destructive"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
