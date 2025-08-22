import { PrismaClient, AchievementCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default achievements for gamification
  const achievements = [
    {
      name: "Welcome Aboard",
      description: "Welcome to NutriTrack! Your journey to better nutrition starts here.",
      icon: "🎉",
      category: AchievementCategory.MILESTONE,
      points: 100,
      condition: JSON.stringify({ type: "signup" }),
    },
    {
      name: "First Steps",
      description: "Logged your first meal. Great start!",
      icon: "🥗",
      category: AchievementCategory.MILESTONE,
      points: 50,
      condition: JSON.stringify({ type: "first_meal" }),
    },
    {
      name: "Streak Starter",
      description: "Logged meals for 3 days in a row.",
      icon: "🔥",
      category: AchievementCategory.STREAK,
      points: 150,
      condition: JSON.stringify({ type: "daily_streak", value: 3 }),
    },
    {
      name: "Week Warrior",
      description: "Completed a full week of meal logging!",
      icon: "🏆",
      category: AchievementCategory.STREAK,
      points: 300,
      condition: JSON.stringify({ type: "daily_streak", value: 7 }),
    },
    {
      name: "Protein Pro",
      description: "Hit your protein target 5 days in a row.",
      icon: "💪",
      category: AchievementCategory.MACRO_ACCURACY,
      points: 200,
      condition: JSON.stringify({ type: "protein_streak", value: 5 }),
    },
    {
      name: "Macro Master",
      description: "Achieved 90%+ macro accuracy for a full day.",
      icon: "🎯",
      category: AchievementCategory.MACRO_ACCURACY,
      points: 250,
      condition: JSON.stringify({ type: "macro_accuracy", value: 90 }),
    },
    {
      name: "Consistency King",
      description: "Logged meals for 30 days straight!",
      icon: "👑",
      category: AchievementCategory.CONSISTENCY,
      points: 500,
      condition: JSON.stringify({ type: "daily_streak", value: 30 }),
    },
    {
      name: "Goal Getter",
      description: "Reached your weight loss/gain goal!",
      icon: "🌟",
      category: AchievementCategory.MILESTONE,
      points: 1000,
      condition: JSON.stringify({ type: "weight_goal" }),
    },
    {
      name: "Variety Explorer",
      description: "Logged 50 different foods.",
      icon: "🌈",
      category: AchievementCategory.MILESTONE,
      points: 300,
      condition: JSON.stringify({ type: "food_variety", value: 50 }),
    },
    {
      name: "Level Up",
      description: "Reached level 5 in your nutrition journey!",
      icon: "📈",
      category: AchievementCategory.MILESTONE,
      points: 400,
      condition: JSON.stringify({ type: "user_level", value: 5 }),
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    });
  }

  // Create sample foods for development/testing
  const foods = [
    {
      name: "Banana",
      brand: null,
      fdcId: 173944,
      caloriesPer100g: 89,
      proteinPer100g: 1.1,
      carbsPer100g: 22.8,
      fatPer100g: 0.3,
      fiberPer100g: 2.6,
      sugarPer100g: 12.2,
      servingSizeG: 118,
      servingDesc: "1 medium banana",
      isVerified: true,
    },
    {
      name: "Chicken Breast",
      brand: null,
      fdcId: 171477,
      caloriesPer100g: 165,
      proteinPer100g: 31,
      carbsPer100g: 0,
      fatPer100g: 3.6,
      fiberPer100g: 0,
      sugarPer100g: 0,
      servingSizeG: 85,
      servingDesc: "3 oz serving",
      isVerified: true,
    },
    {
      name: "Brown Rice",
      brand: null,
      fdcId: 168880,
      caloriesPer100g: 123,
      proteinPer100g: 2.6,
      carbsPer100g: 23,
      fatPer100g: 0.9,
      fiberPer100g: 1.8,
      sugarPer100g: 0.4,
      servingSizeG: 195,
      servingDesc: "1 cup cooked",
      isVerified: true,
    },
    {
      name: "Greek Yogurt",
      brand: null,
      fdcId: 170894,
      caloriesPer100g: 97,
      proteinPer100g: 9,
      carbsPer100g: 3.9,
      fatPer100g: 5,
      fiberPer100g: 0,
      sugarPer100g: 3.9,
      servingSizeG: 170,
      servingDesc: "1 container (6 oz)",
      isVerified: true,
    },
    {
      name: "Avocado",
      brand: null,
      fdcId: 171706,
      caloriesPer100g: 160,
      proteinPer100g: 2,
      carbsPer100g: 8.5,
      fatPer100g: 14.7,
      fiberPer100g: 6.7,
      sugarPer100g: 0.7,
      servingSizeG: 201,
      servingDesc: "1 medium avocado",
      isVerified: true,
    },
    {
      name: "Eggs",
      brand: null,
      fdcId: 748967,
      caloriesPer100g: 155,
      proteinPer100g: 13,
      carbsPer100g: 1.1,
      fatPer100g: 11,
      fiberPer100g: 0,
      sugarPer100g: 1.1,
      servingSizeG: 50,
      servingDesc: "1 large egg",
      isVerified: true,
    },
    {
      name: "Almonds",
      brand: null,
      fdcId: 170567,
      caloriesPer100g: 579,
      proteinPer100g: 21.2,
      carbsPer100g: 21.6,
      fatPer100g: 49.9,
      fiberPer100g: 12.5,
      sugarPer100g: 4.4,
      servingSizeG: 28,
      servingDesc: "1 oz (about 23 almonds)",
      isVerified: true,
    },
    {
      name: "Oatmeal",
      brand: null,
      fdcId: 168874,
      caloriesPer100g: 68,
      proteinPer100g: 2.4,
      carbsPer100g: 12,
      fatPer100g: 1.4,
      fiberPer100g: 1.7,
      sugarPer100g: 0.3,
      servingSizeG: 234,
      servingDesc: "1 cup cooked",
      isVerified: true,
    },
  ];

  for (const food of foods) {
    const existingFood = await prisma.food.findFirst({
      where: { name: food.name },
    });

    if (!existingFood) {
      await prisma.food.create({
        data: food,
      });
    }
  }

  console.log("✅ Database seeded successfully!");
  console.log(`📊 Created ${achievements.length} achievements`);
  console.log(`🍎 Created ${foods.length} sample foods`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });