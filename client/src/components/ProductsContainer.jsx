import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "../contexts/Cart";
import { getProductsApi } from "../apis/productsApi";
import {
  saveAllProducts,
  getAllProducts,
  addToCart,
  getCart,
  saveAppVersion,
  getAppVersionFromDB,
} from "../hooks/useIndexedDB";
import { useConfig } from "../contexts/ConfigContext";

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
  const { backendUrl, menu } = useConfig();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [addedIds, setAddedIds] = useState(new Set());

  const fetchProducts = async () => {
    try {
      const cached = await getAllProducts();

      const version = await getAppVersionFromDB();

      if (menu.version === version?.version) {
        setProducts(cached);
        return;
      } else {
        await saveAppVersion(menu.version);
      }

      const { data } = await getProductsApi(backendUrl);

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

    const isFullPrice = e.target
      .closest(".price-row")
      ?.classList.contains("full-price-row");

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

    await addToCart(product);
    const updatedCart = await getCart();
    setCart(updatedCart);

    // Show added feedback
    setAddedIds((prev) => new Set(prev).add(`${p._id}-${product.size}`));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(`${p._id}-${product.size}`);
        return next;
      });
    }, 1500);

    toast.success("Added to cart!", {
      icon: "🛒",
      duration: 1500,
    });
  };

  const filteredProducts = products?.filter((p) =>
    category === "" ? true : p.category?.name === category,
  );

  if (products?.length === 0) {
    return (
      <div className="products-empty">
        <div className="empty-icon">🍽️</div>
        <p>No products available</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {filteredProducts.map((p) => (
        <div key={p._id} className="product-card">
          <div className="product-image-wrap">
            <img
              src={`data:${p.mimeType};base64,${p.image}`}
              alt={p.name}
              loading="lazy"
            />
          </div>

          <div className="product-details">
            <h3 className="product-name">{p.name}</h3>

            {showDetails && (
              <div className="product-prices">
                {p.price_type === "single" ? (
                  <div className="price-row full-price-row">
                    <span className="price-amount">₹{p.full_price}</span>
                    {showAddButtons && (
                      <button
                        onClick={(e) => handleAddCart(p, e)}
                        className={`${addBtnClass} ${
                          addedIds.has(`${p._id}-full`) ? "added" : ""
                        }`}>
                        {addedIds.has(`${p._id}-full`) ? (
                          <>
                            <i className="ri-check-line"></i> Added
                          </>
                        ) : (
                          <>
                            <i className="ri-add-line"></i> {addBtnContent}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="price-row half-price-row">
                      <div className="price-label">
                        <span className="size-badge half">Half</span>
                        <span className="price-amount">₹{p.half_price}</span>
                      </div>
                      {showAddButtons && (
                        <button
                          onClick={(e) => handleAddCart(p, e)}
                          className={`${addBtnClass} ${
                            addedIds.has(`${p._id}-half`) ? "added" : ""
                          }`}>
                          {addedIds.has(`${p._id}-half`) ? (
                            <i className="ri-check-line"></i>
                          ) : (
                            <i className="ri-add-line"></i>
                          )}
                        </button>
                      )}
                    </div>
                    <div className="price-row full-price-row">
                      <div className="price-label">
                        <span className="size-badge full">Full</span>
                        <span className="price-amount">₹{p.full_price}</span>
                      </div>
                      {showAddButtons && (
                        <button
                          onClick={(e) => handleAddCart(p, e)}
                          className={`${addBtnClass} ${
                            addedIds.has(`${p._id}-full`) ? "added" : ""
                          }`}>
                          {addedIds.has(`${p._id}-full`) ? (
                            <i className="ri-check-line"></i>
                          ) : (
                            <i className="ri-add-line"></i>
                          )}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {showSingleBtn && (
            <button className="single-action-btn">{singleBtnContent}</button>
          )}
          {showMenipulateBtn && (
            <div className="edit-buttons">
              <button className="update-btn">
                <i className="ri-edit-line"></i>
              </button>
              <button className="delete-btn">
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductsContainer;
