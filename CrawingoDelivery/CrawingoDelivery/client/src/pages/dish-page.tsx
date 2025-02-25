import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Dish, Restaurant, Review } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DishDetails extends Dish {
  restaurant: Restaurant;
  reviews: Review[];
}

export default function DishPage() {
  const [, params] = useRoute("/dish/:id");
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState<string>("5");
  const [comment, setComment] = useState("");

  const { data: dish } = useQuery<DishDetails>({
    queryKey: [`/api/dishes/${params?.id}`],
  });

  const reviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string }) => {
      await apiRequest("POST", `/api/dishes/${params?.id}/reviews`, reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`/api/dishes/${params?.id}`]);
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setComment("");
      setRating("5");
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!dish) {
    return <div>Loading...</div>;
  }

  const averageRating = dish.reviews.length
    ? dish.reviews.reduce((sum, review) => sum + review.rating, 0) / dish.reviews.length
    : 0;

  const handleSubmitReview = () => {
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    reviewMutation.mutate({
      rating: parseInt(rating),
      comment: comment.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{ 
          backgroundImage: `url(${dish.image || getFallbackImage(dish.category)})`,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-2">{dish.name}</h1>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{dish.category}</Badge>
              <Badge variant="secondary">Spice Level: {dish.spiceLevel}</Badge>
              <Badge variant="secondary">⭐ {averageRating.toFixed(1)}</Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">About the Dish</h2>
                <p className="text-muted-foreground mb-4">{dish.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">{formatPrice(dish.price)}</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-primary" />
                    <span>{dish.restaurant.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user && (
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                  <div className="space-y-4">
                    <div>
                      <Select
                        value={rating}
                        onValueChange={setRating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 4, 3, 2, 1].map((value) => (
                            <SelectItem key={value} value={value.toString()}>
                              {"⭐".repeat(value)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      placeholder="Share your experience..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button 
                      onClick={handleSubmitReview}
                      disabled={reviewMutation.isPending}
                    >
                      Submit Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Reviews</h3>
              <div className="space-y-4">
                {dish.reviews.length === 0 ? (
                  <p className="text-muted-foreground">No reviews yet.</p>
                ) : (
                  dish.reviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
