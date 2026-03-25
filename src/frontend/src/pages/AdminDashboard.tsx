import { Package, ShoppingCart, Tag, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { OrderStatus } from "../backend";
import {
  useGetCategories,
  useGetOrders,
  useGetProducts,
} from "../hooks/useQueries";
import { formatPrice } from "../lib/formatters";

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { data: products } = useGetProducts();
  const { data: categories } = useGetCategories();
  const { data: orders } = useGetOrders();

  const totalRevenue = orders?.reduce((sum, o) => sum + o.total, 0n) ?? 0n;
  const pendingOrders =
    orders?.filter((o) => o.status === OrderStatus.pending).length ?? 0;

  const stats = [
    {
      label: "Total Products",
      value: products?.length ?? 0,
      icon: Package,
      path: "/admin/products",
    },
    {
      label: "Categories",
      value: categories?.length ?? 0,
      icon: Tag,
      path: "/admin/categories",
    },
    {
      label: "Total Orders",
      value: orders?.length ?? 0,
      icon: ShoppingCart,
      path: "/admin/orders",
    },
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      path: "/admin/orders",
    },
  ];

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold uppercase tracking-luxury text-foreground">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.button
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onNavigate(stat.path)}
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 text-left transition-colors hover:border-gold"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
              <stat.icon size={22} className="text-gold" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-luxury text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">
                {stat.value}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-sm uppercase tracking-luxury text-foreground">
            Recent Orders
          </h2>
          <button
            type="button"
            onClick={() => onNavigate("/admin/orders")}
            className="text-xs text-gold hover:underline"
          >
            View All
          </button>
        </div>
        <div className="p-6">
          {!orders || orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.slice(0, 5).map((order, i) => (
                <div
                  key={order.id.toString()}
                  data-ocid={`orders.item.${i + 1}`}
                  className="flex items-center justify-between rounded border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.city} • {order.items.length} items
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm text-gold">
                      {formatPrice(order.total)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs capitalize ${
                        order.status === OrderStatus.delivered
                          ? "bg-green-900/50 text-green-400"
                          : order.status === OrderStatus.cancelled
                            ? "bg-red-900/50 text-red-400"
                            : order.status === OrderStatus.shipped
                              ? "bg-blue-900/50 text-blue-400"
                              : "bg-yellow-900/50 text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {pendingOrders > 0 && (
        <div className="mt-4 rounded-lg border border-gold/30 bg-gold/5 px-5 py-4">
          <p className="text-sm text-gold">
            ⚠️ You have {pendingOrders} pending order
            {pendingOrders > 1 ? "s" : ""} awaiting processing.
          </p>
        </div>
      )}
    </div>
  );
}
