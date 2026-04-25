import HomePage from "./pages/HomePage";

const App = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((r) => {
          // console.log("Registered");
        })
        .catch((err) => {});
    });
  }
  return (
    <div id="app">
      <HomePage />
    </div>
  );
};

export default App;
