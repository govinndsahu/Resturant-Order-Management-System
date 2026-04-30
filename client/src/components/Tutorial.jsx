const Tutorial = ({ setShowTutorial }) => {
  return (
    <div
      id="tutorial"
      className="tutorial"
      onClick={(e) => {
        if (e.target.className === "tutorial") setShowTutorial(false);
      }}>
      <img src="/tutorial.jpg" alt="tutorial" />
    </div>
  );
};

export default Tutorial;
