import { IStorage } from "./types";
import { User, Restaurant, Dish, Order, Review, InsertUser, InsertRestaurant, InsertDish, InsertOrder, InsertReview } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private restaurants: Map<number, Restaurant>;
  private dishes: Map<number, Dish>;
  private orders: Map<number, Order>;
  private reviews: Map<number, Review>;
  sessionStore: session.Store;
  currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.restaurants = new Map();
    this.dishes = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    this.currentId = { users: 1, restaurants: 1, dishes: 1, orders: 1, reviews: 1 };
    this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });
    this.seedData();
  }

  async getRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async getDishes(restaurantId: number): Promise<Dish[]> {
    return Array.from(this.dishes.values()).filter(
      (dish) => dish.restaurantId === restaurantId,
    );
  }

  async getDish(id: number): Promise<Dish | undefined> {
    return this.dishes.get(id);
  }

  async getReviews(dishId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.dishId === dishId,
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentId.reviews++;
    const newReview = { ...review, id };
    this.reviews.set(id, newReview);
    return newReview;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentId.orders++;
    const newOrder = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }

  private seedData() {
    // Seed restaurants
    const restaurants: InsertRestaurant[] = [
      {
        name: "Spice Garden",
        description: "Authentic North Indian cuisine with a royal touch",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        rating: 4.5,
        cuisine: "North Indian",
        priceRange: "₹₹",
        location: "Mumbai, Maharashtra",
      },
      {
        name: "South Flavors",
        description: "Traditional South Indian delicacies",
        image: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2",
        rating: 4.3,
        cuisine: "South Indian",
        priceRange: "₹₹",
        location: "Bangalore, Karnataka",
      },
      {
        name: "Street Food Hub",
        description: "Famous Indian street food and chaats",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        rating: 4.2,
        cuisine: "Street Food",
        priceRange: "₹",
        location: "Delhi, NCR",
      }
    ];

    restaurants.forEach((restaurant) => {
      const id = this.currentId.restaurants++;
      this.restaurants.set(id, { ...restaurant, id });
    });

    // Seed dishes
    const dishes: InsertDish[] = [
      // Vegetarian
      {
        restaurantId: 1,
        name: "Paneer Butter Masala",
        description: "Rich and creamy paneer curry with tomato gravy",
        price: 349,
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
        category: "Vegetarian",
        spiceLevel: 2,
      },
      {
        restaurantId: 1,
        name: "Palak Paneer",
        description: "Cottage cheese cubes in spinach gravy",
        price: 329,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        category: "Vegetarian",
        spiceLevel: 1,
      },
      {
        restaurantId: 2,
        name: "Veg Biryani",
        description: "Aromatic rice dish with mixed vegetables",
        price: 299,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
        category: "Vegetarian",
        spiceLevel: 2,
      },
      // Non-Vegetarian
      {
        restaurantId: 1,
        name: "Butter Chicken",
        description: "Classic creamy chicken curry",
        price: 399,
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
        category: "Non-Vegetarian",
        spiceLevel: 2,
      },
      {
        restaurantId: 2,
        name: "Chicken Biryani",
        description: "Fragrant rice with tender chicken pieces",
        price: 449,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
        category: "Non-Vegetarian",
        spiceLevel: 3,
      },
      {
        restaurantId: 1,
        name: "Mutton Rogan Josh",
        description: "Kashmiri style spicy mutton curry",
        price: 499,
        image: "https://images.unsplash.com/photo-1545247181-516f71cf4b25",
        category: "Non-Vegetarian",
        spiceLevel: 4,
      },
      // Chinese
      {
        restaurantId: 2,
        name: "Schezwan Noodles",
        description: "Spicy noodles with vegetables",
        price: 249,
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246",
        category: "Chinese",
        spiceLevel: 3,
      },
      {
        restaurantId: 2,
        name: "Kung Pao Chicken",
        description: "Diced chicken with peanuts and vegetables",
        price: 349,
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
        category: "Chinese",
        spiceLevel: 3,
      },
      // Street Food
      {
        restaurantId: 1,
        name: "Pani Puri",
        description: "Crispy puris with spicy tangy water",
        price: 129,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        category: "Street Food",
        spiceLevel: 2,
      },
      {
        restaurantId: 2,
        name: "Samosa",
        description: "Crispy pastry with spiced potato filling",
        price: 99,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        category: "Street Food",
        spiceLevel: 2,
      },
      // Desserts
      {
        restaurantId: 1,
        name: "Gulab Jamun",
        description: "Deep-fried milk solids in sugar syrup",
        price: 199,
        image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848",
        category: "Desserts",
        spiceLevel: 0,
      },
      {
        restaurantId: 2,
        name: "Rasmalai",
        description: "Soft cottage cheese dumplings in milk",
        price: 249,
        image: "https://images.unsplash.com/photo-1582716401301-b2407dc7563d",
        category: "Desserts",
        spiceLevel: 0,
      },
      {
        restaurantId: 1,
        name: "Dal Makhani",
        description: "Creamy black lentils simmered overnight with butter and cream",
        price: 299,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
        category: "Vegetarian",
        spiceLevel: 1,
      },
      // North Indian Non-Veg
      {
        restaurantId: 1,
        name: "Butter Chicken",
        description: "Tender chicken pieces in rich tomato and butter gravy",
        price: 399,
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
        category: "Non-Vegetarian",
        spiceLevel: 2,
      },
      {
        restaurantId: 1,
        name: "Chicken Biryani",
        description: "Fragrant basmati rice cooked with spiced chicken and aromatics",
        price: 449,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
        category: "Non-Vegetarian",
        spiceLevel: 3,
      },
      // South Indian
      {
        restaurantId: 2,
        name: "Masala Dosa",
        description: "Crispy rice crepe with spiced potato filling and chutneys",
        price: 199,
        image: "https://images.unsplash.com/photo-1630383249896-2b88c97b7083",
        category: "Vegetarian",
        spiceLevel: 2,
      },
      {
        restaurantId: 2,
        name: "Idli Sambar",
        description: "Steamed rice cakes with lentil soup and coconut chutney",
        price: 149,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",
        category: "Vegetarian",
        spiceLevel: 1,
      },
      // Chinese
      {
        restaurantId: 2,
        name: "Chilli Paneer",
        description: "Indo-Chinese style spicy paneer with bell peppers",
        price: 299,
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8",
        category: "Chinese",
        spiceLevel: 3,
      },
      {
        restaurantId: 2,
        name: "Veg Hakka Noodles",
        description: "Stir-fried noodles with mixed vegetables in Indo-Chinese style",
        price: 249,
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246",
        category: "Chinese",
        spiceLevel: 2,
      },
      // Street Food
      {
        restaurantId: 3,
        name: "Pani Puri",
        description: "Crispy hollow puris filled with spiced water and chutney",
        price: 99,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        category: "Street Food",
        spiceLevel: 3,
      },
      {
        restaurantId: 3,
        name: "Samosa",
        description: "Crispy pastry triangles with spiced potato filling",
        price: 79,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        category: "Street Food",
        spiceLevel: 2,
      },
      // Desserts
      {
        restaurantId: 3,
        name: "Gulab Jamun",
        description: "Deep-fried milk solids soaked in sugar syrup",
        price: 199,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        category: "Desserts",
        spiceLevel: 0,
      },
      {
        restaurantId: 3,
        name: "Rasmalai",
        description: "Soft cottage cheese patties in saffron flavored milk",
        price: 249,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        category: "Desserts",
        spiceLevel: 0,
      },
    ];

    dishes.forEach((dish) => {
      const id = this.currentId.dishes++;
      this.dishes.set(id, { ...dish, id });
    });
  }
}

export const storage = new MemStorage();