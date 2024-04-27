import { useState, useEffect } from "react";
import humidityImg from './assets/humidity.png';
import cloudImg from './assets/cloud.png'
import windImg from './assets/wind.png'
import tempImg from './assets/temp.png'
import loadingGif from './assets/loading.gif'


function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading]= useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
          if (!response.ok) {
            throw new Error("Unable to fetch weather data");
          }
          const data = await response.json();
          setWeatherData(data);
          setCity(data.name);
          setError(null);
          setLoading(false)
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const API_KEY = "20c4bd51cf84f12ebda1a2d7f69862bc";

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      fetchWeatherData();
    }
  };

  if(loading){
    return (
      <div className="min-h-screen flex justify-center items-center">
        <img src={loadingGif} alt="Loading..." className="w-32 h-32" />
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <header className="bg-blue-500 text-white text-center py-4 w-full">
          <h1 className="text-3xl font-bold">Weather App</h1>
        </header>
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <form onSubmit={handleSearch} className="flex items-center justify-center mb-8">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-r-lg px-6 py-2 ml-1 hover:bg-blue-600 transition duration-300"
            >
              Search
            </button>
          </form>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {weatherData && (
            <div className="bg-white rounded-lg shadow-lg p-8 w-full">
              <h2 className="text-2xl font-bold mb-4">{weatherData.name}</h2>
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="flex items-center mb-4">
                  <img src={cloudImg} alt="Weather Icon" className="w-16 h-16 mr-4" />
                  <p className="text-xl">{weatherData.weather[0].description}</p>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div className="flex items-center mb-4 md:mr-4">
                    <img src={humidityImg} alt="Humidity Icon" className="w-6 h-6 mr-2" />
                    <p>Humidity: {weatherData.main.humidity} %</p>
                  </div>
                  <div className="flex items-center mb-4 md:mr-4">
                    <img src={tempImg} alt="Temperature Icon" className="w-6 h-6 mr-2" />
                    <p>Temperature: {weatherData.main.temp} °C</p>
                  </div>
                  <div className="flex items-center">
                    <img src={windImg} alt="Wind Speed Icon" className="w-6 h-6 mr-2" />
                    <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
