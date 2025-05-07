import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${weatherApiKey}&units=metric`;

  useEffect(() => {
    console.log('Fetching weather for:', capital);

    // Fetch weather data for the capital of the selected country
    setLoading(true);
    axios.get(weatherUrl)
      .then((response) => {
        console.log('Weather fetched successfully: ', response.data);
        setWeather(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching weather:', error);
        setLoading(false);
      });
  }, [capital, weatherUrl]);

  if (loading) {
    return <div>Loading weather...</div>;
  }
  if (!weather) {
    return <div>No weather data available</div>;
  }
  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature: {weather.main.temp} °C</p>
      <p>Humidity: {weather.main.humidity} %</p>
      <p>Wind: {weather.wind.speed} m/s</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Weather icon" />
      <p>Weather: {weather.weather[0].description}</p>
    </div>
  );
}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const url = "https://studies.cs.helsinki.fi/restcountries/api/all"

  useEffect(() => {
    console.log('Fetching countries...');
      axios.get(url)
        .then((response) => {
          console.log('Countries fetched successfully');
          setCountries(response.data);
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching countries:', error);
          setLoading(false)
        }
      )
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    // console.log(`Value changed: ${searchTerm}`);
  }

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Find Countries</h1>
      <input
        type="text"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
      {
        filteredCountries.length === 0 ? (
          <p>No countries found</p>
        ) : filteredCountries.length === 1 ? (
          <div>
            <h2>{filteredCountries[0].name.common}</h2>
            <p>Region: {filteredCountries[0].region}</p>
            <p>Area: {filteredCountries[0].area}</p>
            <h2>Languages:</h2>
            <ul>
              {
                Object.values(filteredCountries[0].languages).map((lang) => (
                  <li key={lang}>{lang}</li>
                ))
              }
            </ul>
            <img src={filteredCountries[0].flags.png} alt={filteredCountries[0].flags.alt} />
            <h2>Weather</h2>
            <Weather capital={filteredCountries[0].capital} />
            
          </div>
        ) : filteredCountries.length <= 10 ? (
          <ul>
            {filteredCountries.map((country) => (
              <li key={country.cca3}>
                {country.name.common} - <button onClick={() => setSearchTerm(country.name.common)}>Show</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Too many matches, specify another filter</p>
        )
      }
      
    </div>
  );
}

export default App