import { useEffect, useRef, useState } from "react";
import axios from "axios";

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

const Products = () => {
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

      const { data } = await getProductsApi();

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

      const { data } = await getCategoriesApi();

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

      const { data } = await createProductApi(productData);

      if (data?.success) {
        uploadImage(data.id, image);

        const {
          data: { products },
        } = await getProductsApi();

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
      const { data } = await uploadImageApi(id, formData);

      if (data?.success) {
        const {
          data: { products },
        } = await getProductsApi();

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

      const { data } = await updateProductApi(id, productData);

      if (data?.success) {
        if (image) {
          await uploadImage(id, image);
        }

        const {
          data: { products },
        } = await getProductsApi();

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

      const { data } = await deleteProductApi(id);

      if (data?.success) {
        const {
          data: { products },
        } = await getProductsApi();

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

  return (
    <div id="products-page">
      {user ? (
        user?.role === 2 ? (
          <>
            <div className="form-container">
              <form
                ref={formRef}
                id="add-product-form"
                className="flex flex-col">
                <h1 className="text-[30px] font-bold">
                  {updateMode ? "Update" : "Add"} Product
                </h1>
                <div className="input-container flex flex-col gap-2">
                  <label htmlFor="product-name">Product Name</label>
                  <input
                    required
                    value={productName}
                    type="text"
                    name="name"
                    id="product-name"
                    placeholder="Product Name"
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div className="input-container flex flex-col gap-2">
                  <label>Select Category</label>
                  <span
                    ref={validateCategoryRef}
                    className="text-[red]"
                    style={{ display: "none" }}>
                    category name required
                  </span>
                  <select
                    required
                    name="category"
                    id="select-input"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      validateCategoryRef.current.style.display = "none";
                    }}
                    className="bg-[#222] text-white outline">
                    <option hidden value="">
                      Select Category
                    </option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-container flex flex-col gap-2">
                  <label>Price Type</label>
                  <select
                    required
                    value={priceType}
                    name="price_type"
                    id="select-input"
                    onChange={(e) => setPriceType(e.target.value)}
                    className="bg-[#222] text-white outline">
                    <option value="single">single</option>
                    <option value="both">both</option>
                  </select>
                </div>
                <div className="input-container flex flex-col gap-2">
                  {priceType === "single" ? (
                    <>
                      <label htmlFor="product-price">Product Price</label>
                      <input
                        required
                        name="full_price"
                        value={price}
                        type="number"
                        id="product-price"
                        placeholder="Product Price"
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <label htmlFor="product-price">Half Price</label>
                      <input
                        required
                        name="half_price"
                        value={halfPrice}
                        type="number"
                        id="product-price"
                        placeholder="Half Price"
                        onChange={(e) => setHalfPrice(e.target.value)}
                      />
                      <label htmlFor="product-price">Full Price</label>
                      <input
                        required
                        name="full_price"
                        value={fullPrice}
                        type="number"
                        id="product-price"
                        placeholder="Full Price"
                        onChange={(e) => setFullPrice(e.target.value)}
                      />
                    </>
                  )}
                </div>
                <div className="input-container flex flex-col gap-2">
                  <label htmlFor="product-name">Serial Number</label>
                  <input
                    required
                    value={serialNumber}
                    type="text"
                    name="sn"
                    placeholder="Serial Number (used for sorting, optional)"
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </div>
                <div className="input-container flex flex-col gap-2">
                  <div
                    className="input-container flex flex-col gap-2"
                    style={{ display: updateMode ? "none" : "flex" }}>
                    <label htmlFor="product-image">Product Image</label>
                    <input
                      required
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
                  </div>
                  <span
                    style={{
                      display: updateMode ? "block" : "none",
                    }}
                    className="upt-img"
                    onClick={(e) => {
                      refImage.current.click();
                    }}>
                    Change Image
                  </span>

                  <img
                    ref={imageRef}
                    src={imagePreview}
                    alt="Product Preview"
                    className="w-[200px] object-cover"
                    style={{
                      display: imagePreview ? "block" : "none",
                    }}
                  />
                </div>
                {loader ? (
                  <Loader />
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      updateMode
                        ? handleUpdateRequest(productId)
                        : handleSubmit(e);
                    }}
                    className="w-[50%] lg:w-[20%] ">
                    {updateMode ? "Update" : "Add"} Product
                  </button>
                )}
              </form>
            </div>
            <div className="products-container admin-products-container">
              {products?.length ? (
                products?.map((p) => (
                  <div key={p._id} className="product">
                    <div className="product-image">
                      <img
                        src={`data:${p?.mimeType};base64,${p?.image}`}
                        alt="Product"
                      />
                    </div>
                    <span id="product-sn">{p.sn}</span>
                    <div className="product-info">
                      <h2 className="text-[20px] font-bold">{p.name}</h2>
                      <p className="text-[18px] font-bold">
                        {p.category?.name}
                      </p>
                      <p className="text-[16px] font-bold">
                        {p.price_type === "single" ? (
                          <span>Price: {p.full_price} </span>
                        ) : (
                          <span>
                            Half Price: {p.half_price} <br /> Full Price:{" "}
                            {p.full_price}
                          </span>
                        )}
                      </p>
                    </div>
                    {loader ? (
                      <Loader />
                    ) : (
                      <div className="product-actions flex gap-5 justify-center items-center">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded"
                          onClick={() => handleDeleteProduct(p._id)}>
                          Delete
                        </button>
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={(e) => {
                            handleUpdateProduct(p);

                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }}>
                          Update
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <h1>No Products</h1>
              )}
            </div>
          </>
        ) : (
          <h1 className="text-[red] text-[30px] font-bold">
            You are not authorized to access this page.
          </h1>
        )
      ) : (
        <h1 className="text-[red] text-[30px] font-bold">
          You are not allowed to access this page.
        </h1>
      )}
    </div>
  );
};

export default Products;
