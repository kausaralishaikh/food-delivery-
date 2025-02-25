import { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/hooks/use-cart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderProgress, setOrderProgress] = useState(0);
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    toast({
      title: "Payment Successful!",
      description: `Your order of ${formatPrice(total)} has been placed successfully.`,
    });
    setOrderPlaced(true);
    simulateOrderProgress();
  };

  const simulateOrderProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setOrderProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        toast({
          title: "Order Delivered!",
          description: "Thank you for ordering with Crawingo!",
        });
        setTimeout(() => {
          setOrderPlaced(false);
          setOrderProgress(0);
          clearCart();
          setOpen(false);
        }, 2000);
      }
    }, 2000);
  };

  const getOrderStatus = () => {
    if (orderProgress < 20) return "Order Confirmed";
    if (orderProgress < 40) return "Preparing Your Food";
    if (orderProgress < 60) return "Food Ready for Pickup";
    if (orderProgress < 80) return "Out for Delivery";
    return "Delivered";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {orderPlaced ? (
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <Truck className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{getOrderStatus()}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Estimated delivery time: 30-45 minutes
              </p>
            </div>
            <Progress value={orderProgress} className="w-full" />
            <div className="grid grid-cols-5 gap-2 text-sm">
              <div className="text-center">
                <div className={`h-2 w-2 rounded-full mx-auto mb-2 ${orderProgress >= 20 ? 'bg-primary' : 'bg-muted'}`} />
                <span>Confirmed</span>
              </div>
              <div className="text-center">
                <div className={`h-2 w-2 rounded-full mx-auto mb-2 ${orderProgress >= 40 ? 'bg-primary' : 'bg-muted'}`} />
                <span>Preparing</span>
              </div>
              <div className="text-center">
                <div className={`h-2 w-2 rounded-full mx-auto mb-2 ${orderProgress >= 60 ? 'bg-primary' : 'bg-muted'}`} />
                <span>Ready</span>
              </div>
              <div className="text-center">
                <div className={`h-2 w-2 rounded-full mx-auto mb-2 ${orderProgress >= 80 ? 'bg-primary' : 'bg-muted'}`} />
                <span>On Way</span>
              </div>
              <div className="text-center">
                <div className={`h-2 w-2 rounded-full mx-auto mb-2 ${orderProgress >= 100 ? 'bg-primary' : 'bg-muted'}`} />
                <span>Delivered</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Your cart is empty
                </p>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>

                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="gpay">Google Pay</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  className="w-full" 
                  disabled={items.length === 0 || !paymentMethod}
                  onClick={handleCheckout}
                >
                  {paymentMethod === 'cod' ? 'Place Order' : 'Pay & Place Order'}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}