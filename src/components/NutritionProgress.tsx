import { useState } from "react";
import { Calendar, TrendingUp, Target, Award, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { api } from "~/utils/api";

const NutritionProgress = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(7);

  const { data: nutritionHistory } = api.nutrition.getNutritionHistory.useQuery({
    days: selectedPeriod,
  });

  const { data: todaysSummary } = api.nutrition.getTodaysSummary.useQuery();
  const { data: macroAccuracy } = api.nutrition.getMacroAccuracy.useQuery();

  // Prepare chart data
  const chartData = nutritionHistory?.map((day) => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    calories: day.totalCalories,
    protein: day.totalProtein,
    carbs: day.totalCarbs,
    fat: day.totalFat,
    accuracy: day.macroAccuracy || 0,
  })).reverse() || [];

  // Prepare macro distribution data for pie chart
  const macroData = todaysSummary ? [
    {
      name: 'Protein',
      value: todaysSummary.totals.protein * 4, // 4 calories per gram
      color: '#3B82F6',
      grams: todaysSummary.totals.protein,
    },
    {
      name: 'Carbs',
      value: todaysSummary.totals.carbs * 4, // 4 calories per gram
      color: '#10B981',
      grams: todaysSummary.totals.carbs,
    },
    {
      name: 'Fat',
      value: todaysSummary.totals.fat * 9, // 9 calories per gram
      color: '#F59E0B',
      grams: todaysSummary.totals.fat,
    },
  ] : [];

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getAccuracyBgColor = (accuracy: number) => {
    if (accuracy >= 90) return "bg-green-100 border-green-300";
    if (accuracy >= 70) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-blue-500" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">Nutrition Progress</h1>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accuracy Overview */}
      {macroAccuracy && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className={`p-4 rounded-lg border ${getAccuracyBgColor(macroAccuracy.accuracy)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Overall</p>
                <p className={`text-2xl font-bold ${getAccuracyColor(macroAccuracy.accuracy)}`}>
                  {macroAccuracy.accuracy}%
                </p>
              </div>
              <Target className="text-gray-500" size={20} />
            </div>
          </div>

          {macroAccuracy.breakdown && Object.entries(macroAccuracy.breakdown).map(([macro, accuracy]) => (
            <div key={macro} className={`p-4 rounded-lg border ${getAccuracyBgColor(accuracy as number)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 capitalize">{macro}</p>
                  <p className={`text-xl font-bold ${getAccuracyColor(accuracy as number)}`}>
                    {Math.round(accuracy as number)}%
                  </p>
                </div>
                <Activity className="text-gray-500" size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Calorie Trend</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Calendar className="mx-auto mb-2" size={48} />
                <p>No data available for selected period</p>
              </div>
            </div>
          )}
        </div>

        {/* Macro Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Macro Nutrients</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="protein" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="carbs" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="fat" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Activity className="mx-auto mb-2" size={48} />
                <p>No macro data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Accuracy Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Accuracy Trend</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
                <Bar 
                  dataKey="accuracy" 
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Award className="mx-auto mb-2" size={48} />
                <p>No accuracy data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Today's Macro Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Today&apos;s Macro Split</h2>
          {macroData.length > 0 ? (
            <div className="flex items-center">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [
                      `${Math.round(value as number)} cal`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {macroData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">
                        {entry.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.grams}g • {Math.round(entry.value)} cal
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              <div className="text-center">
                <Target className="mx-auto mb-2" size={48} />
                <p>No meals logged today</p>
                <p className="text-sm">Start logging to see your macro split</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Award className="mr-2" size={20} />
          Recent Achievements
        </h2>
        <div className="text-center py-8 text-gray-500">
          <Award className="mx-auto mb-2" size={48} />
          <p>Achievements will appear here as you progress</p>
          <p className="text-sm">Log meals consistently to earn your first achievement!</p>
        </div>
      </div>
    </div>
  );
};

export default NutritionProgress;