import React from "react";

const UpdateApp = () => {
  return (
    <div id="update-popup">
      <div>
        <h1>Sorry for inconvenient.</h1>
        <div>
          <p>
            This app need to be update before any order. Click below to update
            or refresh the page and order again.
          </p>
        </div>
        <button onClick={() => location.reload()}>Update</button>
      </div>
    </div>
  );
};

export default UpdateApp;
