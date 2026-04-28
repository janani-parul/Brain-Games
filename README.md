# 🧠 Brain Games Platform

An interactive, responsive, and visually stunning web application featuring a collection of brain-training games. Designed with a premium dark-mode aesthetic and glassmorphism effects, this platform offers a complete progression journey for players of all ages.

## 🎮 The Games

### 1. General Knowledge (GK) Quiz
Test your knowledge with dynamic multiple-choice questions!
*   **Bilingual Support**: Play in **English** (fetching infinite dynamic questions from the Open Trivia API) or **Tamil** (using a curated, randomized local dataset).
*   **Fixed Scoring**: Earn exactly 5 points for every correct answer.
*   **Time Limit**: 15 seconds per question.

### 2. Memory Matrix
Train your visual memory and pattern recognition.
*   A 4x4 grid containing 8 pairs of hidden cards.
*   Flip cards to find matching pairs.
*   Tracks your total moves to complete the matrix.
*   *Unlock condition: Complete the GK Quiz.*

### 3. Math Sprint
A rapid-fire arithmetic challenge to test your calculation speed.
*   Dynamically generated addition, subtraction, and multiplication problems.
*   **Time Limit**: 8 seconds per question.
*   *Unlock condition: Complete the Memory Matrix.*

## ✨ Key Features

*   **Progression System**: Your progress is automatically saved using your browser's `localStorage`. You must beat games sequentially to unlock the next challenge.
*   **Anti-Cheat Pause System**: Need a break? Hit the "Pause" button. To keep things fair, the game screen (questions, options, or memory cards) is temporarily hidden while paused so players cannot cheat the timer.
*   **Premium UI/UX**: Built with modern CSS techniques including neon glows, smooth micro-animations, and a cohesive dark theme.
*   **Fully Responsive**: Playable on desktop, tablet, and mobile devices.

## 🚀 How to Play Locally

Since this is a client-side static web application, no complex build tools or servers are required!

1. Clone this repository:
   ```bash
   git clone https://github.com/janani-parul/Brain-Games.git
   ```
2. Open the project folder.
3. Simply double-click `index.html` to open it in your favorite web browser and start playing!

## 🛠️ Technology Stack
*   **HTML5** - Semantic structure
*   **Vanilla CSS3** - Styling, animations, and responsive design (no external frameworks used)
*   **Vanilla JavaScript (ES6)** - Game logic, DOM manipulation, API fetching, and `localStorage` state management.
*   **Open Trivia Database API** - Used for dynamic English trivia questions.

---
*Created with ❤️ by Jaan*

