import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:3000";

const citiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error(error);
        alert("An error occurred while fetching cities!");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await response.json();
      setCurrentCity(data);
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching cities!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <citiesContext.Provider value={{ cities, isLoading, getCity, currentCity }}>
      {children}
    </citiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(citiesContext);
  if (!context) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useCities, CitiesProvider };
