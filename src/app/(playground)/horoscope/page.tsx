"use client";

import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "@/app/context/ThemeContext";
import {
  Star,
  Moon,
  Sun,
  Sparkles,
  Loader2,
  Zap,
  MapPin,
  Battery,
  Cake,
  Globe2,
  Coffee,
} from "lucide-react";
import { MysticalLoader } from "@/app/components/MagicalLoaders";
// import { MagicalSparkles } from "@/app/components/MagicalSparkles";

interface HoroscopeData {
  predictionDetail: {
    bestTime: string;
    worstTime: string;
    advice: string[];
    luckyColor: string;
  };
}

const predictionTypes = [
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
  "Love",
  "Career",
  "Health",
  "Finance",
];

const zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export default function Horoscope() {
  const { isDarkMode } = useContext(ThemeContext);
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setHoroscope(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/horoscope", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate horoscope.");
      }

      const horoscopeData = await response.json();
      setHoroscope(horoscopeData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* <MagicalSparkles /> */}

      <AnimatePresence>{loading && <MysticalLoader />}</AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12 relative"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <motion.div
            className="inline-block mb-4"
            variants={{
              initial: { scale: 0, rotate: -180 },
              animate: {
                scale: 1,
                rotate: 0,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                },
              },
            }}
          >
            <motion.div
              whileHover={{
                rotate: 360,
                scale: 1.2,
                transition: { duration: 0.8 },
              }}
              className="relative"
            >
              <Star
                className={`w-16 h-16 ${
                  isDarkMode ? "text-blue-400" : "text-indigo-600"
                }`}
              />
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Star
                  className={`w-16 h-16 ${
                    isDarkMode ? "text-blue-400/50" : "text-indigo-600/50"
                  }`}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.h1 className="text-4xl font-bold mb-4" variants={fadeInUp}>
            Mystical Horoscope
          </motion.h1>

          <motion.p className="text-lg opacity-80" variants={fadeInUp}>
            Discover what the stars have in store for you
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className={`${
            isDarkMode
              ? "bg-gray-800/50 backdrop-blur-sm"
              : "bg-white/80 backdrop-blur-sm"
          } rounded-xl shadow-lg p-6 mb-8 relative overflow-hidden`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{
            transition: { duration: 0.3 },
          }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
                "linear-gradient(225deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-medium opacity-90">
                <div className="flex items-center gap-2 mb-2">
                  <Cake className="w-4 h-4" />
                  Day of Birth
                </div>
              </label>
              <select
                name="birthDay"
                required
                className={`w-full p-3 rounded-lg shadow-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-medium opacity-90">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4" />
                  Zodiac Sign
                </div>
              </label>
              <select
                name="zodiacSign"
                required
                className={`w-full p-3 rounded-lg shadow-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              >
                <option value="">Select your sign</option>
                {zodiacSigns.map((sign) => (
                  <option key={sign} value={sign}>
                    {sign}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-medium opacity-90">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </div>
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="Enter your location"
                className={`w-full p-3 rounded-lg shadow-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-medium opacity-90">
                <div className="flex items-center gap-2 mb-2">
                  <Battery className="w-4 h-4" />
                  Your Device Battery Level
                </div>
              </label>
              <input
                type="number"
                name="batteryLevel"
                required
                min="0"
                max="100"
                placeholder="Current battery level"
                className={`w-full p-3 rounded-lg shadow-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-medium opacity-90">
                <div className="flex items-center gap-2 mb-2">
                  <Globe2 className="w-4 h-4" />
                  Language
                </div>
              </label>
              <select
                name="language"
                required
                className={`w-full p-3 rounded-lg shadow-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              >
                <option value="en">English</option>
                <option value="id">Indonesia</option>
              </select>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-medium opacity-90">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" />
                  Lucky Number
                </div>
              </label>
              <input
                type="number"
                name="luckyNumber"
                required
                min="1"
                max="100"
                placeholder="Your lucky number"
                className={`w-full p-3 rounded-lg shadow-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-medium opacity-90">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee className="w-4 h-4" />
                  Favorite Food
                </div>
              </label>
              <input
                type="text"
                name="favoriteFood"
                required
                placeholder="Your favorite food"
                className={`w-full p-3 rounded-lg shadow-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-medium opacity-90">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-4 h-4" />
                  Prediction Type
                </div>
              </label>
              <select
                name="predictionType"
                required
                className={`w-full p-3 rounded-lg shadow-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              >
                <option value="">Select prediction type</option>
                {predictionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`mt-8 w-full sm:w-auto px-8 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 text-white font-medium relative overflow-hidden ${
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
                Reading the Stars...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Reveal Your Destiny</span>
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
                      "linear-gradient(45deg, rgba(255,255,255,0) 100%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 0%)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
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

          {horoscope && (
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 mb-6"
              >
                <Sun
                  className={`w-8 h-8 ${
                    isDarkMode ? "text-blue-400" : "text-indigo-600"
                  }`}
                />
                <h2 className="text-3xl font-bold">Your Cosmic Reading</h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg ${
                      isDarkMode
                        ? "bg-gradient-to-r from-purple-900/30 to-blue-900/30"
                        : "bg-gradient-to-r from-purple-50 to-blue-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles
                        className={`w-5 h-5 ${
                          isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                      <h3 className="text-lg font-semibold">Your Advice</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {horoscope.predictionDetail.advice.map((item, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`px-4 py-2 rounded-lg ${
                            isDarkMode
                              ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                              : "bg-purple-100 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    isDarkMode
                      ? "bg-gradient-to-r from-emerald-900/30 to-green-900/30"
                      : "bg-gradient-to-r from-emerald-50 to-green-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sun
                      className={`w-5 h-5 ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <h3 className="text-lg font-semibold">Best Time</h3>
                  </div>
                  <p>{horoscope.predictionDetail.bestTime}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    isDarkMode
                      ? "bg-gradient-to-r from-rose-900/30 to-red-900/30"
                      : "bg-gradient-to-r from-rose-50 to-red-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Moon
                      className={`w-5 h-5 ${
                        isDarkMode ? "text-red-400" : "text-red-600"
                      }`}
                    />
                    <h3 className="text-lg font-semibold">Worst Time</h3>
                  </div>
                  <p>{horoscope.predictionDetail.worstTime}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
