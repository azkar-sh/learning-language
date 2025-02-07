"use client";

import React, { useState, createContext } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Brain,
  BookOpen,
  Github,
  Linkedin,
  Mail,
  ArrowLeftCircle,
} from "lucide-react";
import PopQuiz from "@/app/(playground)/pop-quiz/page";
import StoryGenerator from "./(playground)/storyteller/page";

// Create theme context
export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const projects = [
    {
      id: "pop-quiz",
      title: "Pop Quiz Generator",
      description:
        "AI-powered quiz generator for interactive learning experiences",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: "storyteller",
      title: "AI Storyteller",
      description:
        "Creative storytelling platform powered by artificial intelligence",
      icon: <BookOpen className="w-6 h-6" />,
      // link: "/storyteller",
    },
  ];

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-blue-950 to-purple-950 text-white"
            : "bg-gradient-to-br from-white to-blue-100 text-gray-900"
        }`}
      >
        <nav className="fixed top-0 w-full p-6 z-50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              AI Playground
            </motion.h1>
            <div className="flex gap-2">
              {selectedProject && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-full ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } shadow-lg`}
                  onClick={() => setSelectedProject("")}
                >
                  <ArrowLeftCircle className="w-6 h-6" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                {isDarkMode ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </nav>

        <main className="pt-24 px-6">
          {selectedProject === "pop-quiz" ? (
            <PopQuiz />
          ) : selectedProject === "storyteller" ? (
            <StoryGenerator />
          ) : (
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  Welcome!
                </h2>
                <p className="text-xl opacity-80 max-w-2xl mx-auto">
                  Exploring the intersection of AI and web development through
                  innovative projects
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl shadow-lg cursor-pointer ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    }`}
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {project.icon}
                      <h3 className="text-2xl font-semibold">
                        {project.title}
                      </h3>
                    </div>
                    <p className="opacity-80 mb-4">{project.description}</p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`inline-block px-6 py-2 rounded-full ${
                        isDarkMode
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white font-medium`}
                    >
                      Explore Project
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center gap-6 py-8"
              >
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100"
                >
                  <Github className="w-6 h-6" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100"
                >
                  <Linkedin className="w-6 h-6" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="mailto:your.email@example.com"
                  className="opacity-80 hover:opacity-100"
                >
                  <Mail className="w-6 h-6" />
                </motion.a>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
