import { Restaurant } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <div 
        className="h-48 w-full bg-cover bg-center rounded-t-lg"
        style={{ backgroundImage: `url(${restaurant.image})` }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold">{restaurant.name}</h3>
          <Badge variant="outline">⭐ {restaurant.rating}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{restaurant.description}</p>
        <div className="flex gap-2">
          <Badge variant="secondary">{restaurant.cuisine}</Badge>
          <Badge variant="secondary">{restaurant.priceRange}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
