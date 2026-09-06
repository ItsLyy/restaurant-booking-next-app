const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 2,
});

export function formatPrice(price: number): string {
  return formatter.format(price);
}
