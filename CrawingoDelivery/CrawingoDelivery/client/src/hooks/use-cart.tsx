import { createContext, ReactNode, useContext, useState } from "react";
import { Dish } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface CartItem extends Dish {
  quantity: number;
}

type CartContextType = {
  items: CartItem[];
  addItem: (dish: Dish) => void;
  removeItem: (dishId: number) => void;
  updateQuantity: (dishId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addItem = (dish: Dish) => {
    setItems((current) => {
      const existingItem = current.find((item) => item.id === dish.id);
      if (existingItem) {
        return current.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...dish, quantity: 1 }];
    });

    toast({
      title: "Added to cart",
      description: `${dish.name} has been added to your cart`,
    });
  };

  const removeItem = (dishId: number) => {
    setItems((current) => current.filter((item) => item.id !== dishId));
  };

  const updateQuantity = (dishId: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(dishId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.id === dishId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
