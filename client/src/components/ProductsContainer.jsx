import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useCart } from "../contexts/Cart";
import { useLocalStorage } from "../hooks/useLocalStorage";

import { getProductsApi } from "../apis/productsApi";

import {
  saveAllProducts,
  getAllProducts,
  addToCart,
} from "../hooks/useIndexedDB";

const ProductsContainer = ({
  showDetails,
  showAddButtons,
  addBtnClass,
  addBtnContent,
  showSingleBtn,
  singleBtnContent,
  showMenipulateBtn,
  category,
}) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useCart();

  const fetchProducts = async () => {
    try {
      // Try IndexedDB first
      const cached = await getAllProducts();

      if (cached?.length > 0) {
        setProducts(cached);
        return;
      }

      const { data } = await getProductsApi();

      if (data?.success) {
        setProducts(data?.products);
        await saveAllProducts(data?.products);
      } else {
        console.log("Server Problem");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddCart = async (p, e) => {
    let product = {
      _id: p._id,
      name: p.name,
      image: p.image,
      category: p.category,
      price_type: p.price_type,
    };

    if (e.target.parentNode.classList.contains("full-price-content")) {
      product = {
        ...product,
        full_price: p.full_price,
      };
    } else {
      product = {
        ...product,
        half_price: p.half_price,
      };
    }
    await addToCart(product);
    setCart((prevCart) => [...prevCart, product]);
  };

  return products?.length === 0 ? (
    <h1 className="">No products found.</h1>
  ) : (
    <div className="products-container">
      {products
        ?.filter((p) => p.category?.name.includes(category))
        .map((p) => (
          <div key={p._id} className="product">
            <div className="product-image">
              <img src={`data:${p.mimeType};base64,${p.image}`} alt={p.name} />
            </div>
            <div className="product-info">
              <h2 className="product-name">{p.name}</h2>
              {showDetails ? (
                p.price_type === "single" ? (
                  <div className="full-price-content">
                    <p className="product-price">Rs.{p.full_price}</p>
                    {showAddButtons ? (
                      <button
                        onClick={(e) => {
                          handleAddCart(p, e);
                          toast.success("Added to cart!");
                        }}
                        className={addBtnClass}>
                        {addBtnContent}
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <>
                    <div className="half-price-content">
                      <p className="product-price">
                        <span>Half</span> Rs.{p.half_price}
                      </p>
                      {showAddButtons ? (
                        <button
                          onClick={(e) => {
                            handleAddCart(p, e);
                            toast.success("Added to cart!");
                          }}
                          className={addBtnClass}>
                          {addBtnContent}
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="full-price-content">
                      <p className="product-price">
                        <span>Full</span> Rs.{p.full_price}
                      </p>
                      {showAddButtons ? (
                        <button
                          onClick={(e) => {
                            handleAddCart(p, e);
                            toast.success("Added to cart!");
                          }}
                          className={addBtnClass}>
                          {addBtnContent}
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                )
              ) : (
                ""
              )}
            </div>
            {showSingleBtn ? <button>{singleBtnContent}</button> : ""}
            {showMenipulateBtn ? (
              <div className="edit-buttons">
                <button className="update-btn">Update</button>
                <button className="delete-btn">Delete</button>
              </div>
            ) : (
              ""
            )}
          </div>
        ))}
    </div>
  );
};

export default ProductsContainer;
