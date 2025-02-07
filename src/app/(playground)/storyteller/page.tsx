"use client";
import React, { useContext, useState } from "react";
import { BookOpen, Loader2, Sparkles, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "@/app/page";

interface Story {
  genre: string;
  setting: string;
  language: string;
  short_idea: string;
  text_story?: string;
  title?: string;
}

const genres = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Horror",
  "Adventure",
  "Historical Fiction",
  "Literary Fiction",
];

const settings = [
  "Medieval Kingdom",
  "Modern City",
  "Space Colony",
  "Post-apocalyptic World",
  "Victorian Era",
  "Ancient Civilization",
  "Magical Realm",
  "Cyberpunk Future",
];

const languages = [
  "English",
  "Indonesian",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
];

const MagicalLoader = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <motion.div
    className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className={`${
        isDarkMode ? " text-white" : " text-gray-900"
      } p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Wand2
          className={`w-12 h-12 ${
            isDarkMode ? "text-blue-400" : "text-indigo-600"
          }`}
        />
      </motion.div>
      <motion.div
        className="flex gap-2"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-lg font-medium">Crafting your magical story</span>
        <motion.span
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        >
          ✨
        </motion.span>
      </motion.div>
    </motion.div>
  </motion.div>
);

const StoryGenerator: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Story>({
    genre: "",
    setting: "",
    language: "",
    short_idea: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStory(null);

    try {
      const response = await fetch("/api/storyteller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate story");
      }

      const data: Story = await response.json();
      setStory(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && <MagicalLoader isDarkMode={isDarkMode} />}
      </AnimatePresence>

      <motion.div
        className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div
            className="text-center"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.h2
              className="text-4xl font-bold mb-4 flex flex-col items-center justify-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <BookOpen
                className={`w-12 h-12 ${
                  isDarkMode ? "text-blue-400" : "text-indigo-600"
                }`}
              />
              Story Generator
            </motion.h2>
            <motion.p
              className="text-lg opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Create your unique story with AI
            </motion.p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className={`max-w-4xl mx-auto p-8 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-gray-800/50 backdrop-blur-sm"
                : "bg-white/80 backdrop-blur-sm"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Genre", options: genres, name: "genre" },
                { label: "Setting", options: settings, name: "setting" },
                { label: "Language", options: languages, name: "language" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium opacity-90">
                    {field.label}
                  </label>
                  <select
                    value={formData[field.name as keyof typeof formData]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`w-full p-3 rounded-lg shadow-sm transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <motion.div
              className="space-y-2 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium opacity-90">
                Short Idea
              </label>
              <textarea
                value={formData.short_idea}
                onChange={(e) => handleChange("short_idea", e.target.value)}
                rows={3}
                className={`w-full p-4 rounded-lg shadow-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                maxLength={80}
                placeholder="Enter a brief description of your story idea..."
              />
              <div className="flex justify-end">
                <span className="text-sm opacity-70">
                  {formData.short_idea.length}/80 characters
                </span>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-8 py-3 text-white font-medium rounded-lg shadow-md 
                ${
                  isDarkMode
                    ? loading
                      ? "bg-blue-500/50 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                    : loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
                } 
                transition-all duration-300 flex items-center justify-center gap-2 mx-auto`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Story
                </>
              )}
            </motion.button>
          </motion.form>

          {error && (
            <motion.div
              className={`p-4 rounded-lg mx-auto max-w-2xl ${
                isDarkMode
                  ? "bg-red-900/50 text-red-200"
                  : "bg-red-50 text-red-800"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence>
            {story && (
              <motion.div
                className={`mt-12 rounded-xl shadow-lg p-8 max-w-4xl mx-auto ${
                  isDarkMode
                    ? "bg-gray-800/50 backdrop-blur-sm"
                    : "bg-white/80 backdrop-blur-sm"
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <motion.h3
                  className="text-2xl font-bold border-b pb-4 mb-6 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <BookOpen
                    className={`w-6 h-6 ${
                      isDarkMode ? "text-blue-400" : "text-indigo-600"
                    }`}
                  />
                  {story.title}
                </motion.h3>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {[
                    { label: "Genre", value: story.genre },
                    { label: "Setting", value: story.setting },
                    { label: "Language", value: story.language },
                    { label: "Short Idea", value: story.short_idea },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                      }`}
                    >
                      <p className="font-medium text-sm opacity-70">
                        {item.label}
                      </p>
                      <p className="mt-1">{item.value}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className={`prose max-w-none ${
                    isDarkMode ? "prose-invert" : "prose-indigo"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div
                    className="leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: story.text_story || "" }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default StoryGenerator;
