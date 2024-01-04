import { useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return (
    <div className={styles.mapContainer}>
      <h2>Load map</h2>
      <h3>
        lat:{lat} and lng:{lng}
      </h3>
      <button
        onClick={() => {
          setSearchParams({ lat: 30, lng: 40 });
        }}
      >
        Change position
      </button>
    </div>
  );
}

export default Map;
