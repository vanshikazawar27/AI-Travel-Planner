# 🌍 WanderGo AI – Smart AI Travel Planner

WanderGo AI is a full-stack AI-powered travel planning platform that generates personalized travel itineraries based on a user's destination, budget, trip duration, and travel preferences.

Using Large Language Models (LLMs), WanderGo AI creates detailed day-by-day travel plans, helping users discover destinations, activities, accommodations, and travel recommendations within seconds.

---

## ✨ Features

### 🤖 AI-Powered Itinerary Generation
- Personalized travel plans generated using LLMs
- Destination-specific recommendations
- Day-wise itinerary breakdown
- Budget-aware travel suggestions
- Activity recommendations based on travel interests

### 👤 User Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes and user-specific data

### 💰 Expense Management
- Track travel expenses
- Organize trip budgets
- Manage trip spending efficiently

### 👥 Group Travel Planning
- Create and manage travel groups
- Collaborative trip organization
- Shared planning experience

### 📊 Dashboard Analytics
- Travel statistics and summaries
- Trip history management
- Personalized travel insights

### 🗺️ Maps Integration
- Location visualization
- Route planning utilities
- Interactive destination mapping

### 📄 PDF Export
- Download itineraries as PDF files
- Easy sharing and offline access

### 🔗 Shareable Trips
- Generate public trip links
- Share itineraries with friends and family
- Direct URL access for saved trips

### 🎨 Modern UI/UX
- Responsive design
- Glassmorphism-inspired interface
- Smooth animations with Framer Motion
- Mobile-friendly experience

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Vite
- Axios
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### AI Integration
- OpenRouter API
- Large Language Models (LLMs)

### Additional Tools
- Google Maps Integration
- PDF Generation
- REST APIs

---

## 📁 Project Structure

```bash
AI-Travel-Planner/
│
├── backend/
│   ├── config/
│   ├── db/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── context/
│   └── assets/
│
├── public/
├── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm
- MongoDB Atlas account
- OpenRouter API Key

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=5000 (optional, defaults to 5000)
```

Run the backend:

```bash
npm start
```

Backend runs on:

```bash
http://localhost:5000
```

---

## 💻 Frontend Setup

```bash
npm install
npm run dev
```

Optional: Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:5000
```

Frontend runs on:

```bash
http://localhost:5173 (or next available port)
```

---

## 🔄 Application Flow

1. User enters travel details
2. Frontend sends data to the backend
3. Backend creates an AI prompt
4. OpenRouter processes the request using an LLM
5. AI generates a structured travel itinerary
6. Backend returns the response
7. Frontend displays the generated travel plan

---

## 🔌 API Endpoints

| Route            | Description                    |
| ---------------- | ------------------------------ |
| `/api/trip`      | Trip generation and management |
| `/api/auth`      | User authentication            |
| `/api/groups`    | Group travel management        |
| `/api/expenses`  | Expense tracking               |
| `/api/dashboard` | Dashboard analytics            |
| `/api/map`       | Maps and location services     |

---

## 🌐 Deployment

### Frontend
- Vercel

### Backend
- Render

Environment Variables:

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 📸 Screenshots

Add screenshots of:

- Home Page
- Planner Page
- Generated Itinerary
- Dashboard
- Share Trip Feature

Example:

```md
![Home](screenshots/home.png)
![Planner](screenshots/planner.png)
![Result](screenshots/result.png)
```

---

## 🔮 Future Enhancements

- AI Trip Editing
- Real-Time Weather Integration
- Flight Price Tracking
- Hotel Booking Integration
- Collaborative Trip Planning
- Calendar Export
- Multi-language Support

---

## 👩‍💻 Author

**Vanshika Zawar**

- Full Stack Developer
- Passionate about AI-powered applications and modern web development

GitHub: https://github.com/vanshikazawar27

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and supports future development.

---

## 📄 License

This project is licensed under the MIT License.
