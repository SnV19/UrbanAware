import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";
import aqiData from "./aqiData"; // Hardcoded AQI
import helpDataJson from "./districtHelp.json"; // Your JSON file
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Custom marker icons for main map
const crimeIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [25, 25],
});

const healthIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [25, 25],
});

// Help popup markers
const hospitalIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [25, 25],
});

const policeIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [25, 25],
});

function App() {
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState(""); // crime/health/aqi
  const [selectedDate, setSelectedDate] = useState("");
  const [alertText, setAlertText] = useState("");
  const [chartData, setChartData] = useState(null);
  const [aqiValue, setAqiValue] = useState(null);

  // Popup modal
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(""); // "facts" or "instructions" or "help" or "aqi"
  const [topItem, setTopItem] = useState(""); // top crime/disease
  const [unitText, setUnitText] = useState(""); // cases/patients

  useEffect(() => {
    // Fetch district data from backend
    fetch("http://localhost:5000/api/districts")
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    setCategory("");
    setSelectedDate("");
    setAlertText("");
    setChartData(null);
    setShowPopup(false);
    setAqiValue(null);
  }, [searchTerm]);

  const filteredDistricts = searchTerm
    ? districts.filter((d) =>
        d.District.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : districts;

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    setSelectedDate(""); 
    setAlertText("");
    setChartData(null);
    setShowPopup(false);

    if (value === "aqi") {
      // Hard-coded AQI lookup
      if (!searchTerm) {
        alert("⚠️ Please enter a district first!");
        setCategory("");
        return;
      }

      const districtKey = Object.keys(aqiData).find(
        (key) => key.toLowerCase() === searchTerm.toLowerCase()
      );

      if (!districtKey) {
        alert("⚠️ AQI data not found for this district!");
        setCategory("");
        return;
      }

      const valueAQI = aqiData[districtKey].aqi;
      setAqiValue(valueAQI);
      setPopupType("aqi");
      setShowPopup(true);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (!searchTerm) {
      alert("⚠️ Please enter a district first!");
      setSelectedDate("");
      return;
    }
    if (!category) return;

    const district = districts.find(
      (d) => d.District.toLowerCase() === searchTerm.toLowerCase()
    );
    if (!district) {
      alert("⚠️ District not found in database!");
      return;
    }

    let totalCount = 0;
    let tempTopItem = "";
    let tempUnit = "";

    if (category === "crime") {
      const crimes = [
        { name: "Murder", value: district.Murder || 0 },
        { name: "Rape", value: district.Rape || 0 },
        { name: "Theft", value: district.Theft || 0 },
      ];
      const topCrime = crimes.reduce((a, b) => (a.value > b.value ? a : b));
      tempTopItem = topCrime.name;
      totalCount = topCrime.value;
      tempUnit = "cases";
    } else if (category === "health") {
      const diseases = [
        { name: "Dengue", value: district.Dengue || 0 },
        { name: "Malaria", value: district.Malaria || 0 },
        { name: "COVID19", value: district.COVID19 || 0 },
      ];
      const topDisease = diseases.reduce((a, b) => (a.value > b.value ? a : b));
      tempTopItem = topDisease.name;
      totalCount = topDisease.value;
      tempUnit = "patients";
    }

    setTopItem(tempTopItem);
    setUnitText(tempUnit);

    const dt = new Date(date);
    const month = dt.toLocaleString("default", { month: "short" });
    const lastDay = dt.getDate();
    const lastWeekStart = Math.max(1, lastDay - 6); 
    const lastWeek = `${lastWeekStart}-${lastDay} ${month}`;

    setAlertText(
      `🗓️ Last week (${lastWeek}): "${tempTopItem}" is the major concern in ${searchTerm} with a total of ${totalCount} ${tempUnit} as of ${date}.`
    );

    const allWeeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const selectedWeekIndex = Math.min(Math.floor((lastDay - 1) / 7), 3); 
    const weeks = allWeeks.slice(0, selectedWeekIndex + 1);

    const dataPoints = weeks.map(() =>
      Math.floor(totalCount / weeks.length + Math.random() * 5)
    );

    setChartData({
      labels: weeks,
      datasets: [
        {
          label: tempTopItem,
          data: dataPoints,
          borderColor: category === "crime" ? "red" : "blue",
          backgroundColor: "transparent",
        },
      ],
    });
  };

  const handlePopupClick = (type) => {
    if (!topItem) {
      alert("⚠️ Please select a date and category first!");
      return;
    }
    setPopupType(type);
    setShowPopup(true);
  };

  const handleHelpClick = () => {
    if (!searchTerm) {
      alert("⚠️ Please enter a district first!");
      return;
    }
    const districtKey = Object.keys(helpDataJson).find(
      key => key.toLowerCase().trim() === searchTerm.toLowerCase().trim()
    );
    if (!districtKey) {
      alert("⚠️ No help data found for this district!");
      return;
    }
    setPopupType("help");
    setShowPopup(true);
  };

  const renderMedia = () => {
    if (popupType === "help") {
      const districtKey = Object.keys(helpDataJson).find(
        key => key.toLowerCase().trim() === searchTerm.toLowerCase().trim()
      );
      const districtInfo = districtKey ? helpDataJson[districtKey] : null;
      if (!districtInfo) return null;

      return (
        <div style={{ fontFamily: "Comic Sans MS", color: "white" }}>
          <h4>🏥 Hospital</h4>
          <p><b>Name:</b> {districtInfo.hospital.name}</p>
          <p><b>Address:</b> {districtInfo.hospital.address}</p>
          <p><b>Phone:</b> {districtInfo.hospital.phone}</p>

          <h4>👮 Police Station</h4>
          <p><b>Name:</b> {districtInfo.police_station.name}</p>
          <p><b>Address:</b> {districtInfo.police_station.address}</p>
          <p><b>Phone:</b> {districtInfo.police_station.phone}</p>

          <div style={{ height: "250px", marginTop: "10px" }}>
            <MapContainer
              center={[
                (districtInfo.hospital.latitude + districtInfo.police_station.latitude) / 2,
                (districtInfo.hospital.longitude + districtInfo.police_station.longitude) / 2
              ]}
              zoom={13}
              style={{ height: "100%", width: "100%", borderRadius: "8px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker
                position={[districtInfo.hospital.latitude, districtInfo.hospital.longitude]}
                icon={hospitalIcon}
              >
                <Popup>{districtInfo.hospital.name}</Popup>
              </Marker>
              <Marker
                position={[districtInfo.police_station.latitude, districtInfo.police_station.longitude]}
                icon={policeIcon}
              >
                <Popup>{districtInfo.police_station.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      );
    } else if (popupType === "facts") {
      const imageList = [];
      for (let i = 1; i <= 20; i++) {
        imageList.push(`img${i}.png`);
      }
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {imageList.map((file, idx) => (
            <img
              key={idx}
              src={`/media/facts/${category}/${topItem}/${file}`}
              alt={`${topItem} ${idx}`}
              style={{ width: "150px", borderRadius: "8px", cursor: "pointer" }}
              onDoubleClick={(e) => { if (e.target.requestFullscreen) e.target.requestFullscreen(); }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ))}
        </div>
      );
    } else if (popupType === "instructions") {
  const videoList = ["video1.mp4", "video2.mp4", "video3.mp4", "video4.mp4", "video5.mp4"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "12px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {videoList.map((file, idx) => (
        <video
          key={idx}
          src={`/media/instructions/${category}/${topItem}/${file}`}
          controls
          style={{
            maxWidth: "320px",
            maxHeight: "240px",
            width: "auto",
            height: "auto",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            backgroundColor: "#000",
            display: "none", // default hidden until loaded
          }}
          onLoadedData={(e) => {
            e.target.style.display = "block"; // show when video exists
          }}
          onError={(e) => {
            e.target.style.display = "none"; // hide if file missing
          }}
        />
      ))}
    </div>
  );



    } else if (popupType === "aqi") {
      if (aqiValue === null) return <p>Loading AQI...</p>;
      let bgColor = "green";
      if (aqiValue <= 100) bgColor = "green";
      else if (aqiValue <= 200) bgColor = "orange";
      else bgColor = "red";

      return (
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            padding: "30px 50px",
            backgroundColor: bgColor,
            color: "white",
            fontSize: "30px",
            fontFamily: "Comic Sans MS",
            borderRadius: "12px",
            fontWeight: "bold",
            marginBottom: "20px"
          }}>
            AQI: {aqiValue}
          </div>
          <video
            src="/media/aqi/video1.mp4"
            controls
            style={{ width: "100%", maxWidth: "600px", borderRadius: "8px" }}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app-container">
      {/* Left side: Map */}
      <div className="map-section">
        <h2 className="map-title">🗺️ Delhi Risk Map</h2>
        <div className="map-box">
          <MapContainer
            center={[28.6139, 77.209]}
            zoom={11}
            style={{ height: "400px", width: "100%", borderRadius: "10px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {filteredDistricts.map((d, i) => {
              const lat = d.Latitude || d.latitude;
              const lon = d.Longitude || d.longitude;
              if (!lat || !lon) return null;

              const isCrime =
                (d.Murder || 0) + (d.Rape || 0) + (d.Theft || 0) >
                (d.Dengue || 0) + (d.Malaria || 0) + (d.COVID19 || 0);

              return (
                <Marker
                  key={i}
                  position={[lat, lon]}
                  icon={isCrime ? crimeIcon : healthIcon}
                >
                  <Popup>
                    <b>{d.District}</b>
                    <br />
                    {isCrime ? "⚠️ High Crime Area" : "🏥 Health Concern"}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Right side: Info section */}
      <div className="info-section">
        <h3>UrbanAware Dashboard</h3>
        <p>Monitor Delhi’s top risk areas for health and crime in real-time.</p>

        <input
          type="text"
          className="search-bar"
          placeholder="Search district..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div style={{ marginTop: "20px", fontFamily: "Comic Sans MS", fontSize: "18px", fontWeight: "bold", color: "white" }}>
          <label style={{ marginRight: "20px" }}>
            <input type="radio" value="crime" checked={category === "crime"} onChange={handleCategoryChange} /> Crime
          </label>
          <label style={{ marginRight: "20px" }}>
            <input type="radio" value="health" checked={category === "health"} onChange={handleCategoryChange} /> Health
          </label>
          <label>
            <input type="radio" value="aqi" checked={category === "aqi"} onChange={handleCategoryChange} /> AQI
          </label>
        </div>

        {category && category !== "aqi" && (
          <div style={{ marginTop: "15px" }}>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                fontFamily: "Comic Sans MS",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            />
          </div>
        )}

        {alertText && (
          <div style={{ marginTop: "20px", fontWeight: "bold", fontFamily: "Comic Sans MS", fontSize: "16px", color: "white" }}>
            {alertText}
          </div>
        )}

        {chartData && (
          <div style={{ marginTop: "20px", width: "100%", maxWidth: "400px" }}>
            <Line data={chartData} />
          </div>
        )}

        {chartData && (
          <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
            <button
              onClick={() => handlePopupClick("facts")}
              style={{
                padding: "20px 20px",
                borderRadius: "50px",
                border: "none",
                backgroundColor: "white",
                color: "darkblue",
                fontFamily: "Comic Sans MS",
                fontWeight: "bold",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              Facts
            </button>
            <button
              onClick={() => handlePopupClick("instructions")}
              style={{
                padding: "20px 20px",
                borderRadius: "50px",
                border: "none",
                backgroundColor: "white",
                color: "darkblue",
                fontFamily: "Comic Sans MS",
                fontWeight: "bold",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              Instructions
            </button>
            <button
              onClick={handleHelpClick}
              style={{
                padding: "20px 20px",
                borderRadius: "50px",
                border: "none",
                backgroundColor: "white",
                color: "darkblue",
                fontFamily: "Comic Sans MS",
                fontWeight: "bold",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              Help
            </button>
          </div>
        )}

        {showPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              overflowY: "auto",
              padding: "20px",
            }}
            onClick={() => setShowPopup(false)}
          >
            <div
              style={{ 
                backgroundColor: "#1a1a1a", 
                padding: "20px", 
                borderRadius: "12px", 
                maxWidth: "800px", 
                width: "100%",
                color: "white"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontFamily: "Comic Sans MS", marginBottom: "15px" }}>
                {popupType === "facts" ? "Facts" : popupType === "instructions" ? "Instructions" : popupType === "help" ? "Help" : "AQI"}
                {popupType !== "help" && popupType !== "aqi" ? ` for ${topItem}` : ""}
              </h3>
              {renderMedia()}
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  marginTop: "20px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "white",
                  color: "darkblue",
                  fontFamily: "Comic Sans MS",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
