/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PreviousQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

interface Question {
  question_type: "multiple_choice" | "true_false";
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  topic: string;
  question: string;
  options: string[];
  correct_answer: string;
  correct_answer_reason?: string;
  previous_question?: PreviousQuestion;
}

interface ErrorMessage {
  error: string;
  code?: number;
}

function PopQuiz() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState<
    Omit<Question, "question" | "level_adjustment_reason">
  >({
    question_type: "multiple_choice",
    level: "beginner",
    language: "English",
    topic: "Grammar",
    options: [],
    correct_answer: "",
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<boolean | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);

  const generateNewQuestion = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/learning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          errorData = { error: `HTTP error! status: ${response.status}` };
        }
        throw new Error(errorData.error);
      }

      const data = await response.json();

      if ("error" in data) {
        setError({ error: data.error.message, code: data.error.code });
        setQuestion(null);
      } else {
        setQuestion(data);
        setSelectedOption(null);
        setAnswerStatus(null);
      }
    } catch (err: any) {
      console.error("Error generating question:", err);
      setError({ error: err.message, code: err.code });
      setQuestion(null);
      setAnswerStatus(null);
      setSelectedOption(null);
    } finally {
      setLoading(false);
    }
  };

  console.log(error);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Omit<Question, "question" | "level_adjustment_reason">
  ) => {
    setRequestData({ ...requestData, [field]: event.target.value });
  };

  const handleOptionSelect = (option: string) => {
    if (loading || selectedOption || !question) return;

    setSelectedOption(option);

    const isCorrect =
      option.toLowerCase() === question.correct_answer.toLowerCase();
    setAnswerStatus(isCorrect);

    if (isCorrect) {
      setCorrectAnswer((prev) => prev + 1);
    } else {
      setCorrectAnswer((prev) => prev - 1);
    }

    setTimeout(() => {
      if (isCorrect) {
        generateNewQuestion();
      }
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Learning Quiz
          </h1>
          <p className="text-lg text-gray-600">
            Test your knowledge and learn new concepts
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="question_type"
                className="block text-sm font-medium text-gray-700"
              >
                Question Type
              </label>
              <select
                id="question_type"
                value={requestData.question_type}
                onChange={(e) => handleInputChange(e, "question_type")}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True/False</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700"
              >
                Level
              </label>
              <select
                id="level"
                value={requestData.level}
                onChange={(e) => handleInputChange(e, "level")}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
                <option value="master">Master</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700"
              >
                Language
              </label>
              <select
                id="language"
                value={requestData.language}
                onChange={(e) => handleInputChange(e, "language")}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
              >
                <option value="English">English</option>
                <option value="Indonesia">Indonesia</option>
                <option value="French">French</option>
                <option value="Spain">Spain</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-gray-700"
              >
                Topic
              </label>
              <select
                id="topic"
                value={requestData.topic}
                onChange={(e) => handleInputChange(e, "topic")}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
              >
                <option value="grammar">Grammar</option>
                <option value="math">Math</option>
                <option value="history">History</option>
              </select>
            </div>
          </div>

          <motion.button
            onClick={generateNewQuestion}
            disabled={loading}
            className={`mt-6 w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Generating...
              </>
            ) : (
              "Generate Question"
            )}
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-md bg-red-50 p-4 mb-8"
            >
              <div className="flex">
                <XCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error.error}</div>
                </div>
              </div>
            </motion.div>
          )}

          {question && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-semibold text-gray-900 mb-6"
              >
                {question.question}
              </motion.h2>

              {question.options && question.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      disabled={loading || !!selectedOption}
                      className={`w-full text-left p-4 rounded-lg border-2 ${
                        selectedOption === option
                          ? answerStatus
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-indigo-500 hover:bg-indigo-50"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="absolute -top-8 -left-6">
                            <span
                              className={`text-4xl opacity-40 ${
                                selectedOption
                                  ? question.correct_answer === option
                                    ? "text-green-500"
                                    : "text-red-500"
                                  : ""
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </span>
                          </div>
                          <span className="text-lg">{option}</span>
                        </div>
                        {selectedOption && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            {question.correct_answer === option ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-500" />
                            )}
                          </motion.span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              <AnimatePresence>
                {selectedOption && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mt-6  ${
                      answerStatus ? "text-green-600 text-center text-xl" : ""
                    }`}
                  >
                    <p className="">
                      {answerStatus ? (
                        "Correct Answer! 🎉"
                      ) : (
                        <>
                          Explanation is <br />
                          <span className="font-bold">
                            {question.correct_answer_reason}
                          </span>
                        </>
                      )}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {correctAnswer > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 text-center"
            >
              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                Correct Answers: {correctAnswer}
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default PopQuiz;
