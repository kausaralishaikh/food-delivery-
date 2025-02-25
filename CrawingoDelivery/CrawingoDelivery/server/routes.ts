
import type { Express } from "express";
import { createServer } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertReviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  // Set up authentication middleware
  setupAuth(app);

  // Restaurant Routes
  app.get("/api/restaurants", async (_req, res) => {
    const restaurants = await storage.getRestaurants();
    res.json(restaurants);
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const restaurant = await storage.getRestaurant(id);
    if (!restaurant) return res.sendStatus(404);

    const dishes = await storage.getDishes(id);
    res.json({ ...restaurant, dishes });
  });

  // Dish Routes
  app.get("/api/dishes", async (_req, res) => {
    const allDishes = Array.from(storage.dishes.values());
    res.json(allDishes);
  });

  app.get("/api/dishes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const dish = await storage.getDish(id);
    if (!dish) return res.sendStatus(404);

    const restaurant = await storage.getRestaurant(dish.restaurantId);
    const reviews = await storage.getReviews(id);
    res.json({ ...dish, restaurant, reviews });
  });

  // Review Routes
  app.get("/api/dishes/:id/reviews", async (req, res) => {
    const id = parseInt(req.params.id);
    const reviews = await storage.getReviews(id);
    res.json(reviews);
  });

  app.post("/api/dishes/:id/reviews", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const dishId = parseInt(req.params.id);
    const userId = req.user!.id;
    const reviewData = insertReviewSchema.parse({
      ...req.body,
      userId,
      dishId,
      createdAt: new Date(),
    });

    const review = await storage.createReview(reviewData);
    res.status(201).json(review);
  });

  // Order Routes  
  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const orderData = {
      ...req.body,
      userId: req.user!.id,
      createdAt: new Date(),
    };
    const order = await storage.createOrder(orderData);
    res.status(201).json(order);
  });

  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const orders = await storage.getUserOrders(req.user!.id);
    res.json(orders);
  });

  return createServer(app);
}
