# 🎓 StudyFlow Server

> **The Ultimate AI-Powered Ecosystem for Student Success & Wellness**

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-v7-black.svg)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**StudyFlow** is a comprehensive digital campus designed to revolutionize how students learn, collaborate, and grow. By fusing **Cognitive Science**, **Mental Wellness**, and **Generative AI**, StudyFlow creates a personalized environment where academic success meets mental health.

---

## 🚀 Key Features

### 🤖 Advanced AI Integration (Google Gemini)
*   **AI Chat Assistant**: integrated AI chatbot for instant study help and concept clarification.
*   **AI Voice Viva**: Mock oral exams with real-time feedback on confidence and accuracy.
*   **AI Recommendations**: Personalized study suggestions based on performance and learning style.
*   **Adaptive Study Planner**: AI-generated schedules that adapt to your progress and burnout levels.

### 🎮 Gamification (StudyRPG)
*   **XP & Leveling System**: Earn XP for focusing, completing tasks, and maintaining streaks.
*   **Leaderboards**: Compete globally or with friends.
*   **Badges & Achievements**: Unlock rewards for milestones like "Deep Work" or "Early Riser".

### 📚 Smart Study Management
*   **Rich Resource Management**: Support for **PDFs**, **YouTube Videos** (with auto-duration), **Articles**, and **Google Drive** links.
*   **Reading Materials**: Upload and manage resources with **ImageKit** integration for files.
*   **Notes Marketplace**: Share, rate, and discover high-quality notes from the community.
*   **Study Plans & Tasks**: Structured planning with progress tracking.
*   **Technique Mastery**: Built-in timers for Pomodoro, Feynman, and Blurting methods.

### 🧘 Wellness & Balance
*   **Holistic Tracking**: Monitor stress, sleep, and mood.
*   **Habit Challenges**: Join 21-day challenges for better lifestyle habits.
*   **Bio-Feedback**: Smart suggestions for breathing exercises when stress is high.

### ⚡ Real-Time & Collaboration
*   **Study Groups**: Collaborate with peers in real-time.
*   **Live Notifications**: Instant updates for reminders, exam alerts, and group activities via **Socket.io**.

### �️ Security & Role-Based Access
*   **Secure Auth**: JWT-based authentication with Refresh Tokens.
*   **RBAC**: Granular permissions for Users, Moderators, and Admins.

---

## 🛠️ Technology Stack

*   **Runtime**: Node.js & Express.js
*   **Language**: TypeScript (Strict Mode)
*   **Database**: PostgreSQL (via Neon/Supabase)
*   **ORM**: Prisma ORM (v7)
*   **AI Engine**: Google Gemini Pro (Multimodal)
*   **Real-time**: Socket.io & WS
*   **Storage**: ImageKit (PDFs/Images)
*   **Email**: Nodemailer
*   **Validation**: Zod
*   **Auth**: BCrypt & JWT

---

## ⚡ Getting Started

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL Database
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/emtiazahmed/studyflow-server.git
    cd studyflow-server
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    DATABASE_URL="postgresql://user:pass@host:port/db"
    JWT_SECRET="your_jwt_secret"
    JWT_REFRESH_SECRET="your_refresh_secret"
    BCRYPT_SALT_ROUNDS=12
    GEMINI_API_KEY="your_google_ai_key"
    IMAGEKIT_PUBLIC_KEY="your_public_key"
    IMAGEKIT_PRIVATE_KEY="your_private_key"
    IMAGEKIT_URL_ENDPOINT="your_url_endpoint"
    EMAIL_USER="your_email@gmail.com"
    EMAIL_USER="your_email@gmail.com"
    EMAIL_PASS="your_app_password"
    YOUTUBE_API_KEY="your_youtube_api_key_for_duration_fetching"
    ```

4.  **Database Migration**
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 📚 API Documentation Overview

### 🔐 Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | User login |
| `POST` | `/api/v1/auth/refresh-token` | Refresh access token |

### 🤖 AI Features
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/ai-chat/start` | Start new chat session |
| `POST` | `/api/v1/ai-chat/message` | Send message to AI |
| `GET` | `/api/v1/ai-chat/:id` | Get chat history |
| `POST` | `/api/v1/ai-viva/start` | Start AI Oral Exam |
| `POST` | `/api/v1/ai-viva/response` | Submit answer for feedback |
| `POST` | `/api/v1/ai-viva/end` | End exam & get report |
| `GET` | `/api/v1/ai-recommendations` | Get suggestions |
| `POST` | `/api/v1/ai-recommendations/generate` | Force regenerate suggestions |

### 📚 Resource Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/reading-materials` | Add material (PDF/Link/YouTube) |
| `GET` | `/api/v1/reading-materials` | Get all materials |
| `GET` | `/api/v1/reading-materials/:id` | Get specific material |
| `DELETE` | `/api/v1/reading-materials/:id` | Delete material |
| `GET` | `/api/v1/notes` | Get Notes |
| `GET` | `/api/v1/subjects` | Get Subjects |

### 🎮 Gamification
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/gamification/my-stats` | Get User XP & Level |
| `GET` | `/api/v1/gamification/leaderboard` | Global Leaderboard |

### � Study Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/study-plans` | Create Study Plan |
| `POST` | `/api/v1/study-tasks` | Add Task |
| `GET` | `/api/v1/class-schedules` | Get Class Routine |
| `GET` | `/api/v1/exams` | Get Exam Schedule |
| `GET` | `/api/v1/courses` | List Courses |

### 🧘 Wellness & Habits
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/wellness` | Get Wellness Logs |
| `POST` | `/api/v1/wellness/activity` | Log Activity (Sleep/Mood) |
| `GET` | `/api/v1/habit-challenges` | Get Active Challenges |
| `GET` | `/api/v1/daily-routines` | Get Daily Routine |

### 👥 Collaboration & Finance
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/study-groups` | Create Study Group |
| `GET` | `/api/v1/study-groups` | Get My Groups |
| `GET` | `/api/v1/finance/budgets` | Get Budgets |

*(Note: All endpoints are prefixed with `/api/v1`)*

---

## 🤝 Contribution

We welcome contributions! Please fork the repository and submit a pull request for review.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
