export type CartLine = {
  productId: string;
  quantity: number;
};

const CART_KEY = "ssaroma-demo-cart";
export const CART_EVENT = "ssaroma:cart-updated";

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (line): line is CartLine =>
        typeof line === "object" &&
        line !== null &&
        "productId" in line &&
        typeof line.productId === "string" &&
        "quantity" in line &&
        typeof line.quantity === "number" &&
        line.quantity > 0,
    );
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  window.dispatchEvent(new CustomEvent<CartLine[]>(CART_EVENT, { detail: lines }));
}

export function addToCart(productId: string, quantity = 1) {
  const current = readCart();
  const existing = current.find((line) => line.productId === productId);
  const next = existing
    ? current.map((line) =>
        line.productId === productId
          ? { ...line, quantity: Math.min(9, line.quantity + quantity) }
          : line,
      )
    : [...current, { productId, quantity: Math.min(9, Math.max(1, quantity)) }];

  writeCart(next);
  return next;
}

export function updateCartLine(productId: string, quantity: number) {
  const next = readCart()
    .map((line) => (line.productId === productId ? { ...line, quantity } : line))
    .filter((line) => line.quantity > 0);
  writeCart(next);
  return next;
}

export function clearCart() {
  writeCart([]);
}
