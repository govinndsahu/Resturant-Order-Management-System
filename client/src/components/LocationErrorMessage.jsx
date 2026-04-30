const LocationErrorMessage = ({ setLocationError }) => {
  return (
    <div id="location-error">
      <div id="location-error-message">
        <i
          className="ri-close-line close-icon"
          onClick={() => setLocationError(false)}></i>
        <h2>Location Error!</h2>
        <h6>Make sure you are inside the restaurant.</h6>
      </div>
    </div>
  );
};

export default LocationErrorMessage;
