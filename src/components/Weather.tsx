import React, { useState, useEffect } from "react";
import axios from "axios";

interface WeatherData {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

interface CurrentWeatherData {
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
}

const WeatherApp: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);
  const [location, setLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [currentWeather, setCurrentWeather] =
    useState<CurrentWeatherData | null>(null);

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation(`${latitude},${longitude}`);
          fetchCityName(latitude, longitude);
          fetchCurrentWeather(latitude, longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchCityName = async (latitude: number, longitude: number) => {
    try {
      const apiKey = "92a5db60bdc94ad486960220231906";
      const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;

      const response = await axios.get(apiUrl);
      setLocation(response.data.location.name);
    } catch (error) {
      console.error("Error fetching city name:", error);
    }
  };

  const fetchWeatherData = async () => {
    try {
      const apiKey = "92a5db60bdc94ad486960220231906";
      const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=16`;

      const response = await axios.get(apiUrl);
      const { forecast } = response.data;

      const last7Days = forecast.forecastday.slice(0, 7);
      const next7Days = forecast.forecastday.slice(8, 16);

      const weatherData = [...last7Days, ...next7Days];
      setWeatherData(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchCurrentWeather = async (latitude: number, longitude: number) => {
    try {
      const apiKey = "92a5db60bdc94ad486960220231906";
      const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;

      const response = await axios.get(apiUrl);
      setCurrentWeather(response.data.current);
    } catch (error) {
      console.error("Error fetching current weather:", error);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  return (
    <div className="w-full h-full flex items-center bg-gradient-to-tl from-green-600 to-green-400 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Weather App</h1>
        {/* search  */}
        <div className="mb-8 text-center">
          <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
            <div className="grid place-items-center h-full w-12 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
              type="text"
              id="search"
              value={location}
              onChange={handleLocationChange}
              placeholder="Search something.."
            />
          </div>
        </div>

        {currentWeather && (
          <div className="bg-gray-200 p-4 mb-8 text-center rounded-lg shadow-lg">
            <div className="p-4 bg-gray-800 text-white">
              <h2 className="text-xl mb-4">Current Weather in {location}</h2>
              <p>Temperature: {currentWeather.temp_c}°C</p>
              <p>Condition: {currentWeather.condition.text}</p>
              <img
                src={currentWeather.condition.icon}
                alt="Weather Icon"
                className="mx-auto mt-4"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 ">
          <div className="bg-gray-200 p-4 mb-8 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4 text-gray-800">Last 7 Days Weather</h2>
            {weatherData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {weatherData.slice(0, 7).map((data) => (
                  <div className="bg-gray-800 text-white p-4" key={data.date}>
                    <h3>{data.date}</h3>
                    <p>Max Temperature: {data.day.maxtemp_c}°C</p>
                    <p>Min Temperature: {data.day.mintemp_c}°C</p>
                    <p>Condition: {data.day.condition.text}</p>
                    <img
                      src={data.day.condition.icon}
                      alt="Weather Icon"
                      className="mx-auto"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-200 p-4 mb-8 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4 text-gray-800">Next 7 Days Weather</h2>
            {weatherData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {weatherData.slice(7, 14).map((data) => (
                  <div className="bg-gray-800 text-white p-4" key={data.date}>
                    <h3>{data.date}</h3>
                    <p>Max Temperature: {data.day.maxtemp_c}°C</p>
                    <p>Min Temperature: {data.day.mintemp_c}°C</p>
                    <p>Condition: {data.day.condition.text}</p>
                    <img
                      src={data.day.condition.icon}
                      alt="Weather Icon"
                      className="mx-auto"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
