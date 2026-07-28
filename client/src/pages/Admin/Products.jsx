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

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const Products = () => {
  const { backendUrl, menu, user } = useConfig();

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
  const [serialNumber, setSerialNumber] = useState("1");
  const [imagePreview, setImagePreview] = useState(null);

  const [updateMode, setUpdateMode] = useState(false);
  const [loader, setLoader] = useState(false);

  // Validation errors state
  const [errors, setErrors] = useState({});

  const imageRef = useRef();
  const refImage = useRef();
  const formRef = useRef();

  // Refs for scrolling to errors
  const nameRef = useRef();
  const categoryRef = useRef();
  const priceTypeRef = useRef();
  const snRef = useRef();
  const priceRef = useRef();
  const halfPriceRef = useRef();
  const fullPriceRef = useRef();
  const imageGroupRef = useRef();

  const productData = {
    id: productId,
    name: productName.trim(),
    category,
    price_type: priceType,
    full_price:
      priceType === "single" ? Number(price) || 0 : Number(fullPrice) || 0,
    half_price: priceType === "both" ? Number(halfPrice) || 0 : null,
    image,
    sn: Number(serialNumber) || 0,
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

  // ─── VALIDATION ─────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    // 1. Product Name
    const trimmedName = productName.trim();
    if (!trimmedName) {
      newErrors.name = "Product name is required";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Product name must be at least 2 characters";
    } else if (trimmedName.length > 100) {
      newErrors.name = "Product name must not exceed 100 characters";
    }

    // 2. Category
    if (!category) {
      newErrors.category = "Please select a category";
    }

    // 3. Price Type
    if (!priceType) {
      newErrors.priceType = "Price type is required";
    }

    // 4. Serial Number
    const sn = Number(serialNumber);
    if (!serialNumber || serialNumber === "") {
      newErrors.serialNumber = "Serial number is required";
    } else if (isNaN(sn) || sn < 1) {
      newErrors.serialNumber = "Serial number must be at least 1";
    } else if (!Number.isInteger(sn)) {
      newErrors.serialNumber = "Serial number must be a whole number";
    }

    // 5. Prices
    if (priceType === "single") {
      const p = Number(price);
      if (!price || price === "") {
        newErrors.price = "Price is required";
      } else if (isNaN(p) || p <= 0) {
        newErrors.price = "Price must be greater than 0";
      } else if (p > 999999) {
        newErrors.price = "Price seems too high";
      }
    } else {
      const hp = Number(halfPrice);
      const fp = Number(fullPrice);

      if (!halfPrice || halfPrice === "") {
        newErrors.halfPrice = "Half price is required";
      } else if (isNaN(hp) || hp <= 0) {
        newErrors.halfPrice = "Half price must be greater than 0";
      } else if (hp > 999999) {
        newErrors.halfPrice = "Half price seems too high";
      }

      if (!fullPrice || fullPrice === "") {
        newErrors.fullPrice = "Full price is required";
      } else if (isNaN(fp) || fp <= 0) {
        newErrors.fullPrice = "Full price must be greater than 0";
      } else if (fp > 999999) {
        newErrors.fullPrice = "Full price seems too high";
      }

      // Logical: half must be less than full
      if (!isNaN(hp) && !isNaN(fp) && hp >= fp) {
        newErrors.halfPrice = "Half price must be less than full price";
        newErrors.fullPrice = "Full price must be greater than half price";
      }
    }

    // 6. Image
    if (!updateMode) {
      // Creating: image is required
      if (!image) {
        newErrors.image = "Product image is required";
      } else if (image instanceof File) {
        if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
          newErrors.image = "Only JPG, JPEG, or PNG images are allowed";
        }
        if (image.size > MAX_IMAGE_SIZE_BYTES) {
          newErrors.image = `Image must be under ${MAX_IMAGE_SIZE_MB}MB`;
        }
      }
    } else {
      // Updating: image only validated if user selected a new one
      if (image instanceof File) {
        if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
          newErrors.image = "Only JPG, JPEG, or PNG images are allowed";
        }
        if (image.size > MAX_IMAGE_SIZE_BYTES) {
          newErrors.image = `Image must be under ${MAX_IMAGE_SIZE_MB}MB`;
        }
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  const scrollToFirstError = (errorObj) => {
    const fieldOrder = [
      { key: "name", ref: nameRef },
      { key: "category", ref: categoryRef },
      { key: "priceType", ref: priceTypeRef },
      { key: "serialNumber", ref: snRef },
      { key: "price", ref: priceRef },
      { key: "halfPrice", ref: halfPriceRef },
      { key: "fullPrice", ref: fullPriceRef },
      { key: "image", ref: imageGroupRef },
    ];

    for (const field of fieldOrder) {
      if (errorObj[field.key]) {
        field.ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        // Focus the first input inside the group if possible
        const input = field.ref.current?.querySelector(
          "input, select, textarea",
        );
        input?.focus();
        break;
      }
    }
  };

  const clearFieldError = (fieldName) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };
  // ────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        scrollToFirstError(validationErrors);
        return;
      }

      setLoader(true);

      const { data } = await createProductApi(
        productData,
        backendUrl,
        menu?._id,
      );

      if (data?.success) {
        uploadImage(data.id, image);

        const {
          data: { products },
        } = await getProductsApi(backendUrl);

        await saveAllProducts(products);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async (id, file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await uploadImageApi(
        id,
        formData,
        backendUrl,
        menu?._id,
      );

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
        setSerialNumber("");
        setErrors({});
        fetchProducts();
        formRef.current.reset();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
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
    setErrors({});
  };

  const handleUpdateRequest = async (id) => {
    try {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        scrollToFirstError(validationErrors);
        return;
      }

      setLoader(true);

      const { data } = await updateProductApi(
        id,
        productData,
        backendUrl,
        menu?._id,
      );

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
        setErrors({});
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
      const { data } = await deleteProductApi(id, backendUrl, menu?._id);
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
              <div className="prod-form-group" ref={nameRef}>
                <label htmlFor="product-name">
                  <i className="ri-price-tag-3-line"></i>
                  Product Name
                </label>
                {errors.name && (
                  <span className="prod-error-text">
                    <i className="ri-error-warning-line"></i>
                    {errors.name}
                  </span>
                )}
                <input
                  required
                  value={productName}
                  type="text"
                  name="name"
                  id="product-name"
                  placeholder="e.g., Paneer Tikka"
                  onChange={(e) => {
                    setProductName(e.target.value);
                    clearFieldError("name");
                  }}
                  className={errors.name ? "prod-input-error" : ""}
                />
              </div>
              <div className="prod-form-group" ref={categoryRef}>
                <label htmlFor="select-category">
                  <i className="ri-apps-line"></i>
                  Category
                </label>
                {errors.category && (
                  <span className="prod-error-text">
                    <i className="ri-error-warning-line"></i>
                    {errors.category}
                  </span>
                )}
                <select
                  required
                  name="category"
                  id="select-category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    clearFieldError("category");
                  }}
                  className={errors.category ? "prod-input-error" : ""}>
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
              <div className="prod-form-group" ref={priceTypeRef}>
                <label htmlFor="price-type">
                  <i className="ri-money-rupee-circle-line"></i>
                  Price Type
                </label>
                {errors.priceType && (
                  <span className="prod-error-text">
                    <i className="ri-error-warning-line"></i>
                    {errors.priceType}
                  </span>
                )}
                <select
                  required
                  value={priceType}
                  name="price_type"
                  id="price-type"
                  onChange={(e) => {
                    setPriceType(e.target.value);
                    clearFieldError("priceType");
                    if (e.target.value === "single") {
                      setHalfPrice("");
                      clearFieldError("halfPrice");
                      clearFieldError("fullPrice");
                    }
                  }}
                  className={errors.priceType ? "prod-input-error" : ""}>
                  <option value="single">Single Price</option>
                  <option value="both">Half & Full</option>
                </select>
              </div>
              <div className="prod-form-group prod-sn-group" ref={snRef}>
                <label htmlFor="serial-number">
                  <i className="ri-hashtag"></i>
                  S.N
                </label>
                {errors.serialNumber && (
                  <span className="prod-error-text">
                    <i className="ri-error-warning-line"></i>
                    {errors.serialNumber}
                  </span>
                )}
                <input
                  required
                  value={serialNumber}
                  type="number"
                  name="sn"
                  id="serial-number"
                  placeholder="1"
                  min="1"
                  step="1"
                  onChange={(e) => {
                    setSerialNumber(e.target.value);
                    clearFieldError("serialNumber");
                  }}
                  className={errors.serialNumber ? "prod-input-error" : ""}
                />
              </div>
            </div>

            {/* Row 3: Prices */}
            <div className="prod-form-row">
              {priceType === "single" ? (
                <div className="prod-form-group" ref={priceRef}>
                  <label htmlFor="product-price">
                    <i className="ri-money-rupee-circle-line"></i>
                    Price (₹)
                  </label>
                  {errors.price && (
                    <span className="prod-error-text">
                      <i className="ri-error-warning-line"></i>
                      {errors.price}
                    </span>
                  )}
                  <input
                    required
                    name="full_price"
                    value={price}
                    type="number"
                    id="product-price"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    onChange={(e) => {
                      setPrice(e.target.value);
                      clearFieldError("price");
                    }}
                    className={errors.price ? "prod-input-error" : ""}
                  />
                </div>
              ) : (
                <>
                  <div className="prod-form-group" ref={halfPriceRef}>
                    <label htmlFor="half-price">
                      <i className="ri-scissors-cut-line"></i>
                      Half Price (₹)
                    </label>
                    {errors.halfPrice && (
                      <span className="prod-error-text">
                        <i className="ri-error-warning-line"></i>
                        {errors.halfPrice}
                      </span>
                    )}
                    <input
                      required
                      name="half_price"
                      value={halfPrice}
                      type="number"
                      id="half-price"
                      placeholder="Half price"
                      min="0"
                      step="0.01"
                      onChange={(e) => {
                        setHalfPrice(e.target.value);
                        clearFieldError("halfPrice");
                      }}
                      className={errors.halfPrice ? "prod-input-error" : ""}
                    />
                  </div>
                  <div className="prod-form-group" ref={fullPriceRef}>
                    <label htmlFor="full-price">
                      <i className="ri-restaurant-2-line"></i>
                      Full Price (₹)
                    </label>
                    {errors.fullPrice && (
                      <span className="prod-error-text">
                        <i className="ri-error-warning-line"></i>
                        {errors.fullPrice}
                      </span>
                    )}
                    <input
                      required
                      name="full_price"
                      value={fullPrice}
                      type="number"
                      id="full-price"
                      placeholder="Full price"
                      min="0"
                      step="0.01"
                      onChange={(e) => {
                        setFullPrice(e.target.value);
                        clearFieldError("fullPrice");
                      }}
                      className={errors.fullPrice ? "prod-input-error" : ""}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Image Upload */}
            <div
              className="prod-form-group prod-image-group"
              ref={imageGroupRef}>
              <label>
                <i className="ri-image-line"></i>
                Product Image
              </label>
              {errors.image && (
                <span className="prod-error-text">
                  <i className="ri-error-warning-line"></i>
                  {errors.image}
                </span>
              )}
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
                    const file = e.target.files[0];
                    setImage(file || "");
                    if (file) handleImagePreview(e);
                    else setImagePreview(null);
                    clearFieldError("image");
                  }}
                  className={errors.image ? "prod-input-error" : ""}
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
                      clearFieldError("image");
                    }}>
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            {loader ? (
              <div className="prod-submit-btn prod-loading-btn">
                Working... <span class="p-loader"></span>
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
                      setErrors({});
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
