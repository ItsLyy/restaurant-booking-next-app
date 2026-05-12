export function formatPrice(price: number): string {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  });
  return formatter.format(price);
}

export default formatPrice;
