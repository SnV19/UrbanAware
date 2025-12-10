# UrbanAware Dashboard

A web-based interactive dashboard for monitoring **Crime**, **Health**, and **Air Quality (AQI)** trends across Delhi.  
Includes real-time insights, awareness tools, and location-based support using Leaflet maps.

---

## 🚀 Features

- **District Search Box** – Search and select Delhi districts manually.
- **Category Menu** – Crime, Health, AQI switching.
- **Trend Line Graph** – Weekly trends for chosen category.
- **AI Insight Box** – Auto-generated summary of recent data.
- **Facts Menu** – Awareness images and fact cards.
- **Instructions Menu** – Prevention, cure, and safety videos.
- **Help Menu** – Police stations & hospital addresses + map markers.

---

## 📦 Installation

Clone the repository:
```bash
git clone <your-repo-url>
cd urbanaware
```

Install backend dependencies:

cd backend
npm install


Install frontend dependencies:

cd ../frontend
npm install

##▶ Running the Project

Start backend (Node server using server.js):

cd backend
node server.js


Start frontend (React):

cd frontend
npm start

🔧 Environment Variables (backend/.env)
MONGO_URI=your_mongodb_atlas_url
PORT=5000

##📚 Project Structure
urbanaware/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── assets/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── server.js
│   └── .env
│
└── README.md

##🛠 Tech Stack

React.js
Node.js + Express.js
MongoDB (Mongoose)
Chart.js
Leaflet.js
Pixabay (audio)
Clideo + Canva (videos/images)

📄 License

This project uses a Custom Restricted License.
Viewing is allowed, but copying or redistributing the code is not permitted without permission.

## 👤 Author

Developed by **Sneha** for academic and learning purposes.
