import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Wand2, Stars, Moon } from "lucide-react";
import { ThemeContext } from "@/app/context/ThemeContext";

export const MysticalLoader = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <motion.div
      className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${
          isDarkMode ? "bg-gray-800/90" : "bg-white/90"
        } p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 relative overflow-hidden`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 ${
                  isDarkMode ? "bg-blue-400" : "bg-indigo-600"
                } rounded-full`}
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 45}deg) translateY(-20px)`,
                }}
              />
            ))}
          </motion.div>
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: {
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <Wand2
              className={`w-12 h-12 ${
                isDarkMode ? "text-blue-400" : "text-indigo-600"
              }`}
            />
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [-10, 10],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <Stars
              className={`w-6 h-6 ${
                isDarkMode ? "text-blue-400" : "text-indigo-600"
              }`}
            />
          </motion.div>
          <motion.span
            className={`text-lg font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Reading the celestial signs
          </motion.span>
          <motion.div
            animate={{
              rotate: [10, -10],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <Moon
              className={`w-6 h-6 ${
                isDarkMode ? "text-blue-400" : "text-indigo-600"
              }`}
            />
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${
                isDarkMode ? "bg-blue-400" : "bg-indigo-600"
              } rounded-full`}
              initial={{
                opacity: 0,
                scale: 0,
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
