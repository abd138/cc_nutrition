import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// BMAD Nutrition Specialist Algorithm
function calculateMacroTargets({
  gender,
  heightCm,
  dateOfBirth,
  activityLevel,
  goalType,
  weightKg,
}: {
  gender: string;
  heightCm: number;
  dateOfBirth: Date;
  activityLevel: string;
  goalType: string;
  weightKg?: number;
}) {
  const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
  
  // Use provided weight or estimate based on height and gender
  const weight = weightKg || (gender === 'MALE' ? heightCm - 100 : heightCm - 110);

  // Mifflin-St Jeor Equation for BMR (Basal Metabolic Rate)
  let bmr: number;
  if (gender === 'MALE') {
    bmr = Math.round(10 * weight + 6.25 * heightCm - 5 * age + 5);
  } else {
    bmr = Math.round(10 * weight + 6.25 * heightCm - 5 * age - 161);
  }

  // Activity multipliers for TDEE (Total Daily Energy Expenditure)
  const activityMultipliers = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
    EXTREMELY_ACTIVE: 1.9,
  };

  const tdee = Math.round(bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]);

  // Goal-based calorie adjustment
  let dailyCalories: number;
  switch (goalType) {
    case 'LOSE_FAT':
      dailyCalories = Math.round(tdee * 0.8); // 20% deficit
      break;
    case 'GAIN_MUSCLE':
      dailyCalories = Math.round(tdee * 1.1); // 10% surplus
      break;
    case 'BODY_RECOMPOSITION':
      dailyCalories = tdee; // Maintenance
      break;
    default: // MAINTAIN_WEIGHT
      dailyCalories = tdee;
  }

  // BMAD Macro distribution based on goal and latest research
  let proteinRatio: number, carbRatio: number, fatRatio: number;
  
  switch (goalType) {
    case 'LOSE_FAT':
      proteinRatio = 0.35; // Higher protein for muscle preservation
      carbRatio = 0.35;
      fatRatio = 0.30;
      break;
    case 'GAIN_MUSCLE':
      proteinRatio = 0.30; // Adequate protein for muscle building
      carbRatio = 0.45; // Higher carbs for energy
      fatRatio = 0.25;
      break;
    case 'BODY_RECOMPOSITION':
      proteinRatio = 0.35; // High protein for both muscle preservation and building
      carbRatio = 0.35;
      fatRatio = 0.30;
      break;
    default: // MAINTAIN_WEIGHT
      proteinRatio = 0.25;
      carbRatio = 0.45;
      fatRatio = 0.30;
  }

  return {
    dailyCalories,
    protein: Math.round((dailyCalories * proteinRatio) / 4), // 4 calories per gram
    carbs: Math.round((dailyCalories * carbRatio) / 4), // 4 calories per gram
    fat: Math.round((dailyCalories * fatRatio) / 9), // 9 calories per gram
    bmr,
    tdee,
  };
}

export const profileRouter = createTRPCRouter({
  // Get current user profile
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        weights: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
    });

    return user;
  }),

  // Update user profile and recalculate macros using BMAD algorithms
  update: protectedProcedure
    .input(
      z.object({
        dateOfBirth: z.date().optional(),
        gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
        heightCm: z.number().min(100).max(250).optional(),
        activityLevel: z.enum([
          'SEDENTARY',
          'LIGHTLY_ACTIVE', 
          'MODERATELY_ACTIVE',
          'VERY_ACTIVE',
          'EXTREMELY_ACTIVE'
        ]).optional(),
        goalType: z.enum([
          'LOSE_FAT',
          'GAIN_MUSCLE',
          'MAINTAIN_WEIGHT',
          'BODY_RECOMPOSITION'
        ]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get current user data
      const currentUser = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          weights: {
            orderBy: { recordedAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!currentUser) {
        throw new Error('User not found');
      }

      // Merge with existing data
      const updatedData = {
        dateOfBirth: input.dateOfBirth ?? currentUser.dateOfBirth,
        gender: input.gender ?? currentUser.gender,
        heightCm: input.heightCm ?? currentUser.heightCm,
        activityLevel: input.activityLevel ?? currentUser.activityLevel,
        goalType: input.goalType ?? currentUser.goalType,
      };

      // Calculate new macro targets using BMAD Nutrition Specialist
      let macroTargets = {};
      if (updatedData.dateOfBirth && updatedData.gender && updatedData.heightCm && 
          updatedData.activityLevel && updatedData.goalType) {
        
        const currentWeight = currentUser.weights[0]?.weightKg;
        macroTargets = calculateMacroTargets({
          gender: updatedData.gender,
          heightCm: updatedData.heightCm,
          dateOfBirth: updatedData.dateOfBirth,
          activityLevel: updatedData.activityLevel,
          goalType: updatedData.goalType,
          weightKg: currentWeight,
        });
      }

      // Update user profile
      const updatedUser = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...updatedData,
          ...macroTargets,
        },
      });

      return updatedUser;
    }),

  // Add weight entry
  addWeight: protectedProcedure
    .input(
      z.object({
        weightKg: z.number().min(20).max(300),
        source: z.string().default('manual'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Add weight entry
      const weightEntry = await ctx.db.userWeight.create({
        data: {
          userId: ctx.session.user.id,
          weightKg: input.weightKg,
          source: input.source,
        },
      });

      // Recalculate macro targets with new weight
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (user?.dateOfBirth && user?.gender && user?.heightCm && 
          user?.activityLevel && user?.goalType) {
        
        const macroTargets = calculateMacroTargets({
          gender: user.gender,
          heightCm: user.heightCm,
          dateOfBirth: user.dateOfBirth,
          activityLevel: user.activityLevel,
          goalType: user.goalType,
          weightKg: input.weightKg,
        });

        // Update user with new macro targets
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: macroTargets,
        });
      }

      return weightEntry;
    }),

  // Get weight history for charts
  getWeightHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(30),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.userWeight.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { recordedAt: 'desc' },
        take: input.limit,
      });
    }),

  // Calculate BMI
  getBMI: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        weights: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user?.heightCm || !user.weights[0]?.weightKg) {
      return null;
    }

    const heightM = user.heightCm / 100;
    const bmi = user.weights[0].weightKg / (heightM * heightM);
    
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    return {
      bmi: Math.round(bmi * 10) / 10,
      category,
    };
  }),
});