import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, X, IndianRupee } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartDrawer = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Navigate to book-test with all cart items
    const testNames = items.map((item) => item.name).join(", ");
    const totalPrice = `₹${getTotalPrice()}`;
    
    navigate("/book-test", {
      state: {
        testName: testNames,
        price: totalPrice,
        cartItems: items,
      },
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative border-primary/30 hover:bg-primary/10"
        >
          <ShoppingCart className="h-5 w-5" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({getTotalItems()})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Add tests to get started
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.parameters} parameters
                      </p>
                      <p className="text-sm font-semibold text-primary mt-1">
                        {item.price}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromCart(item.name)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {getTotalPrice().toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90"
                    onClick={handleCheckout}
                  >
                    Proceed to Book
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
