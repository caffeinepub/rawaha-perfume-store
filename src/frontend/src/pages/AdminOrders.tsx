import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../backend";
import type { OrderRecord } from "../backend";
import { useGetOrders, useUpdateOrderStatus } from "../hooks/useQueries";
import { formatDate, formatPrice } from "../lib/formatters";

interface AdminOrdersProps {
  onNavigate: (path: string) => void;
}

const statusColors: Record<string, string> = {
  [OrderStatus.pending]: "bg-yellow-900/50 text-yellow-400",
  [OrderStatus.processing]: "bg-blue-900/50 text-blue-400",
  [OrderStatus.shipped]: "bg-purple-900/50 text-purple-400",
  [OrderStatus.delivered]: "bg-green-900/50 text-green-400",
  [OrderStatus.cancelled]: "bg-red-900/50 text-red-400",
};

export default function AdminOrders({
  onNavigate: _onNavigate,
}: AdminOrdersProps) {
  const { data: orders, isLoading } = useGetOrders();
  const updateStatus = useUpdateOrderStatus();
  const [expandedOrder, setExpandedOrder] = useState<bigint | null>(null);

  const handleStatusChange = async (
    order: OrderRecord,
    status: OrderStatus,
  ) => {
    try {
      await updateStatus.mutateAsync({ orderId: order.id, status });
      toast.success("Order status updated!");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold uppercase tracking-luxury text-foreground">
        Orders
      </h1>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs uppercase tracking-luxury text-muted-foreground">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-luxury text-muted-foreground">
                Customer
              </th>
              <th className="hidden px-4 py-3 text-left text-xs uppercase tracking-luxury text-muted-foreground md:table-cell">
                City
              </th>
              <th className="hidden px-4 py-3 text-left text-xs uppercase tracking-luxury text-muted-foreground md:table-cell">
                Total
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
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && (!orders || orders.length === 0) && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No orders yet.
                </td>
              </tr>
            )}
            {orders?.map((order, i) => (
              <>
                <tr
                  key={order.id.toString()}
                  data-ocid={`orders.row.${i + 1}`}
                  className="cursor-pointer border-b border-border bg-background hover:bg-card"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setExpandedOrder(
                        expandedOrder === order.id ? null : order.id,
                      );
                  }}
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id,
                    )
                  }
                >
                  <td className="px-4 py-4 text-muted-foreground">
                    #{order.id.toString()}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-foreground">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.phone}
                    </p>
                  </td>
                  <td className="hidden px-4 py-4 text-muted-foreground md:table-cell">
                    {order.city}
                  </td>
                  <td className="hidden px-4 py-4 md:table-cell">
                    <span className="font-display text-gold">
                      {formatPrice(order.total)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[order.status] ?? ""}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-4"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-end">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order,
                            e.target.value as OrderStatus,
                          )
                        }
                        className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-gold focus:outline-none"
                      >
                        {Object.values(OrderStatus).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
                {expandedOrder === order.id && (
                  <tr
                    key={`${order.id.toString()}-detail`}
                    className="border-b border-border bg-card"
                  >
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="mb-2 text-xs uppercase tracking-luxury text-muted-foreground">
                            Delivery
                          </p>
                          <p className="text-sm text-foreground">
                            {order.address}
                          </p>
                          <p className="text-sm text-foreground">
                            {order.city}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="mb-2 text-xs uppercase tracking-luxury text-muted-foreground">
                            Items
                          </p>
                          {order.items.map((item) => (
                            <p
                              key={`${item.productId}-${item.size}`}
                              className="text-sm text-foreground"
                            >
                              {item.productId} — {item.size}ML ×{" "}
                              {item.quantity.toString()} @{" "}
                              {formatPrice(item.price)}
                            </p>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
