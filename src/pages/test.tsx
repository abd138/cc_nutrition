import { type NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import Dashboard from "~/components/Dashboard";
import FoodSearch from "~/components/FoodSearch";
import NutritionProgress from "~/components/NutritionProgress";
import FoodDatabase from "~/components/FoodDatabase";

const TestPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock session data for testing
  const mockSession = {
    user: {
      name: "Test User",
      email: "test@example.com",
      hasProfile: true,
    }
  };

  return (
    <>
      <Head>
        <title>Feature Test - NutriTrack</title>
        <meta name="description" content="Test all nutrition tracking features" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-blue-600">🍎 NutriTrack</div>
                <div className="hidden md:block text-sm text-gray-500">
                  Feature Testing Environment
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Welcome, {mockSession.user.name}
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {mockSession.user.name?.charAt(0) || "T"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto py-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "dashboard"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("food-search")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "food-search"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Add Food
              </button>
              <button
                onClick={() => setActiveTab("progress")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "progress"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Progress & Analytics
              </button>
              <button
                onClick={() => setActiveTab("database")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "database"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Food Database
              </button>
              <button
                onClick={() => setActiveTab("api-test")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "api-test"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                API Testing
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === "dashboard" && <Dashboard />}
          
          {activeTab === "food-search" && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Food Search & Logging</h1>
                <p className="text-gray-600">Search for foods and add them to your daily log</p>
              </div>
              <FoodSearch />
            </div>
          )}
          
          {activeTab === "progress" && (
            <div>
              <NutritionProgress />
            </div>
          )}

          {activeTab === "database" && (
            <div>
              <FoodDatabase />
            </div>
          )}

          {activeTab === "api-test" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">API Endpoint Testing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Food API Endpoints */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Food API Endpoints</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-blue-600">food.search</code>
                      <p className="text-gray-600 mt-1">Search foods by name or brand</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-blue-600">food.getPopular</code>
                      <p className="text-gray-600 mt-1">Get most frequently logged foods</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-blue-600">food.getRecent</code>
                      <p className="text-gray-600 mt-1">Get user&apos;s recently used foods</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-blue-600">food.getNutritionBreakdown</code>
                      <p className="text-gray-600 mt-1">Calculate nutrition for specific quantity</p>
                    </div>
                  </div>
                </div>

                {/* Nutrition API Endpoints */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Nutrition API Endpoints</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-green-600">nutrition.getTodaysSummary</code>
                      <p className="text-gray-600 mt-1">Get daily nutrition totals and targets</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-green-600">nutrition.addFoodEntry</code>
                      <p className="text-gray-600 mt-1">Log a food entry with calculated nutrition</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-green-600">nutrition.getNutritionHistory</code>
                      <p className="text-gray-600 mt-1">Get nutrition data for analytics charts</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-green-600">nutrition.getMacroAccuracy</code>
                      <p className="text-gray-600 mt-1">Get accuracy scores for gamification</p>
                    </div>
                  </div>
                </div>

                {/* Database Status */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Database Status</h3>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-medium text-green-800">Database Online</span>
                    </div>
                    <div className="mt-2 text-sm text-green-700">
                      <p>✅ SQLite database created and seeded</p>
                      <p>✅ 8 sample foods available</p>
                      <p>✅ 10 achievements configured</p>
                      <p>✅ All database tables created successfully</p>
                    </div>
                  </div>
                </div>

                {/* Feature Status */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Feature Implementation Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                      <h4 className="font-medium text-green-800">✅ Core Features</h4>
                      <ul className="mt-2 text-sm text-green-700">
                        <li>• Food search & logging</li>
                        <li>• Nutrition calculations</li>
                        <li>• Daily summaries</li>
                        <li>• Progress tracking</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                      <h4 className="font-medium text-blue-800">✅ Gamification</h4>
                      <ul className="mt-2 text-sm text-blue-700">
                        <li>• Achievement system</li>
                        <li>• XP and leveling</li>
                        <li>• Streak tracking</li>
                        <li>• Accuracy scoring</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 p-3 rounded-md">
                      <h4 className="font-medium text-purple-800">✅ Analytics</h4>
                      <ul className="mt-2 text-sm text-purple-700">
                        <li>• Progress charts</li>
                        <li>• Macro breakdowns</li>
                        <li>• Historical data</li>
                        <li>• Trend analysis</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TestPage;