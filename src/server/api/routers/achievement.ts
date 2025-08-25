import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const achievementRouter = createTRPCRouter({
  // Get user's achievements
  getUserAchievements: protectedProcedure.query(async ({ ctx }) => {
    const userAchievements = await ctx.db.userAchievement.findMany({
      where: { userId: ctx.session.user.id },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' },
    });

    return userAchievements.map(ua => ({
      ...ua.achievement,
      earnedAt: ua.earnedAt,
      progressValue: ua.progressValue,
    }));
  }),

  // Get all available achievements
  getAllAchievements: protectedProcedure.query(async ({ ctx }) => {
    const allAchievements = await ctx.db.achievement.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { points: 'asc' },
      ],
    });

    // Get user's earned achievements
    const userAchievements = await ctx.db.userAchievement.findMany({
      where: { userId: ctx.session.user.id },
      select: { achievementId: true, earnedAt: true },
    });

    const earnedIds = new Set(userAchievements.map(ua => ua.achievementId));
    const earnedMap = new Map(
      userAchievements.map(ua => [ua.achievementId, ua.earnedAt])
    );

    return allAchievements.map(achievement => ({
      ...achievement,
      isEarned: earnedIds.has(achievement.id),
      earnedAt: earnedMap.get(achievement.id) || null,
    }));
  }),

  // Get user stats for gamification
  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      select: {
        currentLevel: true,
        totalXp: true,
        currentStreak: true,
      },
    });

    // Calculate current streak
    const streak = await calculateCurrentStreak(ctx.db, ctx.session.user.id);

    // Get achievement count
    const achievementCount = await ctx.db.userAchievement.count({
      where: { userId: ctx.session.user.id },
    });

    // Get total days logged
    const totalDaysLogged = await ctx.db.dailyNutrition.count({
      where: {
        userId: ctx.session.user.id,
        loggedMeals: { gt: 0 },
      },
    });

    // Calculate XP needed for next level
    const xpForNextLevel = calculateXpForLevel(user.currentLevel + 1);
    const xpForCurrentLevel = calculateXpForLevel(user.currentLevel);
    const xpProgress = user.totalXp - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;

    return {
      level: user.currentLevel,
      totalXp: user.totalXp,
      currentStreak: streak,
      achievementCount,
      totalDaysLogged,
      xpProgress,
      xpNeeded,
      xpPercentage: Math.round((xpProgress / xpNeeded) * 100),
    };
  }),

  // Get leaderboard (top users by XP)
  getLeaderboard: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const topUsers = await ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          currentLevel: true,
          totalXp: true,
          currentStreak: true,
        },
        orderBy: [
          { totalXp: 'desc' },
          { currentLevel: 'desc' },
        ],
        take: input.limit,
      });

      // Find current user's rank
      const userRank = await ctx.db.user.findMany({
        where: {
          totalXp: { gt: ctx.session.user.totalXp || 0 },
        },
        select: { id: true },
      });

      const currentUserRank = userRank.length + 1;

      return {
        topUsers: topUsers.map((user, index) => ({
          ...user,
          rank: index + 1,
          isCurrentUser: user.id === ctx.session.user.id,
        })),
        currentUserRank,
      };
    }),

  // Get recent achievements across all users (for social feed)
  getRecentAchievements: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      const recentAchievements = await ctx.db.userAchievement.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          achievement: true,
        },
        orderBy: { earnedAt: 'desc' },
        take: input.limit,
      });

      return recentAchievements;
    }),

  // Manual achievement check (for testing)
  checkAchievements: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const db = ctx.db;

    const newAchievements = [];

    // Check streak achievements
    const streak = await calculateCurrentStreak(db, userId);
    
    if (streak >= 3) {
      const streakStarter = await db.achievement.findFirst({
        where: { name: "Streak Starter" },
      });
      
      if (streakStarter) {
        const existing = await db.userAchievement.findFirst({
          where: {
            userId,
            achievementId: streakStarter.id,
          },
        });

        if (!existing) {
          await db.userAchievement.create({
            data: {
              userId,
              achievementId: streakStarter.id,
              progressValue: streak,
            },
          });

          await db.user.update({
            where: { id: userId },
            data: { totalXp: { increment: streakStarter.points } },
          });

          newAchievements.push(streakStarter);
        }
      }
    }

    if (streak >= 7) {
      const weekWarrior = await db.achievement.findFirst({
        where: { name: "Week Warrior" },
      });
      
      if (weekWarrior) {
        const existing = await db.userAchievement.findFirst({
          where: {
            userId,
            achievementId: weekWarrior.id,
          },
        });

        if (!existing) {
          await db.userAchievement.create({
            data: {
              userId,
              achievementId: weekWarrior.id,
              progressValue: streak,
            },
          });

          await db.user.update({
            where: { id: userId },
            data: { totalXp: { increment: weekWarrior.points } },
          });

          newAchievements.push(weekWarrior);
        }
      }
    }

    // Update level if XP threshold reached
    const user = await db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { totalXp: true, currentLevel: true },
    });

    const newLevel = calculateLevelFromXp(user.totalXp);
    if (newLevel > user.currentLevel) {
      await db.user.update({
        where: { id: userId },
        data: { currentLevel: newLevel },
      });

      // Check for level achievement
      if (newLevel >= 5) {
        const levelUp = await db.achievement.findFirst({
          where: { name: "Level Up" },
        });
        
        if (levelUp) {
          const existing = await db.userAchievement.findFirst({
            where: {
              userId,
              achievementId: levelUp.id,
            },
          });

          if (!existing) {
            await db.userAchievement.create({
              data: {
                userId,
                achievementId: levelUp.id,
                progressValue: newLevel,
              },
            });

            newAchievements.push(levelUp);
          }
        }
      }
    }

    return newAchievements;
  }),
});

// Helper function to calculate current streak
async function calculateCurrentStreak(db: any, userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  // Count consecutive days with logged meals
  for (let i = 0; i < 365; i++) { // Max 365 days to prevent infinite loops
    const summary = await db.dailyNutrition.findUnique({
      where: {
        userId_date: {
          userId,
          date: currentDate,
        },
      },
      select: { loggedMeals: true },
    });

    if (summary && summary.loggedMeals > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// Helper function to calculate XP needed for a level
function calculateXpForLevel(level: number): number {
  // XP required increases exponentially: 100, 250, 450, 700, 1000, etc.
  return Math.round(100 * level + 50 * level * (level - 1));
}

// Helper function to calculate level from total XP
function calculateLevelFromXp(totalXp: number): number {
  let level = 1;
  let xpRequired = calculateXpForLevel(level);

  while (totalXp >= xpRequired) {
    level++;
    xpRequired = calculateXpForLevel(level);
  }

  return level - 1;
}