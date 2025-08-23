import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "~/env.js";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // Custom user properties for nutrition tracking
      hasProfile: boolean;
      currentLevel: number;
      totalXp: number;
      currentStreak: number;
    } & DefaultSession["user"];
  }

  interface User {
    // Custom user properties
    hasProfile: boolean;
    currentLevel: number;
    totalXp: number;
    currentStreak: number;
    dailyCalories?: number;
    proteinG?: number;
    carbsG?: number;
    fatG?: number;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        hasProfile: !!(user as any).dateOfBirth && !!(user as any).gender && !!(user as any).heightCm,
        currentLevel: (user as any).currentLevel ?? 1,
        totalXp: (user as any).totalXp ?? 0,
        currentStreak: (user as any).currentStreak ?? 0,
      },
    }),
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          hasProfile: false,
          currentLevel: 1,
          totalXp: 0,
          currentStreak: 0,
        };
      },
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID ?? "",
      clientSecret: env.GITHUB_CLIENT_SECRET ?? "",
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID ?? "",
      clientSecret: env.DISCORD_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    newUser: '/onboarding', // Redirect new users to profile setup
  },
  events: {
    createUser: async ({ user }) => {
      // Initialize default achievements for new users
      const defaultAchievements = await db.achievement.findMany({
        where: { 
          category: "MILESTONE",
          name: { in: ["Welcome Aboard", "First Steps"] }
        }
      });

      // Grant welcome achievement
      if (defaultAchievements.length > 0) {
        await db.userAchievement.createMany({
          data: defaultAchievements.map(achievement => ({
            userId: user.id,
            achievementId: achievement.id,
          })),
          skipDuplicates: true,
        });
      }
    },
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);