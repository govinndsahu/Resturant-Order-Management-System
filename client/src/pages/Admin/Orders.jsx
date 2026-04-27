import axios from "axios";
import React, { useEffect, useState } from "react";
import FiltereInput from "../../components/FiltereInput";
import { deleteOrderApi, getOrdersApi } from "../../apis/orderApis";

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
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URI}/histories/create`,
        { order },
        {
          withCredentials: true,
        },
      );
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

  return (
    <div id="admin-orders-page">
      <FiltereInput
        name={name}
        setName={setName}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
      />
      <div id="orders-container">
        {orders?.length ? (
          orders
            ?.filter(
              (order) =>
                order.buyer.toLowerCase().includes(name.toLowerCase()) &&
                (tableNumber === ""
                  ? String(order.tableNumber).includes(tableNumber)
                  : String(order.tableNumber) === String(tableNumber)),
            )
            .map((order) => (
              <div className="order-card relative" key={order._id}>
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
                        {item.name}
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
      </div>
    </div>
  );
};

export default Orders;
