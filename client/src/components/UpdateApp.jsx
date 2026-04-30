import { useState, useEffect } from "react";

const UpdateApp = () => {
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    if (timer === 0) {
      window.location.reload();
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div id="update-popup">
      <div>
        <h1>Sorry for inconvenient.</h1>
        <div>
          <p>
            This app need to be update before any order. Please wait for a
            second and order again.
          </p>
        </div>
        <div>
          <p>
            Reloading in {timer} second{timer !== 1 ? "s" : ""}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateApp;
