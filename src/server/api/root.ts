import { postRouter } from "./routers/post";
import { profileRouter } from "./routers/profile";
import { nutritionRouter } from "./routers/nutrition";
import { foodRouter } from "./routers/food";
import { achievementRouter } from "./routers/achievement";
import { createTRPCRouter } from "./trpc";

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