import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import gsap from "gsap";

import { CartContext } from "../contexts/Cart";
import { userLogoutApi } from "../apis/userApis";
import { getAppRoute } from "../utils/util";
import { useConfig } from "../contexts/ConfigContext";

const Navbar = ({ name, appName }) => {
  const { backendUrl } = useConfig();

  const [cart] = useContext(CartContext);
  const user = JSON.parse(localStorage?.getItem("user"));

  const navigate = useNavigate();
  const route = (path = "") => getAppRoute(appName, path);

  const menuRef = useRef();

  const displayMenu = () => {
    gsap.to(menuRef.current, {
      transform: "translateX(0%)",
      duration: 0.2,
    });
  };

  const hideMenu = () => {
    gsap.to(menuRef.current, {
      transform: "translateX(100%)",
      duration: 0.2,
    });
  };

  const handleLogout = async () => {
    try {
      const { data } = await userLogoutApi(backendUrl);
      if (data?.success) {
        navigate(route("loginpage"));
        localStorage.removeItem("user");
      } else {
        navigate(route("loginpage"));
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.log(error);
      navigate(route("loginpage"));
      localStorage.removeItem("user");
    }
  };

  return (
    <>
      <nav id="nav" className="shadow-sm fixed top-0 left-0 w-full z-2">
        <div className="nav-wrapper">
          <div className="flex justify-between md:justify-around h-16 xl:h-20 w-full ">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate(route())}>
              <h2 className="text-[20px] md:text-3xl font-semibold">{name}</h2>
            </div>
            <div className="flex items-center space-x-8 text-[18px] md:text-3xl">
              {window.innerWidth >= 700 ? (
                user ? (
                  <div className="nav-right flex items-center gap-8">
                    <div className="nav-links text-[20px] flex gap-8 item-center">
                      <NavLink className={"nav-link"} to={route()}>
                        Home
                      </NavLink>
                      <NavLink className={"link"} to={route("dashboard")}>
                        Dashboard
                      </NavLink>
                      <NavLink className={"link"} to={route("cartpage")}>
                        Cart ({cart?.length})
                      </NavLink>
                    </div>
                    <button
                      id="logout-btn"
                      className="text-[21px]"
                      onClick={(e) => {
                        handleLogout();
                      }}>
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <NavLink
                    to={route("cartpage")}
                    className="text-white hover:text-blue-600">
                    Cart <i className="ri-shopping-cart-line"></i> (
                    {cart?.length})
                  </NavLink>
                )
              ) : user ? (
                <i
                  className="ri-menu-fill text-2xl"
                  onClick={(e) => {
                    displayMenu();
                  }}></i>
              ) : (
                <NavLink
                  to={route("cartpage")}
                  className="text-black hover:text-blue-600">
                  Cart <i className="ri-shopping-cart-line"></i> ({cart?.length}
                  )
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div
        ref={menuRef}
        id="side-menu"
        className="flex flex-col items-end gap-10">
        <button
          className="back-btn"
          onClick={(e) => {
            hideMenu();
          }}>
          Back
        </button>
        <div className="menu-links flex flex-col gap-10 text-[18px]">
          <NavLink onClick={() => hideMenu()} to={route()}>
            Home
          </NavLink>
          <NavLink onClick={() => hideMenu()} to={route("dashboard")}>
            Dashboard
          </NavLink>
          <NavLink onClick={() => hideMenu()} to={route("cartpage")}>
            Cart
          </NavLink>
        </div>
        <div
          id="menu-logout-btn"
          onClick={(e) => {
            hideMenu();
          }}
          className="text-[20px] bg-[yellow] text-black rounded-2xl">
          <button onClick={() => handleLogout()}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
