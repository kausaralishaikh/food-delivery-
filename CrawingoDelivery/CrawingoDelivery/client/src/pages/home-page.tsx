import { useQuery } from "@tanstack/react-query";
import { Dish } from "@shared/schema";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import CartDrawer from "@/components/cart-drawer";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Footer from "@/components/footer";
import DishCard from "@/components/dish-card";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const { data: dishes } = useQuery<Dish[]>({ 
    queryKey: ["/api/dishes"]
  });
  const { user, logoutMutation } = useAuth();

  const filteredDishes = dishes?.filter(dish => {
    return dish.name.toLowerCase().includes(search.toLowerCase()) ||
           dish.description.toLowerCase().includes(search.toLowerCase()) ||
           dish.category.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Crawingo
          </h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name}</span>
            <ThemeToggle />
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search dishes, cuisines, or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes?.map((dish) => (
            <Link key={dish.id} href={`/dish/${dish.id}`}>
              <DishCard dish={dish} />
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}