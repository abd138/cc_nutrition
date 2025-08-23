import { type NextPage } from "next";
import Head from "next/head";

const Onboarding: NextPage = () => {
  return (
    <>
      <Head>
        <title>Complete Your Profile - NutriTrack</title>
        <meta name="description" content="Set up your nutrition goals and preferences" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Welcome to NutriTrack!
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Let&apos;s set up your profile to get started with personalized nutrition tracking.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 175"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 70"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select activity level</option>
                <option value="SEDENTARY">Sedentary (desk job)</option>
                <option value="LIGHTLY_ACTIVE">Lightly Active (light exercise)</option>
                <option value="MODERATELY_ACTIVE">Moderately Active (moderate exercise)</option>
                <option value="VERY_ACTIVE">Very Active (heavy exercise)</option>
                <option value="EXTREMELY_ACTIVE">Extremely Active (very heavy exercise)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select your goal</option>
                <option value="LOSE_FAT">Lose Fat</option>
                <option value="GAIN_MUSCLE">Gain Muscle</option>
                <option value="MAINTAIN_WEIGHT">Maintain Weight</option>
                <option value="BODY_RECOMPOSITION">Body Recomposition</option>
              </select>
            </div>
            
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md font-medium transition-colors mt-6">
              Complete Setup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;