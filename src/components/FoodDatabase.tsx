import { useState } from "react";
import { Search, Database, Verified, Package } from "lucide-react";
import { api } from "~/utils/api";

const FoodDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get all foods with a broad search or popular foods if no search
  const { data: foods, isLoading } = api.food.search.useQuery(
    { 
      query: searchTerm || "a", // Search for 'a' to get many results
      limit: 50 
    },
    { enabled: true }
  );

  const { data: popularFoods } = api.food.getPopular.useQuery({ limit: 10 });

  const displayFoods = searchTerm.length >= 2 ? foods : popularFoods;

  const formatNutrition = (food: any) => {
    return {
      calories: Math.round(food.caloriesPer100g),
      protein: Math.round(food.proteinPer100g * 10) / 10,
      carbs: Math.round(food.carbsPer100g * 10) / 10,
      fat: Math.round(food.fatPer100g * 10) / 10,
      fiber: Math.round(food.fiberPer100g * 10) / 10,
      sugar: Math.round(food.sugarPer100g * 10) / 10,
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="text-blue-500" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Food Database</h2>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search foods in database..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {searchTerm.length >= 2 
            ? `Searching for "${searchTerm}"...` 
            : "Showing popular foods. Start typing to search."
          }
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-2">Loading foods...</p>
        </div>
      )}

      {/* Foods Grid */}
      {!isLoading && displayFoods && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">
              {searchTerm.length >= 2 ? "Search Results" : "Popular Foods"}
            </h3>
            <span className="text-sm text-gray-500">
              {displayFoods.length} food{displayFoods.length !== 1 ? 's' : ''} found
            </span>
          </div>

          <div className="grid gap-4">
            {displayFoods.map((food) => {
              const nutrition = formatNutrition(food);
              return (
                <div
                  key={food.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-800">{food.name}</h4>
                        {food.isVerified && (
                          <Verified className="text-green-500" size={16} />
                        )}
                        {food.brand && (
                          <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {food.brand}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="font-medium text-blue-700">Calories</div>
                          <div className="text-blue-600">{nutrition.calories}</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <div className="font-medium text-green-700">Protein</div>
                          <div className="text-green-600">{nutrition.protein}g</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <div className="font-medium text-yellow-700">Carbs</div>
                          <div className="text-yellow-600">{nutrition.carbs}g</div>
                        </div>
                        <div className="bg-orange-50 p-2 rounded">
                          <div className="font-medium text-orange-700">Fat</div>
                          <div className="text-orange-600">{nutrition.fat}g</div>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <div className="font-medium text-purple-700">Fiber</div>
                          <div className="text-purple-600">{nutrition.fiber}g</div>
                        </div>
                        <div className="bg-pink-50 p-2 rounded">
                          <div className="font-medium text-pink-700">Sugar</div>
                          <div className="text-pink-600">{nutrition.sugar}g</div>
                        </div>
                      </div>

                      {food.servingSizeG && (
                        <div className="mt-3 flex items-center text-sm text-gray-600">
                          <Package size={14} className="mr-1" />
                          Typical serving: {food.servingSizeG}g
                          {food.servingDesc && ` (${food.servingDesc})`}
                        </div>
                      )}

                      {food.fdcId && (
                        <div className="mt-2 text-xs text-gray-500">
                          USDA FDC ID: {food.fdcId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {displayFoods.length === 0 && searchTerm.length >= 2 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="mx-auto mb-2" size={48} />
              <p className="text-lg">No foods found</p>
              <p className="text-sm">Try searching with different terms</p>
            </div>
          )}
        </div>
      )}

      {/* Database Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Database Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-blue-700">Sample Foods</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-green-700">Verified Items</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">10</div>
            <div className="text-yellow-700">Achievements</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">✓</div>
            <div className="text-purple-700">API Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDatabase;