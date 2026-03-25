export function formatPrice(price: bigint): string {
  const rupees = Number(price) / 100;
  return `Rs.${rupees.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatSize(size: bigint): string {
  return `${size}ML`;
}

export function formatDate(timestamp: bigint): string {
  // ICP timestamps are in nanoseconds
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
