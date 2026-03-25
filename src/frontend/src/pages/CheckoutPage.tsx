import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePlaceOrder } from "../hooks/useQueries";
import { formatPrice } from "../lib/formatters";
import { useCartStore } from "../store/cartStore";

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, totalPrice, clearCart } = useCartStore();
  const placeOrder = usePlaceOrder();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    try {
      await placeOrder.mutateAsync({
        customerName: form.customerName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          quantity: BigInt(i.quantity),
          price: i.price,
        })),
        total: totalPrice(),
      });
      clearCart();
      onNavigate("/order-success");
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const fields = [
    {
      key: "customerName",
      label: "Full Name",
      placeholder: "Ahmed Khan",
      type: "text",
    },
    {
      key: "phone",
      label: "Phone Number",
      placeholder: "+92 300 1234567",
      type: "tel",
    },
    {
      key: "address",
      label: "Delivery Address",
      placeholder: "House #12, Street 5, Block A",
      type: "text",
    },
    { key: "city", label: "City", placeholder: "Karachi", type: "text" },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-screen-lg px-6">
        <button
          type="button"
          onClick={() => onNavigate("/cart")}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft size={16} /> Back to Cart
        </button>

        <h1 className="mb-10 font-display text-4xl font-bold uppercase tracking-luxury text-foreground">
          Checkout
        </h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="mb-6 text-sm uppercase tracking-luxury text-foreground">
              Delivery Information
            </h2>
            <div className="flex flex-col gap-5">
              {fields.map((field) => (
                <div key={field.key}>
                  <label
                    htmlFor={`checkout-${field.key}`}
                    className="mb-1.5 block text-xs uppercase tracking-luxury text-muted-foreground"
                  >
                    {field.label}
                  </label>
                  <input
                    id={`checkout-${field.key}`}
                    data-ocid="checkout.input"
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }));
                      if (errors[field.key])
                        setErrors((prev) => ({ ...prev, [field.key]: "" }));
                    }}
                    className={`w-full rounded border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${
                      errors[field.key]
                        ? "border-destructive bg-destructive/5 focus:border-destructive"
                        : "border-border bg-background focus:border-gold"
                    }`}
                  />
                  {errors[field.key] && (
                    <p
                      data-ocid="checkout.error_state"
                      className="mt-1 text-xs text-destructive"
                    >
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              ))}
              <Button
                data-ocid="checkout.submit_button"
                onClick={handleSubmit}
                disabled={placeOrder.isPending}
                className="mt-2 w-full bg-gold py-6 text-sm font-semibold uppercase tracking-luxury text-primary-foreground hover:bg-gold/90 disabled:opacity-60"
              >
                {placeOrder.isPending ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-5 text-sm uppercase tracking-luxury text-foreground">
                Your Order
              </h2>
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {item.productName} ({item.size}ML) × {item.quantity}
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
            </div>
            <div className="mt-4 rounded-lg border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <CheckCircle size={18} className="mt-0.5 shrink-0 text-gold" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Your order will be processed within 24 hours. We'll contact
                  you at your provided phone number to confirm delivery details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
