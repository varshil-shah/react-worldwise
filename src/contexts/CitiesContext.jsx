import { createContext, useContext, useEffect, useReducer } from "react";

const BASE_URL = "https://api.jsonbin.io/v3/b/6616ca4dad19ca34f857ef0f";

const citiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown action type!");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const response = await fetch(`${BASE_URL}`);
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data.record.cities });
      } catch (error) {
        console.error(error);
        dispatch({
          type: "rejected",
          payload: "An error occurred while fetching cities!",
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}`);
      const data = await response.json();
      const cityData = data.record.cities.find(
        (city) => city.id === Number(id)
      );
      if (cityData) dispatch({ type: "city/loaded", payload: cityData });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "rejected",
        payload: "An error occurred while fetching cities!",
      });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...cities, newCity]),
      });
      const data = await response.json();
      if (!data) throw new Error("An error occurred while creating city!");
      dispatch({
        type: "city/created",
        payload: newCity,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "rejected",
        payload: "An error occurred while creating city!",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      const citiesCopy = cities.filter((city) => city.id !== id);
      await fetch(`${BASE_URL}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(citiesCopy),
      });
      dispatch({
        type: "city/deleted",
        payload: id,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "rejected",
        payload: "An error occurred while deleting city!",
      });
    }
  }

  return (
    <citiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
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
