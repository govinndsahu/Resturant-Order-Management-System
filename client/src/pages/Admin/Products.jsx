import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../../css/products.css";

import {
  getAllCategories,
  getAllProducts,
  saveAllProducts,
} from "../../hooks/useIndexedDB";

import { getCategoriesApi } from "../../apis/categoryApis";
import {
  createProductApi,
  deleteProductApi,
  getProductsApi,
  updateProductApi,
  uploadImageApi,
} from "../../apis/productsApi";
import Loader from "../../components/Loader";
import { useConfig } from "../../contexts/ConfigContext";

const Products = () => {
  const { backendUrl } = useConfig();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [priceType, setPriceType] = useState("single");
  const [price, setPrice] = useState("");
  const [halfPrice, setHalfPrice] = useState("");
  const [fullPrice, setFullPrice] = useState("");
  const [image, setImage] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [updateMode, setUpdateMode] = useState(false);

  const [loader, setLoader] = useState(false);

  const imageRef = useRef();
  const refImage = useRef();
  const formRef = useRef();
  const validateCategoryRef = useRef();

  const productData = {
    id: productId,
    name: productName,
    category,
    price_type: priceType,
    full_price: priceType === "single" ? price : fullPrice,
    half_price: priceType === "both" ? halfPrice : null,
    image,
    sn: serialNumber,
  };

  const fetchProducts = async () => {
    try {
      const cached = await getAllProducts();

      if (cached?.length > 0) {
        setProducts(cached);
        return;
      }

      const { data } = await getProductsApi(backendUrl);

      if (data?.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const cached = await getAllCategories();

      if (cached?.length > 0) {
        setCategories(cached);
        return;
      }

      const { data } = await getCategoriesApi(backendUrl);

      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!category) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        validateCategoryRef.current.style.display = "block";
        return;
      }

      setLoader(true);

      const { data } = await createProductApi(productData, backendUrl);

      if (data?.success) {
        uploadImage(data.id, image);

        const {
          data: { products },
        } = await getProductsApi(backendUrl);

        await saveAllProducts(products);

        setLoader(false);
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  const uploadImage = async (id, file) => {
    const formData = new FormData();

    formData.append("image", file);

    try {
      const { data } = await uploadImageApi(id, formData, backendUrl);

      if (data?.success) {
        const {
          data: { products },
        } = await getProductsApi(backendUrl);

        await saveAllProducts(products);

        setProductName("");
        setCategory("");
        setPriceType("single");
        setPrice("");
        setHalfPrice("");
        setFullPrice("");
        setImage("");
        setImagePreview(null);
        fetchProducts();
        formRef.current.reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProduct = async (p) => {
    setUpdateMode(true);
    setProductName(p.name);
    setCategory(p.category?._id || p.category);
    setPriceType(p.price_type);
    setPrice(p.full_price);
    setHalfPrice(p.half_price);
    setFullPrice(p.full_price);
    setImage("");
    setSerialNumber(p.sn || 1);
    setProductId(p._id);
    setImagePreview(
      p.image && p.mimeType ? `data:${p.mimeType};base64,${p.image}` : null,
    );
  };

  const handleUpdateRequest = async (id) => {
    try {
      if (!category) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        validateCategoryRef.current.style.display = "block";
        return;
      }

      setLoader(true);

      const { data } = await updateProductApi(id, productData, backendUrl);

      if (data?.success) {
        if (image) {
          await uploadImage(id, image);
        }

        const {
          data: { products },
        } = await getProductsApi(backendUrl);

        await saveAllProducts(products);

        setProductName("");
        setCategory("");
        setPriceType("single");
        setPrice("");
        setHalfPrice("");
        setFullPrice("");
        setImage("");
        setSerialNumber("");
        setImagePreview(null);
        fetchProducts();
        setUpdateMode(false);
        formRef.current.reset();
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      setLoader(true);

      const { data } = await deleteProductApi(id, backendUrl);

      if (data?.success) {
        const {
          data: { products },
        } = await getProductsApi(backendUrl);

        await saveAllProducts(products);

        fetchProducts();

        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Unauthorized state
  if (!user || user?.role !== 2) {
    return (
      <div className="prod-unauthorized">
        <div className="prod-unauthorized-content">
          <i className="ri-shield-cross-line"></i>
          <h2>Access Denied</h2>
          <p>You are not authorized to manage products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prod-page">
      {/* Header */}
      <div className="prod-header">
        <div className="prod-header-content">
          <div className="prod-header-icon">
            <i className="ri-restaurant-line"></i>
          </div>
          <div>
            <h1>Manage Products</h1>
            <p>Add, edit, and organize your menu items</p>
          </div>
        </div>
      </div>

      <div className="prod-container">
        {/* Form Card */}
        <div className="prod-form-card">
          <div className="prod-form-header">
            <i
              className={
                updateMode ? "ri-edit-circle-line" : "ri-add-circle-line"
              }></i>
            <h2>{updateMode ? "Update Product" : "Add Product"}</h2>
          </div>

          <form
            ref={formRef}
            className="prod-form"
            onSubmit={(e) => e.preventDefault()}>
            {/* Row 1: Name + Category */}
            <div className="prod-form-row">
              <div className="prod-form-group">
                <label htmlFor="product-name">
                  <i className="ri-price-tag-3-line"></i>
                  Product Name
                </label>
                <input
                  required
                  value={productName}
                  type="text"
                  name="name"
                  id="product-name"
                  placeholder="e.g., Paneer Tikka"
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="prod-form-group">
                <label htmlFor="select-category">
                  <i className="ri-apps-line"></i>
                  Category
                </label>
                <span
                  ref={validateCategoryRef}
                  className="prod-error-text"
                  style={{ display: "none" }}>
                  <i className="ri-error-warning-line"></i>
                  Category is required
                </span>
                <select
                  required
                  name="category"
                  id="select-category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (validateCategoryRef.current) {
                      validateCategoryRef.current.style.display = "none";
                    }
                  }}>
                  <option hidden value="">
                    Select a category
                  </option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Price Type + S.N */}
            <div className="prod-form-row">
              <div className="prod-form-group">
                <label htmlFor="price-type">
                  <i className="ri-money-rupee-circle-line"></i>
                  Price Type
                </label>
                <select
                  required
                  value={priceType}
                  name="price_type"
                  id="price-type"
                  onChange={(e) => {
                    setPriceType(e.target.value);
                    if (e.target.value === "single") {
                      setHalfPrice("");
                    }
                  }}>
                  <option value="single">Single Price</option>
                  <option value="both">Half & Full</option>
                </select>
              </div>
              <div className="prod-form-group prod-sn-group">
                <label htmlFor="serial-number">
                  <i className="ri-hashtag"></i>
                  S.N
                </label>
                <input
                  required
                  value={serialNumber}
                  type="number"
                  name="sn"
                  id="serial-number"
                  placeholder="1"
                  min="1"
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Row 3: Prices */}
            <div className="prod-form-row">
              {priceType === "single" ? (
                <div className="prod-form-group">
                  <label htmlFor="product-price">
                    <i className="ri-money-rupee-circle-line"></i>
                    Price (₹)
                  </label>
                  <input
                    required
                    name="full_price"
                    value={price}
                    type="number"
                    id="product-price"
                    placeholder="Enter price"
                    min="0"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div className="prod-form-group">
                    <label htmlFor="half-price">
                      <i className="ri-scissors-cut-line"></i>
                      Half Price (₹)
                    </label>
                    <input
                      required
                      name="half_price"
                      value={halfPrice}
                      type="number"
                      id="half-price"
                      placeholder="Half price"
                      min="0"
                      onChange={(e) => setHalfPrice(e.target.value)}
                    />
                  </div>
                  <div className="prod-form-group">
                    <label htmlFor="full-price">
                      <i className="ri-restaurant-2-line"></i>
                      Full Price (₹)
                    </label>
                    <input
                      required
                      name="full_price"
                      value={fullPrice}
                      type="number"
                      id="full-price"
                      placeholder="Full price"
                      min="0"
                      onChange={(e) => setFullPrice(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Image Upload */}
            <div className="prod-form-group prod-image-group">
              <label>
                <i className="ri-image-line"></i>
                Product Image
              </label>
              <div
                className="prod-image-upload"
                style={{ display: updateMode ? "none" : "flex" }}>
                <input
                  required={!updateMode}
                  ref={refImage}
                  name="image"
                  type="file"
                  id="product-image"
                  accept=".jpg, .png, .jpeg"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    handleImagePreview(e);
                  }}
                />
                <label htmlFor="product-image" className="prod-upload-btn">
                  <i className="ri-upload-cloud-2-line"></i>
                  Choose Image
                </label>
              </div>

              {updateMode && (
                <button
                  type="button"
                  className="prod-change-img-btn"
                  onClick={() => refImage.current?.click()}>
                  <i className="ri-image-edit-line"></i>
                  Change Image
                </button>
              )}

              {imagePreview && (
                <div className="prod-image-preview">
                  <img
                    ref={imageRef}
                    src={imagePreview}
                    alt="Product Preview"
                  />
                  <button
                    type="button"
                    className="prod-remove-img"
                    onClick={() => {
                      setImagePreview(null);
                      setImage("");
                      if (refImage.current) refImage.current.value = "";
                    }}>
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            {loader ? (
              <div className="prod-loader-wrap">
                <Loader />
              </div>
            ) : (
              <div className="prod-form-actions">
                {updateMode && (
                  <button
                    type="button"
                    className="prod-cancel-btn"
                    onClick={() => {
                      setUpdateMode(false);
                      setProductName("");
                      setCategory("");
                      setPriceType("single");
                      setPrice("");
                      setHalfPrice("");
                      setFullPrice("");
                      setImage("");
                      setSerialNumber("");
                      setImagePreview(null);
                      formRef.current?.reset();
                    }}>
                    <i className="ri-close-line"></i>
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="prod-submit-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    updateMode
                      ? handleUpdateRequest(productId)
                      : handleSubmit(e);
                  }}>
                  <i
                    className={
                      updateMode ? "ri-check-line" : "ri-add-line"
                    }></i>
                  {updateMode ? "Update Product" : "Add Product"}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Products List */}
        <div className="prod-list-section">
          <div className="prod-list-header">
            <h2>
              <i className="ri-list-check-2"></i>
              All Products
            </h2>
            <span className="prod-count">{products.length} items</span>
          </div>

          {products.length === 0 ? (
            <div className="prod-empty">
              <i className="ri-inbox-line"></i>
              <p>No products yet. Add your first menu item!</p>
            </div>
          ) : (
            <div className="prod-grid">
              {products.map((p) => (
                <div key={p._id} className="prod-card">
                  <div className="prod-card-image">
                    <img
                      src={`data:${p?.mimeType};base64,${p?.image}`}
                      alt={p.name}
                      loading="lazy"
                    />
                    <span className="prod-card-sn">{p.sn}</span>
                    <span className={`prod-card-badge ${p.price_type}`}>
                      {p.price_type === "single" ? "Single" : "Half / Full"}
                    </span>
                  </div>
                  <div className="prod-card-body">
                    <h3 className="prod-card-name">{p.name}</h3>
                    <span className="prod-card-category">
                      {p.category?.name}
                    </span>
                    <div className="prod-card-prices">
                      {p.price_type === "single" ? (
                        <span className="prod-price-single">
                          ₹{p.full_price}
                        </span>
                      ) : (
                        <div className="prod-price-both">
                          <span className="price-half">
                            Half ₹{p.half_price}
                          </span>
                          <span className="price-divider">·</span>
                          <span className="price-full">
                            Full ₹{p.full_price}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="prod-card-actions">
                    <button
                      className="prod-btn-update"
                      onClick={() => {
                        handleUpdateProduct(p);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={loader}>
                      <i className="ri-edit-line"></i>
                      <span>Edit</span>
                    </button>
                    <button
                      className="prod-btn-delete"
                      onClick={() => handleDeleteProduct(p._id)}
                      disabled={loader}>
                      <i className="ri-delete-bin-6-line"></i>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
