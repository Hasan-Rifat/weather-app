import React, { useState, useEffect } from "react";

const LocationComponent = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Call the function to fetch location details
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setErrorMessage("Error: " + error.message);
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      {latitude && longitude ? (
        <div>
          Latitude: {latitude} <br />
          Longitude: {longitude}
        </div>
      ) : (
        <div>{errorMessage || "Fetching location..."}</div>
      )}
    </div>
  );
};

export default LocationComponent;
