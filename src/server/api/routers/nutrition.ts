import { z } from "zod";
import { createTRPCRouter, protectedProcedure, profileSetupProcedure } from "../trpc";
import { MealType } from "@prisma/client";

export const nutritionRouter = createTRPCRouter({
  // Get today's nutrition summary
  getTodaysSummary: profileSetupProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's food entries
    const entries = await ctx.db.foodEntry.findMany({
      where: {
        userId: ctx.session.user.id,
        loggedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        food: true,
      },
      orderBy: {
        loggedAt: 'desc',
      },
    });

    // Calculate totals
    const totals = entries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Get user's targets
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        dailyCalories: true,
        proteinG: true,
        carbsG: true,
        fatG: true,
      },
    });

    // Group entries by meal type
    const mealEntries = {
      breakfast: entries.filter(e => e.mealType === MealType.BREAKFAST),
      lunch: entries.filter(e => e.mealType === MealType.LUNCH),
      dinner: entries.filter(e => e.mealType === MealType.DINNER),
      snack: entries.filter(e => e.mealType === MealType.SNACK),
    };

    return {
      totals,
      targets: {
        calories: user?.dailyCalories || 2000,
        protein: user?.proteinG || 120,
        carbs: user?.carbsG || 200,
        fat: user?.fatG || 70,
      },
      entries: mealEntries,
      date: today.toISOString(),
    };
  }),

  // Add food entry
  addFoodEntry: profileSetupProcedure
    .input(
      z.object({
        foodId: z.string(),
        mealType: z.nativeEnum(MealType),
        quantityG: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get food details for nutrition calculation
      const food = await ctx.db.food.findUniqueOrThrow({
        where: { id: input.foodId },
      });

      // Calculate nutrition based on quantity
      const multiplier = input.quantityG / 100; // food data is per 100g
      const calculatedNutrition = {
        calories: Math.round(food.caloriesPer100g * multiplier * 100) / 100,
        protein: Math.round(food.proteinPer100g * multiplier * 100) / 100,
        carbs: Math.round(food.carbsPer100g * multiplier * 100) / 100,
        fat: Math.round(food.fatPer100g * multiplier * 100) / 100,
      };

      // Create food entry
      const entry = await ctx.db.foodEntry.create({
        data: {
          userId: ctx.session.user.id,
          foodId: input.foodId,
          mealType: input.mealType,
          quantityG: input.quantityG,
          ...calculatedNutrition,
        },
        include: {
          food: true,
        },
      });

      // Update daily nutrition summary
      await updateDailyNutritionSummary(ctx.db, ctx.session.user.id);

      // Check for achievements
      await checkNutritionAchievements(ctx.db, ctx.session.user.id);

      return entry;
    }),

  // Delete food entry
  deleteFoodEntry: protectedProcedure
    .input(z.object({ entryId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify entry belongs to user
      const entry = await ctx.db.foodEntry.findFirst({
        where: {
          id: input.entryId,
          userId: ctx.session.user.id,
        },
      });

      if (!entry) {
        throw new Error("Food entry not found");
      }

      await ctx.db.foodEntry.delete({
        where: { id: input.entryId },
      });

      // Update daily nutrition summary
      await updateDailyNutritionSummary(ctx.db, ctx.session.user.id);

      return { success: true };
    }),

  // Get nutrition history for charts
  getNutritionHistory: profileSetupProcedure
    .input(
      z.object({
        days: z.number().default(30),
      }),
    )
    .query(async ({ ctx, input }) => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const dailySummaries = await ctx.db.dailyNutrition.findMany({
        where: {
          userId: ctx.session.user.id,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      return dailySummaries;
    }),

  // Get macro accuracy for gamification
  getMacroAccuracy: profileSetupProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const summary = await ctx.db.dailyNutrition.findUnique({
      where: {
        userId_date: {
          userId: ctx.session.user.id,
          date: today,
        },
      },
    });

    if (!summary) {
      return { accuracy: 0, breakdown: null };
    }

    const breakdown = {
      calories: summary.calorieAccuracy || 0,
      protein: calculateAccuracy(summary.totalProtein, summary.proteinTarget || 120),
      carbs: calculateAccuracy(summary.totalCarbs, summary.carbsTarget || 200),
      fat: calculateAccuracy(summary.totalFat, summary.fatTarget || 70),
    };

    const overallAccuracy = (breakdown.calories + breakdown.protein + breakdown.carbs + breakdown.fat) / 4;

    return {
      accuracy: Math.round(overallAccuracy),
      breakdown,
    };
  }),
});

// Helper function to update daily nutrition summary
async function updateDailyNutritionSummary(db: any, userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get today's entries
  const entries = await db.foodEntry.findMany({
    where: {
      userId,
      loggedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // Calculate totals
  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Get user targets
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      dailyCalories: true,
      proteinG: true,
      carbsG: true,
      fatG: true,
    },
  });

  const targets = {
    calories: user?.dailyCalories || 2000,
    protein: user?.proteinG || 120,
    carbs: user?.carbsG || 200,
    fat: user?.fatG || 70,
  };

  // Calculate accuracy
  const calorieAccuracy = calculateAccuracy(totals.calories, targets.calories);
  const macroAccuracy = (
    calculateAccuracy(totals.protein, targets.protein) +
    calculateAccuracy(totals.carbs, targets.carbs) +
    calculateAccuracy(totals.fat, targets.fat)
  ) / 3;

  // Upsert daily summary
  await db.dailyNutrition.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
      calorieTarget: targets.calories,
      proteinTarget: targets.protein,
      carbsTarget: targets.carbs,
      fatTarget: targets.fat,
      calorieAccuracy,
      macroAccuracy,
      loggedMeals: entries.length,
    },
    create: {
      userId,
      date: today,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
      calorieTarget: targets.calories,
      proteinTarget: targets.protein,
      carbsTarget: targets.carbs,
      fatTarget: targets.fat,
      calorieAccuracy,
      macroAccuracy,
      loggedMeals: entries.length,
    },
  });
}

// Helper function to calculate accuracy percentage
function calculateAccuracy(actual: number, target: number): number {
  if (target === 0) return 100;
  const percentageOff = Math.abs((actual - target) / target) * 100;
  return Math.max(0, 100 - percentageOff);
}

// Helper function to check for achievements
async function checkNutritionAchievements(db: any, userId: string) {
  // Check for first meal achievement
  const totalEntries = await db.foodEntry.count({
    where: { userId },
  });

  if (totalEntries === 1) {
    const achievement = await db.achievement.findFirst({
      where: { name: "First Steps" },
    });

    if (achievement) {
      await db.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
        update: {},
        create: {
          userId,
          achievementId: achievement.id,
        },
      });

      // Award XP
      await db.user.update({
        where: { id: userId },
        data: {
          totalXp: { increment: achievement.points },
        },
      });
    }
  }

  // Check for macro master achievement (90%+ accuracy)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySummary = await db.dailyNutrition.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  if (todaySummary?.macroAccuracy && todaySummary.macroAccuracy >= 90) {
    const achievement = await db.achievement.findFirst({
      where: { name: "Macro Master" },
    });

    if (achievement) {
      await db.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
        update: {},
        create: {
          userId,
          achievementId: achievement.id,
        },
      });

      await db.user.update({
        where: { id: userId },
        data: {
          totalXp: { increment: achievement.points },
        },
      });
    }
  }
}