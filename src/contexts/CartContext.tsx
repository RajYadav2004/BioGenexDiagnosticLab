import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Test } from "@/data/testCatalog";
import { toast } from "sonner";

const CART_STORAGE_KEY = "labtest_cart";

interface CartItem extends Test {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (test: Test) => void;
  removeFromCart: (testName: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (test: Test) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.name === test.name);
      if (existing) {
        toast.info(`${test.name} is already in your cart`);
        return prev;
      }
      toast.success(`${test.name} added to cart`);
      return [...prev, { ...test, quantity: 1 }];
    });
  };

  const removeFromCart = (testName: string) => {
    setItems((prev) => prev.filter((item) => item.name !== testName));
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared");
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ""));
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => items.length;

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, getTotalPrice, getTotalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
