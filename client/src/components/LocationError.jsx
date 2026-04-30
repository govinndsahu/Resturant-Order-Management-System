const LocationError = ({ getUserLocation, setLocationError }) => {
  return (
    <div
      id="location-error"
      className="location-error"
      onClick={(e) => {
        if (e.target.className === "location-error") setLocationError(false);
      }}>
      <div>
        <span>Need Location to prevent fake orders.</span>
        <button
          className="location-perimission-button"
          onClick={async (e) => await getUserLocation()}>
          Allow Location
        </button>
      </div>
    </div>
  );
};

export default LocationError;
