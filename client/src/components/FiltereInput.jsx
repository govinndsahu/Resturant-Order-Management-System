import React from "react";

const FiltereInput = ({ name, setName, tableNumber, setTableNumber }) => {
  return (
    <>
      <div className="filtered-orders">
        <div className="filter-inputs flex flex-col lg:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter customer name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full lg:w-[10%] bg-[#333] p-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Enter Table number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full lg:w-1/2 bg-[#333] p-2 rounded-md"
          />
        </div>
      </div>
      <br />
    </>
  );
};

export default FiltereInput;
