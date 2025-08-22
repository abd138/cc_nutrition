import { postRouter } from "~/server/api/routers/post";
import { profileRouter } from "~/server/api/routers/profile";
import { nutritionRouter } from "~/server/api/routers/nutrition";
import { foodRouter } from "~/server/api/routers/food";
import { achievementRouter } from "~/server/api/routers/achievement";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  profile: profileRouter,
  nutrition: nutritionRouter,
  food: foodRouter,
  achievement: achievementRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;