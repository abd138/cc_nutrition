import { useState } from "react";
import { Search, Plus, Clock, Star } from "lucide-react";
import { api } from "~/utils/api";

interface FoodSearchProps {
  onFoodSelect?: (food: any) => void;
}

const FoodSearch: React.FC<FoodSearchProps> = ({ onFoodSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<string>("BREAKFAST");
  const [quantity, setQuantity] = useState<number>(100);

  const { data: searchResults, isLoading: isSearching } = api.food.search.useQuery(
    { query: searchTerm, limit: 10 },
    { enabled: searchTerm.length >= 2 }
  );

  const { data: recentFoods } = api.food.getRecent.useQuery({ limit: 5 });
  const { data: popularFoods } = api.food.getPopular.useQuery({ limit: 5 });

  const addFoodMutation = api.nutrition.addFoodEntry.useMutation({
    onSuccess: () => {
      setSearchTerm("");
      setQuantity(100);
      // You would typically refresh the nutrition summary here
    },
  });

  const handleAddFood = (food: any) => {
    addFoodMutation.mutate({
      foodId: food.id,
      mealType: selectedMealType as any,
      quantityG: quantity,
    });
  };

  const calculateNutrition = (food: any, qty: number) => {
    const multiplier = qty / 100;
    return {
      calories: Math.round(food.caloriesPer100g * multiplier),
      protein: Math.round(food.proteinPer100g * multiplier * 10) / 10,
      carbs: Math.round(food.carbsPer100g * multiplier * 10) / 10,
      fat: Math.round(food.fatPer100g * multiplier * 10) / 10,
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Food</h2>
      
      {/* Meal Type Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meal Type
        </label>
        <select
          value={selectedMealType}
          onChange={(e) => setSelectedMealType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="BREAKFAST">Breakfast</option>
          <option value="LUNCH">Lunch</option>
          <option value="DINNER">Dinner</option>
          <option value="SNACK">Snack</option>
        </select>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Quantity Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity (grams)
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Search Results */}
      {searchTerm.length >= 2 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Search Results</h3>
          {isSearching ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : searchResults?.length ? (
            <div className="space-y-3">
              {searchResults.map((food) => {
                const nutrition = calculateNutrition(food, quantity);
                return (
                  <div
                    key={food.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {food.name}
                        {food.brand && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({food.brand})
                          </span>
                        )}
                        {food.isVerified && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {nutrition.calories} cal, {nutrition.protein}g protein, {nutrition.carbs}g carbs, {nutrition.fat}g fat
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddFood(food)}
                      disabled={addFoodMutation.isLoading}
                      className="ml-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white p-2 rounded-lg transition-colors"
                    >
                      {addFoodMutation.isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Plus size={16} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">
              No foods found. Try a different search term.
            </div>
          )}
        </div>
      )}

      {/* Recent Foods */}
      {recentFoods?.length && !searchTerm && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-3 flex items-center">
            <Clock size={16} className="mr-2" />
            Recently Used
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {recentFoods.map((food) => {
              const nutrition = calculateNutrition(food, quantity);
              return (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{food.name}</div>
                    <div className="text-sm text-gray-600">
                      {nutrition.calories} cal
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFood(food)}
                    disabled={addFoodMutation.isLoading}
                    className="ml-4 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white p-2 rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Popular Foods */}
      {popularFoods?.length && !searchTerm && (
        <div>
          <h3 className="font-medium text-gray-700 mb-3 flex items-center">
            <Star size={16} className="mr-2" />
            Popular Foods
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {popularFoods.map((food) => {
              const nutrition = calculateNutrition(food, quantity);
              return (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{food.name}</div>
                    <div className="text-sm text-gray-600">
                      {nutrition.calories} cal • Used {food.usageCount || 0} times
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFood(food)}
                    disabled={addFoodMutation.isLoading}
                    className="ml-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white p-2 rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {addFoodMutation.isError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          Failed to add food. Please try again.
        </div>
      )}

      {addFoodMutation.isSuccess && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
          Food added successfully!
        </div>
      )}
    </div>
  );
};

export default FoodSearch;