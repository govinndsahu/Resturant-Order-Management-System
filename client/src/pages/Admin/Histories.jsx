import { useEffect, useState } from "react";
import axios from "axios";

import FiltereInput from "../../components/FiltereInput";
import {
  deleteHistoriesApi,
  deleteHistoryApi,
  getHistoriesApi,
} from "../../apis/historyApis";
import CalendarRangePicker from "../../components/CalendarRangePicker";
import { useConfig } from "../../contexts/ConfigContext";

const Histories = () => {
  const { backendUrl } = useConfig();

  const [histories, setHistories] = useState([]);

  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  const [loader, setLoader] = useState(false);

  const filteredHistories = () => {
    const startDate = localStorage.getItem("startDate");
    const endDate = localStorage.getItem("endDate");

    return histories
      ?.filter(
        (order) =>
          order.buyer.toLowerCase().includes(name.toLowerCase()) &&
          (tableNumber === ""
            ? String(order.tableNumber).includes(tableNumber)
            : String(order.tableNumber) === String(tableNumber)),
      )
      .filter((order) => {
        const orderDate = new Date(order.createdAt);

        // If no range is set, show all orders
        if (!startDate || !endDate) return true;

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0); // force to 00:00:00.000

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        return orderDate >= start && orderDate <= end;
      });
  };

  const fetchHistories = async () => {
    try {
      const { data } = await getHistoriesApi(backendUrl);

      if (data?.success) {
        setHistories(data?.histories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoader(true);

      const { data } = await deleteHistoryApi(id, backendUrl);

      if (data?.success) {
        setLoader(false);
        setHistories((prevHistories) =>
          prevHistories.filter((history) => history._id !== id),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotal = (h) => {
    let total = 0;
    h.forEach((history) => {
      const parsedHistory = history;
      total += parsedHistory.total;
    });
    return total;
  };

  const deleteHistories = async () => {
    const ids = filteredHistories().map((history) => history._id);

    try {
      setLoader(true);

      const { data } = await deleteHistoriesApi(ids, backendUrl);

      if (data?.success) {
        setLoader(false);
        fetchHistories();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="histories-page" className="">
      <CalendarRangePicker
        filteredData={filteredHistories}
        refreshData={fetchHistories}
      />
      <br />
      <FiltereInput
        name={name}
        setName={setName}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
      />
      {histories?.length > 0 ? (
        <div className="histories-container flex gap-4 flex-wrap">
          {filteredHistories().map((history) => {
            const parsedHistory = history;
            return (
              <div key={history._id} className="order-card">
                <p>
                  {new Date(parsedHistory?.createdAt).toLocaleString("en-IN")}
                </p>
                <br />
                <h2>Customer details</h2>
                <br />
                <div className="order-card-body">
                  <p onClick={() => setName(parsedHistory?.buyer)}>
                    Customer name: {parsedHistory?.buyer}
                  </p>
                  <p onClick={() => setTableNumber(parsedHistory?.tableNumber)}>
                    Customer table no: {parsedHistory?.tableNumber}
                  </p>
                </div>
                <br />
                <h2>Ordered items</h2>
                <br />
                <div className="order-card-footer">
                  {parsedHistory?.products?.map((item, index) => (
                    <div className="order-item" key={index}>
                      <p>
                        {item.price_type === "single"
                          ? ""
                          : item.half_price
                            ? "Half"
                            : "Full"}{" "}
                        {`${item.name} ⨯ ${item.quantity || 1}`}
                      </p>
                      <p>
                        Item price: Rs.
                        {item.half_price ? item.half_price : item.full_price}
                      </p>
                    </div>
                  ))}
                </div>
                <br />
                <div className="bottom-content-h">
                  <h3>Total: Rs.{parsedHistory?.total}</h3>
                  {loader ? (
                    <span className="loader absolute right-0"></span>
                  ) : (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(history._id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {name.length || String(tableNumber).length ? (
            <div className="receipt-box">
              Total: {calculateTotal(filteredHistories())}
            </div>
          ) : (
            ""
          )}
          <button id="delete-orders" onClick={deleteHistories}>
            Delete
          </button>
        </div>
      ) : (
        <p>No histories found.</p>
      )}
    </div>
  );
};

export default Histories;
