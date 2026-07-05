<<<<<<< HEAD
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b9856ffd-c7c9-428f-a334-ec9af9df4ec3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
=======
# 🎯 AI-Based Placement Tracker

An AI-powered web application that helps engineering students track their placement progress, practice technical assessments, and get personalized improvement insights — all in one place.
---

## 📖 Overview

**Placement Tracker AI** empowers students to prepare for campus placements by combining:
- A structured practice suite (Aptitude, SQL, Coding)
- AI-generated questions using **Google Gemini**
- Automatic score tracking and daily progress logging
- A clean, modern dashboard to monitor readiness

---

## ✨ Features

- 🔐 **User Authentication** — Secure login and registration for students
- 🧠 **Practice Suite** — Three categories of tests:
  - **Aptitude** – MCQ-driven logic and reasoning questions
  - **SQL** – Query-writing practice with automatic answer grading
  - **Coding** – Problem-solving with implementation submission
- 🤖 **AI-Powered Question Generation** — Uses the Gemini API to dynamically generate practice questions
- 📊 **Automatic Score Tracking** — Scores are logged into daily progress automatically
- 📈 **Progress Dashboard** — Visual overview of skills, assessments, and placement readiness
- 🎯 **Personalized Roadmap** — Recommendations based on individual performance

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- JavaScript / JSX
- CSS / Tailwind CSS

**Backend**
- Java + Spring Boot
- Maven

**AI Integration**
- Google Gemini API (`gemini-2.0-flash`)

**Other**
- REST API architecture
- Environment-based configuration (`.env` / `application.properties`)

---

## 📂 Project Structure

```
AI-based Placement Tracker/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/        # Java source code (controllers, services, config)
│   │       └── resources/   # application.properties, static resources
│   └── pom.xml
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── api/              # API call helpers
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/             # Page-level components (Login, Dashboard, Tests)
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher) and npm
- **Java JDK** (v17 or higher)
- **Maven**
- A **Google Gemini API key** ([Get one here](https://aistudio.google.com/apikey))

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-based-placement-tracker.git
cd ai-based-placement-tracker
```

### 2. Backend Setup
```bash
cd backend
```
Add your Gemini API key to `src/main/resources/application.properties`:
```properties
gemini.api.key=YOUR_GEMINI_API_KEY_HERE
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
server.port=8080
```

Run the backend:
```bash
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend/` folder:
```env
VITE_API_BASE_URL=http://localhost:8080
```

Run the frontend:
```bash
npm run dev
```
The app will be available at `http://localhost:5173` (or the port shown in your terminal).

---

## 🔑 Environment Variables

| Location | Variable | Description |
|----------|----------|--------------|
| `backend/src/main/resources/application.properties` | `gemini.api.key` | Your Google Gemini API key |
| `backend/src/main/resources/application.properties` | `server.port` | Backend server port (default: 8080) |
| `frontend/.env` | `VITE_API_BASE_URL` | Base URL of the backend API |

> ⚠️ Never commit `.env` files or API keys to version control. Ensure they are listed in `.gitignore`.

---

## 📸 Screenshots

*(Add screenshots of your Login page, Dashboard, and Practice Suite here)*

| Login Page | Practice Suite | Dashboard |
|------------|-----------------|------------|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## 🗺️ Roadmap

- [ ] Add resume analysis using AI
- [ ] Add company-wise placement statistics
- [ ] Add leaderboard for peer comparison
- [ ] Add email notifications for daily practice reminders
- [ ] Mobile-responsive UI improvements

---

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**R. Shanmugapriya**
- Email: shanmugapriy2006.45@gmail.com

---

⭐ If you found this project helpful, consider giving it a star on GitHub!
>>>>>>> 1acf9ff283d696d2b22c06840bfc5a91982bc05a
