import React, { useState, useEffect } from "react";
import axios from "axios";

interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    localtime: string;
    localtime_epoch: number;
    lon: number;
    region: string;
    tz_id: string;
  };
  current: {
    temp_c: number;
    humidity: number;
    wind_kph: number;
  };
}

const WeatherApp: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const fetchWeatherData = async () => {
    try {
      const apiKey = "92a5db60bdc94ad486960220231906";
      const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

      const response = await axios.get<WeatherData>(apiUrl);
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={handleLocationChange}
      />

      {weatherData ? (
        <div>
          <h2>Current Weather: {weatherData.location.name}</h2>
          <p>country: {weatherData.location.country} </p>
          <p>lat : {weatherData.location.lat}</p>

          <p>Temperature: {weatherData.current.temp_c}°C</p>
          <p>Humidity: {weatherData.current.humidity}%</p>
          <p>Wind Speed: {weatherData.current.wind_kph} km/h</p>
        </div>
      ) : (
        <p>No weather data available.</p>
      )}
    </div>
  );
};

export default WeatherApp;
