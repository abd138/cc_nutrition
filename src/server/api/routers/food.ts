import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const foodRouter = createTRPCRouter({
  // Search foods with fuzzy matching
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(2),
        limit: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Search foods with partial matching
      const foods = await ctx.db.food.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.query,
              },
            },
            {
              brand: {
                contains: input.query,
              },
            },
          ],
        },
        orderBy: [
          { isVerified: 'desc' }, // Verified foods first
          { name: 'asc' },
        ],
        take: input.limit,
      });

      return foods;
    }),

  // Get food by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.food.findUnique({
        where: { id: input.id },
      });
    }),

  // Get food by barcode
  getByBarcode: publicProcedure
    .input(z.object({ barcode: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.food.findFirst({
        where: { barcode: input.barcode },
      });
    }),

  // Get popular/frequently used foods
  getPopular: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      // Get most frequently logged foods across all users
      const popularFoods = await ctx.db.foodEntry.groupBy({
        by: ['foodId'],
        _count: {
          foodId: true,
        },
        orderBy: {
          _count: {
            foodId: 'desc',
          },
        },
        take: input.limit,
      });

      // Get the actual food data
      const foodIds = popularFoods.map(pf => pf.foodId);
      const foods = await ctx.db.food.findMany({
        where: {
          id: { in: foodIds },
        },
      });

      // Return foods with usage count
      return foods.map(food => ({
        ...food,
        usageCount: popularFoods.find(pf => pf.foodId === food.id)?._count.foodId || 0,
      }));
    }),

  // Get user's recent foods
  getRecent: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const recentEntries = await ctx.db.foodEntry.findMany({
        where: { userId: ctx.session.user.id },
        include: { food: true },
        orderBy: { loggedAt: 'desc' },
        take: input.limit * 2, // Get more to account for duplicates
      });

      // Remove duplicates and return unique foods
      const uniqueFoods = recentEntries
        .reduce((acc, entry) => {
          if (!acc.find(food => food.id === entry.food.id)) {
            acc.push(entry.food);
          }
          return acc;
        }, [] as any[])
        .slice(0, input.limit);

      return uniqueFoods;
    }),

  // Get user's favorite foods
  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    const favorites = await ctx.db.userFavorite.findMany({
      where: { userId: ctx.session.user.id },
      include: { food: true },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map(fav => ({
      ...fav.food,
      typicalQuantityG: fav.typicalQuantityG,
      favoriteId: fav.id,
    }));
  }),

  // Add food to favorites
  addToFavorites: protectedProcedure
    .input(
      z.object({
        foodId: z.string(),
        typicalQuantityG: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userFavorite.create({
        data: {
          userId: ctx.session.user.id,
          foodId: input.foodId,
          typicalQuantityG: input.typicalQuantityG,
        },
        include: { food: true },
      });
    }),

  // Remove from favorites
  removeFromFavorites: protectedProcedure
    .input(z.object({ favoriteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify favorite belongs to user
      const favorite = await ctx.db.userFavorite.findFirst({
        where: {
          id: input.favoriteId,
          userId: ctx.session.user.id,
        },
      });

      if (!favorite) {
        throw new Error("Favorite not found");
      }

      await ctx.db.userFavorite.delete({
        where: { id: input.favoriteId },
      });

      return { success: true };
    }),

  // Create custom food (user-generated)
  createCustomFood: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        brand: z.string().optional(),
        caloriesPer100g: z.number().positive(),
        proteinPer100g: z.number().min(0),
        carbsPer100g: z.number().min(0),
        fatPer100g: z.number().min(0),
        fiberPer100g: z.number().min(0).optional(),
        sugarPer100g: z.number().min(0).optional(),
        servingSizeG: z.number().positive().optional(),
        servingDesc: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.food.create({
        data: {
          name: input.name,
          brand: input.brand,
          caloriesPer100g: input.caloriesPer100g,
          proteinPer100g: input.proteinPer100g,
          carbsPer100g: input.carbsPer100g,
          fatPer100g: input.fatPer100g,
          fiberPer100g: input.fiberPer100g || 0,
          sugarPer100g: input.sugarPer100g || 0,
          servingSizeG: input.servingSizeG,
          servingDesc: input.servingDesc,
          isVerified: false, // User-created foods are not verified
        },
      });
    }),

  // Get nutrition breakdown for a specific quantity
  getNutritionBreakdown: publicProcedure
    .input(
      z.object({
        foodId: z.string(),
        quantityG: z.number().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const food = await ctx.db.food.findUniqueOrThrow({
        where: { id: input.foodId },
      });

      const multiplier = input.quantityG / 100;

      return {
        quantity: input.quantityG,
        calories: Math.round(food.caloriesPer100g * multiplier * 100) / 100,
        protein: Math.round(food.proteinPer100g * multiplier * 100) / 100,
        carbs: Math.round(food.carbsPer100g * multiplier * 100) / 100,
        fat: Math.round(food.fatPer100g * multiplier * 100) / 100,
        fiber: Math.round(food.fiberPer100g * multiplier * 100) / 100,
        sugar: Math.round(food.sugarPer100g * multiplier * 100) / 100,
      };
    }),

  // Get suggested serving size
  getSuggestedServing: publicProcedure
    .input(z.object({ foodId: z.string() }))
    .query(async ({ ctx, input }) => {
      const food = await ctx.db.food.findUniqueOrThrow({
        where: { id: input.foodId },
      });

      return {
        size: food.servingSizeG || 100,
        description: food.servingDesc || `${food.servingSizeG || 100}g`,
      };
    }),
});