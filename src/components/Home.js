import "./Home.css";
import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faLocationDot,
  faDroplet,
  faWind,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [cityInput, setCityInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeatherData = async (city) => {
    try {
      setLoading(true);

      const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_LINK_API}&lang=pt_br`;

      const response = await axios.get(apiWeatherURL);

      setWeatherData(response.data);

      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("Cidade não encontrada, tente novamente!");
      } else if (error.response && error.response.status === 400) {
        setErrorMessage("Campo vazio");
      } else {
        setErrorMessage("Ocorreu um erro ao obter os dados do clima");
      }
    } finally {
      setLoading(false);
    }
  };

  const showWeatherData = async (city) => {
    await getWeatherData(city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cityInput) {
      showWeatherData(cityInput);
      setCityInput("");
    }
  };

  const handleChange = (e) => {
    setCityInput(e.target.value);
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h3>Confira o clima de uma cidade:</h3>
        <div className="form-input-container">
          <input
            type="text"
            placeholder="Digite o nome de uma cidade"
            id="city-input"
            onChange={handleChange}
            value={cityInput}
          />
          <button id="search">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </form>

      {loading && <p className="loading">Carregando...</p>}

      {weatherData && !loading && (
        <div id="weather-data">
          <h2>
            <FontAwesomeIcon className="icon" icon={faLocationDot} />

            <span id="city">{weatherData.name}</span>
            <img
              src={`https://flagsapi.com/${weatherData.sys.country}/flat/64.png`}
              alt="Bandeira do país"
              id="country"
            />
          </h2>
          <p id="temperature">
            <span>{parseInt(weatherData.main.temp)}</span>
            &deg;C
          </p>
          <div id="description-container">
            <p className="description">{weatherData.weather[0].description}</p>
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt="Condições do tempo"
              id="weather-icon"
            />
          </div>
          <div id="details-container">
            <p id="humidity">
              <FontAwesomeIcon className="icon" icon={faDroplet} />
              <span>{weatherData.main.humidity}%</span>
            </p>

            <p id="wind">
              <FontAwesomeIcon className="icon" icon={faWind} />
              <span>{weatherData.wind.speed}Km/h</span>
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="error-container">
          <h5>{errorMessage}</h5>
        </div>
      )}
    </div>
  );
};

export default Home;
