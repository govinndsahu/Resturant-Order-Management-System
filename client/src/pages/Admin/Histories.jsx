import "../../css/histories.css";
import { useEffect, useState } from "react";
import axios from "axios";

import FiltereInput from "../../components/FiltereInput";
import CalendarRangePicker from "../../components/CalendarRangePicker";
import { useConfig } from "../../contexts/ConfigContext";
import {
  deleteHistoryApi,
  deleteOrderApi,
  deleteOrdersApi,
  getHistoryOrdersApi,
} from "../../apis/orderApis";

const Histories = () => {
  const { backendUrl, user } = useConfig();

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
      const { data } = await getHistoryOrdersApi(backendUrl);

      if (data?.success) {
        setHistories(data?.orders);
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

      const { data } = await deleteOrdersApi(ids, backendUrl);

      if (data?.success) {
        setLoader(false);
        fetchHistories();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Helpers
  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?"
    );
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#f5576c",
      "#4facfe",
      "#00f2fe",
      "#43e97b",
      "#fa709a",
    ];
    let hash = 0;
    for (let i = 0; i < name?.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filtered = filteredHistories();
  const totalRevenue = calculateTotal(filtered);
  const totalOrders = filtered.length;

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
    <div id="histories-page">
      {/* ===== Header ===== */}
      <div className="hist-header">
        <div className="hist-header-content">
          <div className="hist-header-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 17.5v-11" />
            </svg>
          </div>
          <div className="hist-header-text">
            <h1>Order History</h1>
            <p>View and manage past customer orders</p>
          </div>
        </div>
      </div>

      <div className="hist-body">
        {/* ===== Stats ===== */}
        <div className="hist-stats-row">
          <div className="hist-stat-card">
            <div className="hist-stat-icon hist-stat-purple">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div className="hist-stat-info">
              <span className="hist-stat-value">{totalOrders}</span>
              <span className="hist-stat-label">Orders</span>
            </div>
          </div>
          <div className="hist-stat-card">
            <div className="hist-stat-icon hist-stat-green">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M6 3h12l-3 9H9L6 3Z" />
                <path d="M9 12v8a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-8" />
                <path d="M8 21h8" />
              </svg>
            </div>
            <div className="hist-stat-info">
              <span className="hist-stat-value">₹{totalRevenue}</span>
              <span className="hist-stat-label">Revenue</span>
            </div>
          </div>
        </div>

        {/* ===== Filters ===== */}
        <div className="hist-filters-card">
          <div className="hist-filters-row">
            <div className="hist-filter-item hist-filter-date">
              <CalendarRangePicker
                filteredData={filteredHistories}
                refreshData={fetchHistories}
              />
            </div>
            <div className="hist-filter-item hist-filter-inputs">
              <FiltereInput
                name={name}
                setName={setName}
                tableNumber={tableNumber}
                setTableNumber={setTableNumber}
              />
            </div>
          </div>
          {filtered.length > 0 && (
            <div className="hist-bulk-actions">
              <span className="hist-bulk-count">
                {filtered.length} order{filtered.length !== 1 ? "s" : ""}{" "}
                selected
              </span>
              <button
                className="hist-btn-delete-all"
                onClick={deleteHistories}
                disabled={loader}>
                {loader ? (
                  <svg
                    className="hist-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                )}
                Delete All
              </button>
            </div>
          )}
        </div>

        {/* ===== Content ===== */}
        {histories?.length > 0 ? (
          <>
            {filtered.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hist-table-wrap">
                  <table className="hist-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Customer</th>
                        <th>Table</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((history) => (
                        <tr key={history._id}>
                          <td>
                            <div className="hist-cell-time">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <div>
                                <span className="hist-time">
                                  {formatTime(history.createdAt)}
                                </span>
                                <span className="hist-date">
                                  {formatDate(history.createdAt)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="hist-cell-customer">
                              <div
                                className="hist-avatar"
                                style={{
                                  background: getAvatarColor(history.buyer),
                                }}>
                                {getInitials(history.buyer)}
                              </div>
                              <span className="hist-customer-name">
                                {history.buyer}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="hist-table-badge">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M3 7v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
                                <path d="M17 21v-8a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v8" />
                                <path d="M7 7h.01" />
                                <path d="M17 7h.01" />
                                <path d="M13 7h.01" />
                                <path d="M13 3v4" />
                              </svg>
                              {history.tableNumber}
                            </span>
                          </td>
                          <td>
                            <div className="hist-cell-items">
                              {history.products?.map((item, idx) => (
                                <div key={idx} className="hist-item-row">
                                  <span className="hist-item-name">
                                    {item.price_type === "single"
                                      ? ""
                                      : item.half_price
                                        ? "Half "
                                        : "Full "}
                                    {item.name}
                                  </span>
                                  <span className="hist-item-qty">
                                    × {item.quantity || 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className="hist-total">₹{history.total}</span>
                          </td>
                          <td>
                            <button
                              className="hist-btn-delete"
                              onClick={() => handleDelete(history._id)}
                              disabled={loader}>
                              {loader ? (
                                <svg
                                  className="hist-spin"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round">
                                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round">
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="hist-cards-grid">
                  {filtered.map((history) => (
                    <div key={history._id} className="hist-card">
                      <div className="hist-card-header">
                        <div className="hist-card-time">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{formatTime(history.createdAt)}</span>
                          <span className="hist-card-date">
                            {formatDate(history.createdAt)}
                          </span>
                        </div>
                        <span className="hist-table-badge">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M3 7v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
                            <path d="M17 21v-8a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v8" />
                            <path d="M7 7h.01" />
                            <path d="M17 7h.01" />
                            <path d="M13 7h.01" />
                            <path d="M13 3v4" />
                          </svg>
                          {history.tableNumber}
                        </span>
                      </div>

                      <div className="hist-card-customer">
                        <div
                          className="hist-avatar"
                          style={{ background: getAvatarColor(history.buyer) }}>
                          {getInitials(history.buyer)}
                        </div>
                        <span className="hist-customer-name">
                          {history.buyer}
                        </span>
                      </div>

                      <div className="hist-card-items">
                        <h4>Ordered Items</h4>
                        {history.products?.map((item, idx) => (
                          <div key={idx} className="hist-card-item">
                            <span className="hist-card-item-name">
                              {item.price_type === "single"
                                ? ""
                                : item.half_price
                                  ? "Half "
                                  : "Full "}
                              {item.name}
                            </span>
                            <span className="hist-card-item-qty">
                              × {item.quantity || 1}
                            </span>
                            <span className="hist-card-item-price">
                              ₹
                              {item.half_price
                                ? item.half_price
                                : item.full_price}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="hist-card-footer">
                        <span className="hist-card-total">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M6 3h12l-3 9H9L6 3Z" />
                            <path d="M9 12v8a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-8" />
                            <path d="M8 21h8" />
                          </svg>
                          {history.total}
                        </span>
                        <button
                          className="hist-btn-delete"
                          onClick={() => handleDelete(history._id)}
                          disabled={loader}>
                          {loader ? (
                            <svg
                              className="hist-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Receipt Summary */}
                {name.length || String(tableNumber).length ? (
                  <div className="hist-receipt">
                    <div className="hist-receipt-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
                        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                        <path d="M12 17.5v-11" />
                      </svg>
                    </div>
                    <div className="hist-receipt-content">
                      <span className="hist-receipt-label">Filtered Total</span>
                      <span className="hist-receipt-value">
                        ₹{totalRevenue}
                      </span>
                    </div>
                    <div className="hist-receipt-count">
                      {filtered.length} order{filtered.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="hist-empty">
                <div className="hist-empty-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h3>No matching orders</h3>
                <p>Try adjusting your filters or date range</p>
                <button
                  className="hist-btn-clear"
                  onClick={() => {
                    setName("");
                    setTableNumber("");
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="hist-empty">
            <div className="hist-empty-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3>No order history</h3>
            <p>Completed orders will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Histories;
