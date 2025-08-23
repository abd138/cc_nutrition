import { useState } from "react";
import { useSession } from "next-auth/react";
import { Calendar, Target, TrendingUp, Award } from "lucide-react";

const Dashboard = () => {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data - in a real app this would come from tRPC queries
  const mockStats = {
    dailyCalories: 1847,
    targetCalories: 2000,
    protein: 125,
    targetProtein: 150,
    carbs: 180,
    targetCarbs: 250,
    fat: 65,
    targetFat: 67,
    currentStreak: 7,
    totalXp: 2350,
    level: 12
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {session?.user?.name || "User"}!
              </h1>
              <p className="text-gray-600 mt-2">
                Let&apos;s track your nutrition journey for today
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Award className="text-yellow-500" size={20} />
                <span className="font-semibold">Level {mockStats.level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-green-500" size={20} />
                <span className="font-semibold">{mockStats.currentStreak} day streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Calendar className="text-blue-500" size={24} />
            <label htmlFor="date" className="font-semibold text-gray-700">
              Select Date:
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Calorie Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Daily Calories</h2>
              <Target className="text-blue-500" size={24} />
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-800">
                {mockStats.dailyCalories} / {mockStats.targetCalories}
              </div>
              <div className="text-sm text-gray-600">
                {mockStats.targetCalories - mockStats.dailyCalories} calories remaining
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-300 ${getProgressColor(
                  getProgressPercentage(mockStats.dailyCalories, mockStats.targetCalories)
                )}`}
                style={{
                  width: `${getProgressPercentage(mockStats.dailyCalories, mockStats.targetCalories)}%`
                }}
              />
            </div>
          </div>

          {/* XP Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Experience Points</h2>
              <Award className="text-yellow-500" size={24} />
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-800">{mockStats.totalXp} XP</div>
              <div className="text-sm text-gray-600">Level {mockStats.level}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
                style={{ width: "65%" }}
              />
            </div>
          </div>
        </div>

        {/* Macro Nutrients */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Protein */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Protein</h3>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {mockStats.protein}g / {mockStats.targetProtein}g
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                  getProgressPercentage(mockStats.protein, mockStats.targetProtein)
                )}`}
                style={{
                  width: `${getProgressPercentage(mockStats.protein, mockStats.targetProtein)}%`
                }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Carbs</h3>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {mockStats.carbs}g / {mockStats.targetCarbs}g
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                  getProgressPercentage(mockStats.carbs, mockStats.targetCarbs)
                )}`}
                style={{
                  width: `${getProgressPercentage(mockStats.carbs, mockStats.targetCarbs)}%`
                }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Fat</h3>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {mockStats.fat}g / {mockStats.targetFat}g
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                  getProgressPercentage(mockStats.fat, mockStats.targetFat)
                )}`}
                style={{
                  width: `${getProgressPercentage(mockStats.fat, mockStats.targetFat)}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Log Food
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Add Weight
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              View Progress
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Achievements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;