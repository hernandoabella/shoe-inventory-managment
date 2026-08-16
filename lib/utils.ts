export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(
  amount: number,
  currency: string = "COP",
  locale: string = "es-CO"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    // COP se muestra sin decimales (ej. $ 249.900)
    ...(currency === "COP" ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : {}),
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function generateSku(prefix: string = "SKU") {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function timeAgo(date: string | Date) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  if (seconds < 60) return "Ahora mismo";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days} d`;
  return new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

export function calculateVariance(
  physicalCount: number,
  systemCount: number
): number {
  return physicalCount - systemCount;
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    in_transit: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    draft: "bg-gray-100 text-gray-800",
    received: "bg-green-100 text-green-800",
    ordered: "bg-blue-100 text-blue-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}