/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Loader2,
  Sparkles,
  Globe,
  MapPin,
  Wand2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const MagicalLoader = () => (
  <motion.div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4"
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
        <Wand2 className="w-12 h-12 text-indigo-600" />
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
        <span className="text-lg font-medium text-gray-700">
          Crafting your magical story
        </span>
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
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Story>({
    genre: "",
    setting: "",
    language: "",
    short_idea: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <AnimatePresence>{loading && <MagicalLoader />}</AnimatePresence>

      <motion.div
        className="space-y-8 min-h-screen py-8 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.h2
            className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <BookOpen className="w-8 h-8 text-indigo-600" />
            Story Generator
          </motion.h2>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Create your unique story with AI
          </motion.p>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-50 text-red-800 p-4 rounded-lg mx-auto max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                label: "Genre",
                name: "genre",
                options: genres,
              },
              {
                icon: MapPin,
                label: "Setting",
                name: "setting",
                options: settings,
              },
              {
                icon: Globe,
                label: "Language",
                name: "language",
                options: languages,
              },
            ].map((field, index) => (
              <motion.div
                key={field.name}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <field.icon className="w-4 h-4 text-indigo-600" />
                  {field.label}
                </label>
                <select
                  name={field.name}
                  value={formData[field.name as keyof Story]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white hover:border-indigo-400"
                  required
                >
                  <option value="">Select a {field.label.toLowerCase()}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700">
              Short Idea
            </label>
            <textarea
              name="short_idea"
              value={formData.short_idea}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 resize-none"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-8 py-3 text-white font-medium rounded-lg shadow-md 
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 hover:shadow-lg"
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

        <AnimatePresence>
          {story && (
            <motion.div
              className="mt-12 bg-white rounded-xl shadow-lg p-6 space-y-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <motion.h3
                className="text-2xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <BookOpen className="w-6 h-6 text-indigo-600" />
                Generated Story
              </motion.h3>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {[
                  { label: "Title", value: story.title },
                  { label: "Genre", value: story.genre },
                  { label: "Setting", value: story.setting },
                  { label: "Language", value: story.language },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="font-medium text-sm text-gray-500">
                      {item.label}
                    </p>
                    <p className="text-gray-800 mt-1">{item.value}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium text-sm text-gray-500">Short Idea</p>
                <p className="text-gray-800 mt-1">{story.short_idea}</p>
              </motion.div>

              <motion.div
                className="prose prose-indigo max-w-none mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="font-medium text-sm text-gray-500 mb-2">Story</p>
                <div
                  className="prose prose-lg text-gray-800 leading-relaxed prose-p:text-gray-600"
                  dangerouslySetInnerHTML={{ __html: story.text_story || "" }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default StoryGenerator;
