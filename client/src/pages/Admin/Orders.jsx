import { useEffect, useState } from "react";
import axios from "axios";

import FiltereInput from "../../components/FiltereInput";

import {
  deleteOrderApi,
  deleteOrdersApi,
  getOrdersApi,
} from "../../apis/orderApis";
import { createHistoriesApi } from "../../apis/historyApis";
import CalendarRangePicker from "../../components/CalendarRangePicker";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  const [loader, setLoader] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await getOrdersApi();

      if (data?.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSendHistory = async (order) => {
    try {
      const { data } = await createHistoriesApi(order);

      if (data?.success) {
        handleDelete(order._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoader(true);

      const { data } = await deleteOrderApi(id);

      if (data?.success) {
        setLoader(false);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== id),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredOrders = () => {
    const startDate = localStorage.getItem("startDate");
    const endDate = localStorage.getItem("endDate");

    return orders
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

  const deleteOrders = async () => {
    try {
      const ids = filteredOrders().map((order) => order._id);

      if (ids.length === 0) {
        alert("No orders to delete");
        return;
      }

      const { data } = await deleteOrdersApi(ids);

      if (data?.success) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => !ids.includes(order._id)),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="admin-orders-page">
      <CalendarRangePicker
        filteredData={filteredOrders}
        refreshData={fetchOrders}
      />
      <br />
      <FiltereInput
        name={name}
        setName={setName}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
      />
      <div id="orders-container">
        {orders?.length ? (
          filteredOrders().map((order) => (
            <div className="order-card relative" key={order._id}>
              <p>{new Date(order.createdAt).toLocaleString("en-IN")}</p>
              <br />
              <h2>Customer details</h2>
              <div className="order-card-body">
                <p onClick={() => setName(order.buyer)}>
                  Customer name: {order.buyer}
                </p>
                <p onClick={() => setTableNumber(order.tableNumber)}>
                  Customer table no: {order.tableNumber}
                </p>
              </div>
              <br />
              <h2>Ordered items</h2> <br />
              <div className="order-card-footer">
                {order.products?.map((item, index) => (
                  <div className="order-item" key={index}>
                    <p>
                      Item name:{" "}
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
              </div>{" "}
              <br />
              <div className="bottom-content">
                <h3>Total: Rs.{order.total}</h3>
              </div>
              {loader ? (
                <span className="loader absolute right-0"></span>
              ) : (
                <div className="btn-box">
                  <button
                    className="remove-btn"
                    onClick={() => {
                      handleDelete(order._id);
                    }}>
                    Delete
                  </button>

                  <button
                    className="done-btn"
                    onClick={() => {
                      handleSendHistory(order);
                    }}>
                    Done
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-orders">
            <h2>No orders found</h2>
          </div>
        )}
        <button id="delete-orders" onClick={deleteOrders}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Orders;
