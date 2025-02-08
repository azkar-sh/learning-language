"use client";

import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "@/app/context/ThemeContext";
import {
  Utensils,
  Plus,
  ChefHat,
  Timer,
  Users,
  Loader2,
  Trash2,
} from "lucide-react";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Recipe {
  recipeName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
    notes?: string;
  }[];
  instructions: string[];
  nutritionFacts: { [key: string]: string };
  notes?: string;
  language: string;
}

export default function CookingIdea() {
  const { isDarkMode } = useContext(ThemeContext);
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [language, setLanguage] = useState("id");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleIngredientChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index][event.target.name as keyof Ingredient] =
      event.target.value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/cooking-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients, language, note }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      if ("error" in data) {
        setError(data.error);
      } else {
        setRecipe(data);
      }
    } catch (err: unknown) {
      setError(
        (err as Error).message ||
          "An error occurred while generating the recipe."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <ChefHat
              className={`w-16 h-16 ${
                isDarkMode ? "text-blue-400" : "text-indigo-600"
              }`}
            />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Cooking Idea Generator</h1>
          <p className="text-lg opacity-80">
            Transform your ingredients into delicious recipes
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className={`${
            isDarkMode
              ? "bg-gray-800/50 backdrop-blur-sm"
              : "bg-white/80 backdrop-blur-sm"
          } rounded-xl shadow-lg p-6 mb-8`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium opacity-90">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`w-full p-3 rounded-lg shadow-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium opacity-90">
                Special Note
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Vegetarian, Halal, Gluten Free..."
                maxLength={80}
                className={`w-full p-3 rounded-lg shadow-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Ingredients (optional)</h2>
              <motion.button
                type="button"
                onClick={addIngredient}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white`}
              >
                <Plus className="w-4 h-4" />
                Add Ingredient
              </motion.button>
            </div>

            <AnimatePresence>
              {ingredients.map((ingredient, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4 p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Ingredient Name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, e)}
                    className={`w-full p-2 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <input
                    type="text"
                    name="quantity"
                    placeholder="Quantity"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, e)}
                    className={`w-full p-2 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <input
                    type="text"
                    name="unit"
                    placeholder="Unit (g, ml, pcs)"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, e)}
                    className={`w-full p-2 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <motion.button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg flex items-center justify-center ${
                      isDarkMode
                        ? "bg-red-500/20 hover:bg-red-500/30 text-red-300"
                        : "bg-red-100 hover:bg-red-200 text-red-600"
                    }`}
                    disabled={ingredients.length === 1}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-8 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 text-white font-medium ${
              isDarkMode
                ? loading
                  ? "bg-blue-500/50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                : loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            whileHover={loading ? {} : { scale: 1.05 }}
            whileTap={loading ? {} : { scale: 0.95 }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              <>
                <Utensils className="w-5 h-5" />
                Generate Recipe
              </>
            )}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-lg mb-8 ${
                isDarkMode
                  ? "bg-red-900/50 text-red-200"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {error}
            </motion.div>
          )}

          {recipe && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`${
                isDarkMode
                  ? "bg-gray-800/50 backdrop-blur-sm"
                  : "bg-white/80 backdrop-blur-sm"
              } rounded-xl shadow-lg p-8`}
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold mb-6 flex items-center gap-3"
              >
                <ChefHat
                  className={`w-8 h-8 ${
                    isDarkMode ? "text-blue-400" : "text-indigo-600"
                  }`}
                />
                {recipe.recipeName}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg mb-8 opacity-90"
              >
                {recipe.description}
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="w-5 h-5 opacity-70" />
                    <span className="font-medium">Prep Time</span>
                  </div>
                  <p>{recipe.prepTime}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="w-5 h-5 opacity-70" />
                    <span className="font-medium">Cook Time</span>
                  </div>
                  <p>{recipe.cookTime}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 opacity-70" />
                    <span className="font-medium">Servings</span>
                  </div>
                  <p>{recipe.servings}</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg ${
                        isDarkMode ? "bg-gray-700/30" : "bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">
                        {ingredient.quantity} {ingredient.unit}
                      </span>{" "}
                      {ingredient.name}
                      {ingredient.notes && (
                        <span className="block text-sm opacity-70 mt-1">
                          Note: {ingredient.notes}
                        </span>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold mb-4">Instructions</h3>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? "bg-gray-700/30" : "bg-gray-50"
                      }`}
                    >
                      <span className="font-medium mr-3">{index + 1}.</span>
                      {instruction}
                    </motion.li>
                  ))}
                </ol>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold mb-4">Nutrition Facts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(recipe.nutritionFacts).map(
                    ([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={`p-3 rounded-lg ${
                          isDarkMode ? "bg-gray-700/30" : "bg-gray-50"
                        }`}
                      >
                        <span className="font-medium">{key}:</span> {value}
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>

              {recipe.notes && (
                <>
                  <h3 className="text-xl font-semibold mb-2">Notes</h3>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className={`rounded-lg p-3 ${
                      isDarkMode ? "bg-gray-700/30" : "bg-gray-50"
                    }`}
                  >
                    <p className="opacity-90">{recipe.notes}</p>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
