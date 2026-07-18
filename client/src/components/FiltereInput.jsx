const FiltereInput = ({ name, setName, tableNumber, setTableNumber }) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <i className="ri-user-search-line"></i>
        <input
          type="text"
          placeholder="Search by customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {name && (
          <button
            className="filter-clear"
            onClick={() => setName("")}
            aria-label="Clear name filter">
            <i className="ri-close-circle-fill"></i>
          </button>
        )}
      </div>
      <div className="filter-group">
        <i className="ri-hashtag"></i>
        <input
          type="number"
          placeholder="Table number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          min="1"
        />
        {tableNumber && (
          <button
            className="filter-clear"
            onClick={() => setTableNumber("")}
            aria-label="Clear table filter">
            <i className="ri-close-circle-fill"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default FiltereInput;
