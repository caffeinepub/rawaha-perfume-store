import { Button } from "@/components/ui/button";
import { CheckCircle, Package } from "lucide-react";
import { motion } from "motion/react";

interface OrderSuccessPageProps {
  onNavigate: (path: string) => void;
}

export default function OrderSuccessPage({
  onNavigate,
}: OrderSuccessPageProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex max-w-lg flex-col items-center text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold bg-gold/10">
          <CheckCircle size={40} className="text-gold" />
        </div>
        <h1 className="font-display text-4xl font-bold uppercase tracking-luxury text-foreground">
          Order Placed!
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Thank you for your order. We've received it and will contact you
          shortly to confirm delivery details.
        </p>
        <div className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-card px-6 py-4">
          <Package size={20} className="text-gold" />
          <p className="text-sm text-muted-foreground">
            Expected delivery:{" "}
            <span className="text-foreground">3–5 business days</span>
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            data-ocid="order_success.primary_button"
            onClick={() => onNavigate("/products")}
            className="bg-gold px-8 text-primary-foreground hover:bg-gold/90 tracking-luxury uppercase"
          >
            Continue Shopping
          </Button>
          <Button
            data-ocid="order_success.secondary_button"
            variant="outline"
            onClick={() => onNavigate("/")}
            className="border-border bg-transparent text-foreground hover:border-gold hover:text-gold tracking-luxury uppercase"
          >
            Go to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
