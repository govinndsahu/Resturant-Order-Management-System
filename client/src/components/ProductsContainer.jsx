import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useCart } from "../contexts/Cart";
import { useLocalStorage } from "../hooks/useLocalStorage";

import { getProductsApi } from "../apis/productsApi";

import {
  saveAllProducts,
  getAllProducts,
  addToCart,
  getCart,
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
    // Load cart from IndexedDB on mount
    const loadCart = async () => {
      const savedCart = await getCart();
      setCart(savedCart);
    };
    loadCart();
  }, []);

  const handleAddCart = async (p, e) => {
    let product = {
      _id: p._id,
      name: p.name,
      image: p.image,
      category: p.category,
      price_type: p.price_type,
    };

    const isFullPrice =
      e.target.parentNode.classList.contains("full-price-content");

    if (isFullPrice) {
      product = {
        ...product,
        full_price: p.full_price,
        size: "full",
      };
    } else {
      product = {
        ...product,
        half_price: p.half_price,
        size: "half",
      };
    }

    // Add product to IndexedDB (handles quantity automatically)
    await addToCart(product);

    // Fetch updated cart from IndexedDB
    const updatedCart = await getCart();
    setCart(updatedCart);

    console.log(cart);
  };

  return products?.length === 0 ? (
    <h1 className="">No products found.</h1>
  ) : (
    <div className="products-container">
      {products
        ?.filter((p) =>
          category === ""
            ? p.category?.name.includes(category)
            : p.category?.name === category,
        )
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
