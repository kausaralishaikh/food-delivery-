import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Restaurant, Dish } from "@shared/schema";
import DishCard from "@/components/dish-card";
import CartDrawer from "@/components/cart-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function RestaurantPage() {
  const [, params] = useRoute("/restaurant/:id");
  const { user, logoutMutation } = useAuth();

  const { data: restaurant } = useQuery<Restaurant>({
    queryKey: [`/api/restaurants/${params?.id}`],
  });

  const { data: dishes } = useQuery<Dish[]>({
    queryKey: [`/api/restaurants/${params?.id}/dishes`],
  });

  if (!restaurant || !dishes) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent cursor-pointer">
              Crawingo
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name}</span>
            <Button 
              variant="outline" 
              onClick={() => logoutMutation.mutate()}
            >
              Logout
            </Button>
            <CartDrawer />
          </div>
        </div>
      </header>

      <div 
        className="h-64 bg-cover bg-center relative"
        style={{ 
          backgroundImage: `url(${restaurant.image})`,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{restaurant.cuisine}</Badge>
              <Badge variant="secondary">{restaurant.priceRange}</Badge>
              <Badge variant="secondary">⭐ {restaurant.rating}</Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </main>
    </div>
  );
}
