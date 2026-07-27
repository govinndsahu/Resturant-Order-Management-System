import "../../css/orderAnalytics.css";
import { useEffect, useMemo, useState } from "react";
import { useConfig } from "../../contexts/ConfigContext";
import { getHistoryOrdersApi } from "../../apis/orderApis";

const OrderAnalytics = () => {
  const { backendUrl, user } = useConfig();

  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const { data } = await getHistoryOrdersApi(backendUrl);
      if (data?.success) {
        setHistories(data?.orders || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Data Processing ───
  const processedData = useMemo(() => {
    if (!histories.length) return null;

    const data = histories.map((h) => ({
      ...h,
      date: new Date(h.createdAt),
      month: new Date(h.createdAt).getMonth(),
      year: new Date(h.createdAt).getFullYear(),
      day: new Date(h.createdAt).getDate(),
      hour: new Date(h.createdAt).getHours(),
      weekday: new Date(h.createdAt).getDay(),
    }));

    // Filter by selected year/month
    let filtered = data;
    if (selectedYear !== "all") {
      filtered = filtered.filter((d) => d.year === selectedYear);
    }
    if (selectedMonth !== "all") {
      filtered = filtered.filter((d) => d.month === parseInt(selectedMonth));
    }

    // ─── Overview Stats ───
    const totalRevenue = filtered.reduce((sum, h) => sum + (h.total || 0), 0);
    const totalOrders = filtered.length;
    const avgOrderValue =
      totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const totalItems = filtered.reduce(
      (sum, h) =>
        sum + (h.products?.reduce((s, p) => s + (p.quantity || 1), 0) || 0),
      0,
    );

    // ─── Monthly Breakdown ───
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyData = monthNames.map((name, idx) => {
      const monthOrders = data.filter(
        (d) =>
          d.month === idx &&
          d.year === (selectedYear !== "all" ? selectedYear : d.year),
      );
      const revenue = monthOrders.reduce((sum, h) => sum + (h.total || 0), 0);
      const orders = monthOrders.length;
      return {
        name,
        orders,
        revenue,
        avg: orders > 0 ? Math.round(revenue / orders) : 0,
      };
    });

    const maxMonthlyRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);
    const maxMonthlyOrders = Math.max(...monthlyData.map((m) => m.orders), 1);

    // ─── Daily Trend (for selected month/year) ───
    const daysInMonth =
      selectedMonth !== "all"
        ? new Date(selectedYear, parseInt(selectedMonth) + 1, 0).getDate()
        : 31;
    const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
      const dayOrders = filtered.filter((d) => d.day === i + 1);
      return {
        day: i + 1,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, h) => sum + (h.total || 0), 0),
      };
    });
    const maxDailyRevenue = Math.max(...dailyData.map((d) => d.revenue), 1);

    // ─── Hourly Heatmap ───
    const hourlyData = Array.from({ length: 24 }, (_, h) => {
      const hourOrders = filtered.filter((d) => d.hour === h);
      return {
        hour: h,
        label: `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`,
        orders: hourOrders.length,
        revenue: hourOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      };
    });
    const maxHourlyOrders = Math.max(...hourlyData.map((h) => h.orders), 1);

    // ─── Weekday Analysis ───
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekdayData = weekdayNames.map((name, idx) => {
      const dayOrders = filtered.filter((d) => d.weekday === idx);
      return {
        name,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, h) => sum + (h.total || 0), 0),
      };
    });
    const maxWeekdayOrders = Math.max(...weekdayData.map((w) => w.orders), 1);

    // ─── Top Products ───
    const productMap = {};
    filtered.forEach((h) => {
      h.products?.forEach((p) => {
        const key = `${p.name}${p.half_price ? " (Half)" : p.full_price && p.price_type !== "single" ? " (Full)" : ""}`;
        if (!productMap[key]) {
          productMap[key] = {
            name: key,
            quantity: 0,
            revenue: 0,
            category: p.category,
          };
        }
        productMap[key].quantity += p.quantity || 1;
        productMap[key].revenue +=
          (p.half_price || p.full_price || 0) * (p.quantity || 1);
      });
    });
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
    const maxProductRevenue = Math.max(...topProducts.map((p) => p.revenue), 1);

    // ─── Category Breakdown ───
    const categoryMap = {};
    filtered.forEach((h) => {
      h.products?.forEach((p) => {
        if (!categoryMap[p.category]) {
          categoryMap[p.category] = { name: p.category, revenue: 0, orders: 0 };
        }
        categoryMap[p.category].revenue +=
          (p.half_price || p.full_price || 0) * (p.quantity || 1);
        categoryMap[p.category].orders += p.quantity || 1;
      });
    });
    const categoryData = Object.values(categoryMap).sort(
      (a, b) => b.revenue - a.revenue,
    );
    const totalCategoryRevenue =
      categoryData.reduce((s, c) => s + c.revenue, 0) || 1;

    // ─── Table Performance ───
    const tableMap = {};
    filtered.forEach((h) => {
      const t = h.tableNumber || "N/A";
      if (!tableMap[t]) tableMap[t] = { table: t, orders: 0, revenue: 0 };
      tableMap[t].orders += 1;
      tableMap[t].revenue += h.total || 0;
    });
    const tableData = Object.values(tableMap).sort(
      (a, b) => b.revenue - a.revenue,
    );
    const maxTableRevenue = Math.max(...tableData.map((t) => t.revenue), 1);

    // ─── Customer Insights ───
    const customerMap = {};
    filtered.forEach((h) => {
      const name = h.buyer || "Guest";
      if (!customerMap[name])
        customerMap[name] = { name, orders: 0, revenue: 0, items: 0 };
      customerMap[name].orders += 1;
      customerMap[name].revenue += h.total || 0;
      customerMap[name].items +=
        h.products?.reduce((s, p) => s + (p.quantity || 1), 0) || 0;
    });
    const topCustomers = Object.values(customerMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // ─── Growth Metrics ───
    const sortedByDate = [...filtered].sort((a, b) => a.date - b.date);
    const firstHalf = sortedByDate.slice(0, Math.ceil(sortedByDate.length / 2));
    const secondHalf = sortedByDate.slice(Math.ceil(sortedByDate.length / 2));
    const firstRevenue = firstHalf.reduce((s, h) => s + (h.total || 0), 0);
    const secondRevenue = secondHalf.reduce((s, h) => s + (h.total || 0), 0);
    const growthRate =
      firstRevenue > 0
        ? Math.round(((secondRevenue - firstRevenue) / firstRevenue) * 100)
        : 0;

    // ─── Available Years ───
    const years = [...new Set(data.map((d) => d.year))].sort((a, b) => b - a);

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalItems,
      monthlyData,
      dailyData,
      hourlyData,
      weekdayData,
      topProducts,
      categoryData,
      tableData,
      topCustomers,
      growthRate,
      maxMonthlyRevenue,
      maxMonthlyOrders,
      maxDailyRevenue,
      maxHourlyOrders,
      maxWeekdayOrders,
      maxProductRevenue,
      maxTableRevenue,
      totalCategoryRevenue,
      years,
    };
  }, [histories, selectedMonth, selectedYear]);

  const getBarWidth = (value, max) => `${Math.max((value / max) * 100, 1)}%`;
  const getHeatColor = (value, max) => {
    const pct = value / max;
    if (pct === 0) return "#e2e8f0";
    if (pct < 0.25) return "#c7d2fe";
    if (pct < 0.5) return "#a5b4fc";
    if (pct < 0.75) return "#818cf8";
    return "#667eea";
  };

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
    for (let i = 0; i < name?.length; i++)
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const getCategoryColor = (idx) => {
    const colors = [
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#f5576c",
      "#4facfe",
      "#10b981",
      "#f59e0b",
      "#ef4444",
    ];
    return colors[idx % colors.length];
  };

  if (loading) {
    return (
      <div id="analytics-page">
        <div className="analytics-loading">
          <div className="analytics-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (!user || user?.role < 2) {
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

  if (!processedData) {
    return (
      <div id="analytics-page">
        <div className="analytics-empty">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
          <h3>No Data Available</h3>
          <p>Complete some orders to see analytics</p>
        </div>
      </div>
    );
  }

  const d = processedData;

  return (
    <div id="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-header-content">
          <div className="analytics-header-icon">
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
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
          <div className="analytics-header-text">
            <h1>Order Analytics</h1>
            <p>Insights and trends from your order history</p>
          </div>
        </div>
      </div>

      <div className="analytics-body">
        {/* Filters */}
        <div className="analytics-filters">
          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                e.target.value === "all" ? "all" : parseInt(e.target.value),
              )
            }
            className="analytics-select">
            <option value="all">All Years</option>
            {d.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="analytics-select">
            <option value="all">All Months</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Overview Stats */}
        <div className="analytics-stats-grid">
          <div className="analytics-stat-card">
            <div
              className="analytics-stat-icon"
              style={{
                background: "linear-gradient(135deg, #667eea20, #764ba220)",
                color: "#667eea",
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
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
            <div className="analytics-stat-info">
              <span className="analytics-stat-value">{d.totalOrders}</span>
              <span className="analytics-stat-label">Total Orders</span>
            </div>
          </div>
          <div className="analytics-stat-card">
            <div
              className="analytics-stat-icon"
              style={{
                background: "linear-gradient(135deg, #10b98120, #05966920)",
                color: "#059669",
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
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
            <div className="analytics-stat-info">
              <span className="analytics-stat-value">
                ₹{d.totalRevenue.toLocaleString("en-IN")}
              </span>
              <span className="analytics-stat-label">Total Revenue</span>
            </div>
          </div>
          <div className="analytics-stat-card">
            <div
              className="analytics-stat-icon"
              style={{
                background: "linear-gradient(135deg, #f59e0b20, #d9770620)",
                color: "#d97706",
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              </svg>
            </div>
            <div className="analytics-stat-info">
              <span className="analytics-stat-value">₹{d.avgOrderValue}</span>
              <span className="analytics-stat-label">Avg Order Value</span>
            </div>
          </div>
          <div className="analytics-stat-card">
            <div
              className="analytics-stat-icon"
              style={{
                background: "linear-gradient(135deg, #f093fb20, #f5576c20)",
                color: "#f5576c",
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            </div>
            <div className="analytics-stat-info">
              <span className="analytics-stat-value">{d.totalItems}</span>
              <span className="analytics-stat-label">Items Sold</span>
            </div>
          </div>
          <div className="analytics-stat-card">
            <div
              className="analytics-stat-icon"
              style={{
                background:
                  d.growthRate >= 0
                    ? "linear-gradient(135deg, #10b98120, #05966920)"
                    : "linear-gradient(135deg, #ef444420, #dc262620)",
                color: d.growthRate >= 0 ? "#059669" : "#dc2626",
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                {d.growthRate >= 0 ? (
                  <>
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </>
                ) : (
                  <>
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                    <polyline points="17 18 23 18 23 12" />
                  </>
                )}
              </svg>
            </div>
            <div className="analytics-stat-info">
              <span
                className={`analytics-stat-value ${d.growthRate >= 0 ? "analytics-positive" : "analytics-negative"}`}>
                {d.growthRate >= 0 ? "+" : ""}
                {d.growthRate}%
              </span>
              <span className="analytics-stat-label">Growth Rate</span>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="analytics-section">
          <div className="analytics-section-header">
            <h2>Monthly Revenue</h2>
            <span className="analytics-section-badge">Year Overview</span>
          </div>
          <div className="analytics-chart-card">
            <div className="analytics-monthly-chart">
              {d.monthlyData.map((m, i) => (
                <div key={i} className="analytics-month-col">
                  <div className="analytics-month-bars">
                    <div
                      className="analytics-month-bar-revenue"
                      style={{
                        height: getBarWidth(m.revenue, d.maxMonthlyRevenue),
                      }}
                      title={`₹${m.revenue}`}></div>
                    <div
                      className="analytics-month-bar-orders"
                      style={{
                        height: getBarWidth(m.orders, d.maxMonthlyOrders),
                      }}
                      title={`${m.orders} orders`}></div>
                  </div>
                  <span className="analytics-month-label">{m.name}</span>
                  <span className="analytics-month-value">₹{m.revenue}</span>
                </div>
              ))}
            </div>
            <div className="analytics-chart-legend">
              <div className="analytics-legend-item">
                <span
                  className="analytics-legend-dot"
                  style={{ background: "#667eea" }}></span>
                <span>Revenue</span>
              </div>
              <div className="analytics-legend-item">
                <span
                  className="analytics-legend-dot"
                  style={{ background: "#764ba2" }}></span>
                <span>Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Trend + Hourly Heatmap */}
        <div className="analytics-grid-2">
          {/* Daily Trend */}
          <div className="analytics-section">
            <div className="analytics-section-header">
              <h2>Daily Trend</h2>
              <span className="analytics-section-badge">
                {selectedMonth !== "all" ? "This Month" : "All Time"}
              </span>
            </div>
            <div className="analytics-chart-card">
              <div className="analytics-daily-chart">
                {d.dailyData.map((day, i) => (
                  <div key={i} className="analytics-daily-col">
                    <div className="analytics-daily-bar-wrap">
                      <div
                        className="analytics-daily-bar"
                        style={{
                          height: getBarWidth(day.revenue, d.maxDailyRevenue),
                        }}
                        title={`Day ${day.day}: ₹${day.revenue} (${day.orders} orders)`}></div>
                    </div>
                    <span className="analytics-daily-label">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hourly Heatmap */}
          <div className="analytics-section">
            <div className="analytics-section-header">
              <h2>Peak Hours</h2>
              <span className="analytics-section-badge">Order Heatmap</span>
            </div>
            <div className="analytics-chart-card">
              <div className="analytics-heatmap">
                {d.hourlyData.map((h, i) => (
                  <div
                    key={i}
                    className="analytics-heatmap-cell"
                    style={{
                      background: getHeatColor(h.orders, d.maxHourlyOrders),
                    }}
                    title={`${h.label}: ${h.orders} orders, ₹${h.revenue}`}>
                    <span className="analytics-heatmap-hour">{h.hour}</span>
                    <span className="analytics-heatmap-count">{h.orders}</span>
                  </div>
                ))}
              </div>
              <div className="analytics-heatmap-labels">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>11 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekday Analysis + Category Breakdown */}
        <div className="analytics-grid-2">
          {/* Weekday */}
          <div className="analytics-section">
            <div className="analytics-section-header">
              <h2>Weekday Performance</h2>
              <span className="analytics-section-badge">Orders by Day</span>
            </div>
            <div className="analytics-chart-card">
              <div className="analytics-weekday-chart">
                {d.weekdayData.map((w, i) => (
                  <div key={i} className="analytics-weekday-row">
                    <span className="analytics-weekday-name">{w.name}</span>
                    <div className="analytics-weekday-bar-wrap">
                      <div
                        className="analytics-weekday-bar"
                        style={{
                          width: getBarWidth(w.orders, d.maxWeekdayOrders),
                        }}></div>
                    </div>
                    <span className="analytics-weekday-value">{w.orders}</span>
                    <span className="analytics-weekday-revenue">
                      ₹{w.revenue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Donut */}
          <div className="analytics-section">
            <div className="analytics-section-header">
              <h2>Category Breakdown</h2>
              <span className="analytics-section-badge">By Revenue</span>
            </div>
            <div className="analytics-chart-card">
              <div className="analytics-category-chart">
                <div className="analytics-donut">
                  <svg viewBox="0 0 100 100" className="analytics-donut-svg">
                    {
                      d.categoryData.reduce(
                        (acc, cat, idx) => {
                          const prevOffset = acc.offset;
                          const pct = cat.revenue / d.totalCategoryRevenue;
                          const dashArray = `${pct * 251.2} ${251.2 - pct * 251.2}`;
                          const el = (
                            <circle
                              key={idx}
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={getCategoryColor(idx)}
                              strokeWidth="12"
                              strokeDasharray={dashArray}
                              strokeDashoffset={-prevOffset * 251.2}
                              transform="rotate(-90 50 50)"
                            />
                          );
                          return {
                            elements: [...acc.elements, el],
                            offset: prevOffset + pct,
                          };
                        },
                        { elements: [], offset: 0 },
                      ).elements
                    }
                    <text
                      x="50"
                      y="46"
                      textAnchor="middle"
                      className="analytics-donut-total-label">
                      Total
                    </text>
                    <text
                      x="50"
                      y="58"
                      textAnchor="middle"
                      className="analytics-donut-total-value">
                      ₹{d.totalRevenue}
                    </text>
                  </svg>
                </div>
                <div className="analytics-category-legend">
                  {d.categoryData.map((cat, idx) => (
                    <div key={idx} className="analytics-category-legend-item">
                      <span
                        className="analytics-category-dot"
                        style={{ background: getCategoryColor(idx) }}></span>
                      <span className="analytics-category-name">
                        {cat.name}
                      </span>
                      <span className="analytics-category-pct">
                        {Math.round(
                          (cat.revenue / d.totalCategoryRevenue) * 100,
                        )}
                        %
                      </span>
                      <span className="analytics-category-rev">
                        ₹{cat.revenue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="analytics-section">
          <div className="analytics-section-header">
            <h2>Top Products</h2>
            <span className="analytics-section-badge">By Revenue</span>
          </div>
          <div className="analytics-chart-card">
            <div className="analytics-products-chart">
              {d.topProducts.map((p, i) => (
                <div key={i} className="analytics-product-row">
                  <div className="analytics-product-rank">#{i + 1}</div>
                  <div className="analytics-product-info">
                    <span className="analytics-product-name">{p.name}</span>
                    <span className="analytics-product-category">
                      {p.category}
                    </span>
                  </div>
                  <div className="analytics-product-bar-wrap">
                    <div
                      className="analytics-product-bar"
                      style={{
                        width: getBarWidth(p.revenue, d.maxProductRevenue),
                      }}></div>
                  </div>
                  <div className="analytics-product-stats">
                    <span className="analytics-product-rev">₹{p.revenue}</span>
                    <span className="analytics-product-qty">
                      {p.quantity} sold
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table Performance + Top Customers */}
        <div className="analytics-grid-2">
          {/* Tables */}
          <div className="analytics-section">
            <div className="analytics-section-header">
              <h2>Table Performance</h2>
              <span className="analytics-section-badge">By Revenue</span>
            </div>
            <div className="analytics-chart-card">
              <div className="analytics-table-chart">
                {d.tableData.map((t, i) => (
                  <div key={i} className="analytics-table-row">
                    <div className="analytics-table-num">T{t.table}</div>
                    <div className="analytics-table-bar-wrap">
                      <div
                        className="analytics-table-bar"
                        style={{
                          width: getBarWidth(t.revenue, d.maxTableRevenue),
                        }}></div>
                    </div>
                    <div className="analytics-table-stats">
                      <span className="analytics-table-rev">₹{t.revenue}</span>
                      <span className="analytics-table-orders">
                        {t.orders} orders
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="analytics-section">
            <div className="analytics-section-header">
              <h2>Top Customers</h2>
              <span className="analytics-section-badge">By Spending</span>
            </div>
            <div className="analytics-chart-card">
              <div className="analytics-customers-list">
                {d.topCustomers.map((c, i) => (
                  <div key={i} className="analytics-customer-row">
                    <div
                      className="analytics-customer-avatar"
                      style={{ background: getAvatarColor(c.name) }}>
                      {getInitials(c.name)}
                    </div>
                    <div className="analytics-customer-info">
                      <span className="analytics-customer-name">{c.name}</span>
                      <span className="analytics-customer-meta">
                        {c.orders} orders · {c.items} items
                      </span>
                    </div>
                    <span className="analytics-customer-rev">₹{c.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics;
