import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { formatPrice, formatSize } from "../lib/formatters";
import { useCartStore } from "../store/cartStore";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function CartDrawer({
  open,
  onClose,
  onNavigate,
}: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  const handleCheckout = () => {
    onClose();
    onNavigate("/checkout");
  };

  const handleViewCart = () => {
    onClose();
    onNavigate("/cart");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            data-ocid="cart.sheet"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-lg tracking-luxury uppercase text-foreground">
                Your Cart
              </h2>
              <button
                type="button"
                data-ocid="cart.close_button"
                onClick={onClose}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div
                  data-ocid="cart.empty_state"
                  className="flex flex-col items-center justify-center gap-4 py-16 text-center"
                >
                  <ShoppingBag size={48} className="text-muted-foreground" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate("/products");
                    }}
                    className="border border-gold bg-transparent text-gold hover:bg-gold hover:text-primary-foreground"
                  >
                    Browse Fragrances
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      data-ocid={`cart.item.${idx + 1}`}
                      className="flex gap-4 border-b border-border pb-4"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="h-20 w-16 rounded object-cover"
                        />
                      )}
                      {!item.image && (
                        <div className="flex h-20 w-16 items-center justify-center rounded bg-muted">
                          <ShoppingBag
                            size={20}
                            className="text-muted-foreground"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="text-sm font-medium uppercase tracking-wide text-foreground">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatSize(item.size)}
                        </p>
                        <p className="text-sm text-gold">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            className="flex h-6 w-6 items-center justify-center rounded border border-border text-xs hover:border-gold hover:text-gold"
                          >
                            -
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            className="flex h-6 w-6 items-center justify-center rounded border border-border text-xs hover:border-gold hover:text-gold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        data-ocid={`cart.delete_button.${idx + 1}`}
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground uppercase tracking-luxury">
                    Total
                  </span>
                  <span className="font-display text-lg text-gold">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    data-ocid="cart.primary_button"
                    onClick={handleCheckout}
                    className="w-full bg-gold text-primary-foreground hover:bg-gold/90 tracking-luxury uppercase"
                  >
                    Checkout
                  </Button>
                  <Button
                    type="button"
                    data-ocid="cart.secondary_button"
                    variant="outline"
                    onClick={handleViewCart}
                    className="w-full border-border bg-transparent text-foreground hover:border-gold hover:text-gold tracking-luxury uppercase"
                  >
                    View Cart
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
