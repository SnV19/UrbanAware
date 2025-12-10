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
git clone <https://github.com/SnV19/UrbanAware>
cd urbanaware
```

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

Running the Project

Start backend (Node server using server.js):

```bash
cd backend
node server.js
```

Start frontend (React):

```bash
cd frontend
npm start
```

 Environment Variables (backend/.env):

```bash 
MONGO_URI=your_mongodb_atlas_url
PORT=5000
```



 ## 🛠 **Tech Stack**

- **React.js** – Frontend UI  
- **Node.js + Express.js** – Backend server  
- **MongoDB (Mongoose)** – Database  
- **Chart.js** – Trend visualizations  
- **Leaflet.js** – Interactive Delhi map  
- **Pixabay** – Audio assets  
- **Clideo + Canva** – Video & image editing tools  


## 📄 **License**

This project is released under a **Custom Restricted License**.  
You are allowed to **view** the code, but **copying, modifying, or redistributing** any part of this project **is strictly prohibited** without explicit permission from the author.


## 👤 Author

Developed by **Sneha** for academic and learning purposes.
