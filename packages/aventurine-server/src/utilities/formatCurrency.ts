export function formatCurrency(
  value: number,
  currencyCode: "USD" | "IDR" | "JPY",
): string {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: currencyCode === "JPY" ? 0 : 2, // Yen usually has no decimal
  });

  return formatter.format(value);
}
