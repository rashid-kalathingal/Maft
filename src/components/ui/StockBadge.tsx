export function StockBadge({ inStock, low }: { inStock: boolean; low?: boolean }) {
  if (!inStock) {
    return <span className="badge bg-danger/10 text-danger">Out of stock</span>;
  }
  if (low) {
    return <span className="badge bg-amber-100 text-amber-700">Low stock</span>;
  }
  return <span className="badge bg-success/10 text-success">In stock</span>;
}
