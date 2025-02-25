
import { Link } from "wouter";
import { Dish } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Info } from "lucide-react";

interface DishCardProps {
  dish: Dish;
}

// DishCard: Displays a individual dish with its details and actions
export default function DishCard({ dish }: DishCardProps) {
  const { addItem } = useCart();

  // Helper function to get spice level label
  const getSpiceLevelBadge = () => {
    const levels = ["Mild", "Medium", "Hot", "Very Hot", "Extra Hot"];
    return levels[dish.spiceLevel - 1] || "Unknown";
  };

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden">
      <div 
        className="h-48 w-full bg-cover bg-center rounded-t-lg"
        style={{ backgroundImage: `url(${dish.image})` }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold">{dish.name}</h3>
          <span className="text-lg font-semibold">{formatPrice(dish.price)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{dish.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Badge variant="secondary">{dish.category}</Badge>
            <Badge variant="secondary">{getSpiceLevelBadge()}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/dish/${dish.id}`}>
                <Info className="h-4 w-4" />
              </Link>
            </Button>
            <Button onClick={() => addItem(dish)}>Add to Cart</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
