import "../../css/orders.css";
import { useEffect, useState } from "react";
import axios from "axios";

import FiltereInput from "../../components/FiltereInput";
import {
  deleteOrderApi,
  deleteOrdersApi,
  doneAllOrdersApi,
  getOrdersApi,
  markOrderAsDoneApi,
} from "../../apis/orderApis";
import CalendarRangePicker from "../../components/CalendarRangePicker";
import { useConfig } from "../../contexts/ConfigContext";

const Orders = () => {
  const { backendUrl, user } = useConfig();

  const [orders, setOrders] = useState([]);
  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [loaderId, setLoaderId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fetchOrders = async () => {
    try {
      const { data } = await getOrdersApi(backendUrl);
      if (data?.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const markOrderAsDone = async (order) => {
    try {
      setLoaderId(order._id);
      const { data } = await markOrderAsDoneApi(order._id, backendUrl);
      if (data?.success) fetchOrders();
    } catch (error) {
      console.log(error);
    } finally {
      setLoaderId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoaderId(id);
      const { data } = await deleteOrderApi(id, backendUrl);
      if (data?.success) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoaderId(null);
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
        if (!startDate || !endDate) return true;
        const orderDate = new Date(order.createdAt);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      });
  };

  const deleteOrders = async () => {
    try {
      const ids = filteredOrders().map((o) => o._id);
      if (ids.length === 0) {
        alert("No orders to delete");
        return;
      }
      const { data } = await deleteOrdersApi(ids, backendUrl);
      if (data?.success) {
        setOrders((prev) => prev.filter((o) => !ids.includes(o._id)));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doneAllOrders = async () => {
    try {
      const { data } = await doneAllOrdersApi(backendUrl);
      if (data?.success) fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const getItemDisplay = (item) => {
    const size =
      item.price_type === "single" ? "" : item.half_price ? "Half" : "Full";
    return `${size ? size + " " : ""}${item.name} × ${item.quantity || 1}`;
  };

  const displayOrders = filteredOrders();

  // Unauthorized state
  if (!user || user?.role <= 0) {
    return (
      <div className="cat-unauthorized">
        <div className="cat-unauthorized-content">
          <i className="ri-shield-cross-line"></i>
          <h2>Access Denied</h2>
          <p>You are not authorized to manage categories.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-header">
        <div className="orders-header-content">
          <div className="orders-header-icon">
            <i className="ri-file-list-3-line"></i>
          </div>
          <div>
            <h1>Orders</h1>
            <p>Manage and track customer orders</p>
          </div>
        </div>
      </div>

      <div className="orders-container">
        {/* Filters Bar */}
        <div className="orders-filters">
          <CalendarRangePicker
            filteredData={filteredOrders}
            refreshData={fetchOrders}
          />
          <FiltereInput
            name={name}
            setName={setName}
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
          />
        </div>

        {/* Stats */}
        <div className="orders-stats">
          <div className="orders-stat-card">
            <span className="stat-value">{displayOrders.length}</span>
            <span className="stat-label">Orders</span>
          </div>
          <div className="orders-stat-card">
            <span className="stat-value">
              ₹{displayOrders.reduce((sum, o) => sum + (o.total || 0), 0)}
            </span>
            <span className="stat-label">Revenue</span>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="orders-bulk-actions">
          <button className="bulk-done-btn" onClick={doneAllOrders}>
            <i className="ri-check-double-line"></i>
            Mark All Done
          </button>
          <button className="bulk-delete-btn" onClick={deleteOrders}>
            <i className="ri-delete-bin-6-line"></i>
            Delete All
          </button>
        </div>

        {/* Empty State */}
        {displayOrders.length === 0 && (
          <div className="orders-empty">
            <i className="ri-inbox-line"></i>
            <p>No orders found for the selected filters.</p>
          </div>
        )}

        {/* ====== MOBILE: Card View ====== */}
        {isMobile && displayOrders.length > 0 && (
          <div className="orders-cards">
            {displayOrders.map((order) => (
              <div key={order._id} className="order-card">
                {/* Card Header */}
                <div className="order-card-header">
                  <div className="order-time">
                    <i className="ri-time-line"></i>
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <span className="order-table-badge">
                    <i className="ri-map-pin-line"></i>
                    Table {order.tableNumber}
                  </span>
                </div>

                {/* Customer */}
                <div className="order-customer">
                  <div className="customer-avatar">
                    {order.buyer?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="customer-info">
                    <span className="customer-name">{order.buyer}</span>
                    <span className="customer-items">
                      {order.products?.length || 0} items
                    </span>
                  </div>
                  <span className="order-total">₹{order.total}</span>
                </div>

                {/* Items */}
                <div className="order-items">
                  {order.products?.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <span className="item-name">{getItemDisplay(item)}</span>
                      <span className="item-price">
                        ₹{item.half_price || item.full_price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="order-card-actions">
                  <button
                    className="order-btn-delete"
                    onClick={() => handleDelete(order._id)}
                    disabled={loaderId === order._id}>
                    {loaderId === order._id ? (
                      <span className="btn-spinner-sm"></span>
                    ) : (
                      <i className="ri-delete-bin-6-line"></i>
                    )}
                    <span>Delete</span>
                  </button>
                  <button
                    className="order-btn-done"
                    onClick={() => markOrderAsDone(order)}
                    disabled={loaderId === order._id}>
                    {loaderId === order._id ? (
                      <span className="btn-spinner-sm"></span>
                    ) : (
                      <i className="ri-check-line"></i>
                    )}
                    <span>Done</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====== DESKTOP: Table View ====== */}
        {!isMobile && displayOrders.length > 0 && (
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th className="text-right">Total</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div className="td-time">
                        <i className="ri-time-line"></i>
                        <span>
                          {new Date(order.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="td-customer">
                        <div className="td-avatar">
                          {order.buyer?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span className="td-name">{order.buyer}</span>
                      </div>
                    </td>
                    <td>
                      <span className="td-table">{order.tableNumber}</span>
                    </td>
                    <td>
                      <div className="td-items">
                        {order.products?.map((item, idx) => (
                          <span key={idx} className="td-item">
                            {getItemDisplay(item)}
                            {idx < order.products.length - 1 && (
                              <span className="item-sep">·</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-right">
                      <span className="td-total">₹{order.total}</span>
                    </td>
                    <td>
                      <div className="td-actions">
                        <button
                          className="table-btn-delete"
                          onClick={() => handleDelete(order._id)}
                          disabled={loaderId === order._id}
                          title="Delete">
                          {loaderId === order._id ? (
                            <span className="btn-spinner-sm"></span>
                          ) : (
                            <i className="ri-delete-bin-6-line"></i>
                          )}
                        </button>
                        <button
                          className="table-btn-done"
                          onClick={() => markOrderAsDone(order)}
                          disabled={loaderId === order._id}
                          title="Mark Done">
                          {loaderId === order._id ? (
                            <span className="btn-spinner-sm"></span>
                          ) : (
                            <i className="ri-check-line"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
