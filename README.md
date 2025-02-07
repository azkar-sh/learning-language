# Learning Quiz

A full-stack web application built using **Next.js (React)** for the frontend and a **backend API** to generate and evaluate **learning quiz** and **storytelling** dynamically.

## Features

- Generate **multiple-choice** and **true/false** quiz questions.
- Supports different **difficulty levels** (Beginner to Master).
- Choose from multiple **languages** (English, Indonesian, Arabic, etc.).
- Interactive UI with animations using **Framer Motion**.
- Generate story based on preference (**You can add your idea too!**)
- Responsive and modern **UI/UX**.
- Real-time answer validation and scoring system.

## Tech Stack

### Frontend

- **Next.js (React)** – Server-side rendering and client-side interactivity.
- **TypeScript** – Type safety for better code reliability.
- **Tailwind CSS** – Modern styling with utility classes.
- **Framer Motion** – Smooth animations and transitions.
- **Lucide Icons** – Clean and simple UI icons.

### Backend

- **Node.js** with **Next.js API Routes** – Handles question generation.
- **Fetch API** – For client-server communication.

## Installation & Setup

### Prerequisites

Ensure you have **Node.js** and **npm** (or **yarn**) installed on your machine.

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/azkar-sh/learning-quiz.git
   cd learning-quiz
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Set up environment variables:
   Create a `.env` file and add your Groq API key:
   ```sh
   GROQ_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```sh
   npm run dev  # or yarn dev
   ```
5. Open **http://localhost:3000/** in your browser.

## Future Improvements

- Add a database for storing user progress.
- Implement authentication for personalized experiences.
- Support AI-generated questions.

## License

This project is **open-source** and available for learning purposes.

---

### Want to collaborate or give feedback?

Feel free to reach out or contribute to the repository!
