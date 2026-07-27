import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import gsap from "gsap";

import { CartContext } from "../contexts/Cart";
import { userLogoutApi } from "../apis/userApis";
import { getAppRoute } from "../utils/util";
import { useConfig } from "../contexts/ConfigContext";

const Navbar = ({ name, appName }) => {
  const { backendUrl, menu, user } = useConfig();

  const [cart] = useContext(CartContext);

  const navigate = useNavigate();
  const route = (path = "") => getAppRoute(appName, path);

  const menuRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayMenu = () => {
    gsap.to(menuRef.current, {
      transform: "translateX(0%)",
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const hideMenu = () => {
    gsap.to(menuRef.current, {
      transform: "translateX(100%)",
      duration: 0.25,
      ease: "power2.in",
    });
  };

  const handleLogout = async () => {
    try {
      const { data } = await userLogoutApi(backendUrl);
      if (data?.success) {
        navigate(route("loginpage"));
      } else {
        navigate(route("loginpage"));
      }
    } catch (error) {
      navigate(route("loginpage"));
    }
  };

  return (
    <>
      <nav className="menu-navbar">
        <div className="menu-nav-wrapper">
          {/* Logo / Restaurant Name */}
          <div className="menu-nav-brand" onClick={() => navigate(route())}>
            <div className="menu-nav-logo">
              <img
                src={`data:image/png;base64,${menu?.menuLogoImg}`}
                alt={name}
              />
            </div>
            <h1 className="menu-nav-title">{name}</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="menu-nav-desktop">
            {user ? (
              <div className="menu-nav-links">
                <NavLink
                  to={route()}
                  className={({ isActive }) =>
                    isActive ? "menu-nav-link active" : "menu-nav-link"
                  }
                  end>
                  <i className="ri-home-5-line"></i>
                  <span>Home</span>
                </NavLink>
                <NavLink
                  to={route("dashboard")}
                  className={({ isActive }) =>
                    isActive ? "menu-nav-link active" : "menu-nav-link"
                  }>
                  <i className="ri-dashboard-line"></i>
                  <span>Dashboard</span>
                </NavLink>
                <NavLink
                  to={route("cartpage")}
                  className={({ isActive }) =>
                    isActive ? "menu-nav-link active" : "menu-nav-link"
                  }>
                  <i className="ri-shopping-cart-line"></i>
                  <span>Cart</span>
                  {cart?.length > 0 && (
                    <span className="menu-nav-badge">{cart.length}</span>
                  )}
                </NavLink>
                <button className="menu-nav-logout" onClick={handleLogout}>
                  <i className="ri-logout-box-r-line"></i>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <NavLink to={route("cartpage")} className="menu-nav-cart-btn">
                <i className="ri-shopping-cart-line"></i>
                <span>Cart</span>
                {cart?.length > 0 && (
                  <span className="menu-nav-badge">{cart.length}</span>
                )}
              </NavLink>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="menu-nav-mobile">
            {user ? (
              <button
                className="menu-nav-hamburger"
                onClick={displayMenu}
                aria-label="Open menu">
                <i className="ri-menu-3-line"></i>
              </button>
            ) : (
              <NavLink to={route("cartpage")} className="menu-nav-cart-btn">
                <i className="ri-shopping-cart-line"></i>
                {cart?.length > 0 && (
                  <span className="menu-nav-badge">{cart.length}</span>
                )}
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      <div ref={menuRef} className="menu-side-overlay">
        <div className="menu-side-panel">
          <div className="menu-side-header">
            <div className="menu-side-brand">
              <div className="menu-nav-logo">
                <i className="ri-restaurant-line"></i>
              </div>
              <span>{name}</span>
            </div>
            <button
              className="menu-side-close"
              onClick={hideMenu}
              aria-label="Close menu">
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div className="menu-side-links">
            <NavLink
              to={route()}
              onClick={hideMenu}
              className={({ isActive }) =>
                isActive ? "menu-side-link active" : "menu-side-link"
              }
              end>
              <i className="ri-home-5-line"></i>
              <span>Home</span>
            </NavLink>
            <NavLink
              to={route("dashboard")}
              onClick={hideMenu}
              className={({ isActive }) =>
                isActive ? "menu-side-link active" : "menu-side-link"
              }>
              <i className="ri-dashboard-line"></i>
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to={route("cartpage")}
              onClick={hideMenu}
              className={({ isActive }) =>
                isActive ? "menu-side-link active" : "menu-side-link"
              }>
              <i className="ri-shopping-cart-line"></i>
              <span>Cart</span>
              {cart?.length > 0 && (
                <span className="menu-side-badge">{cart.length}</span>
              )}
            </NavLink>
          </div>
          <div className="menu-side-footer">
            <button
              className="menu-side-logout"
              onClick={() => {
                hideMenu();
                handleLogout();
              }}>
              <i className="ri-logout-box-r-line"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
