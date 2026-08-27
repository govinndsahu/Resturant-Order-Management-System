import "../../css/categories.css";
import { useEffect, useRef, useState } from "react";

import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoriesApi,
  updateCategoryApi,
} from "../../apis/categoryApis";

import { useConfig } from "../../contexts/ConfigContext";

const Categories = () => {
  const createForm = useRef();
  const updateForm = useRef();

  const { backendUrl, menu } = useConfig();
  const user = JSON.parse(localStorage.getItem("user"));

  const [categories, setCategories] = useState([]);
  const [switchForm, setSwitchForm] = useState(true);

  const [createName, setCreateName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategoriesApi(backendUrl);
      console.log(data);

      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async () => {
    if (!createName.trim()) return;

    try {
      setLoading(true);

      const { data } = await createCategoryApi(
        createName,
        serialNumber || 1,
        backendUrl,
        menu?._id,
      );

      if (data?.success) {
        setCreateName("");
        setSerialNumber("");
        fetchCategories();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(true);

      const { data } = await deleteCategoryApi(id, backendUrl, menu?._id);

      
      if (data?.success) {
        console.log(data);
        fetchCategories();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!updateName.trim()) return;

    try {
      setLoading(true);

      const { data } = await updateCategoryApi(
        id,
        updateName,
        serialNumber || 1,
        backendUrl,
        menu?._id,
      );

      if (data?.success) {
        setUpdateName("");
        setSerialNumber("");
        setCategoryId("");
        setSwitchForm(true);
        fetchCategories();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="cat-page">
      {/* Header */}
      <div className="cat-header">
        <div className="cat-header-content">
          <div className="cat-header-icon">
            <i className="ri-apps-line"></i>
          </div>
          <div>
            <h1>Manage Categories</h1>
            <p>Create and organize your menu categories</p>
          </div>
        </div>
      </div>

      <div className="cat-container">
        {/* Form Card */}
        <div className="cat-form-card">
          <div className="cat-form-header">
            <i
              className={
                switchForm ? "ri-add-circle-line" : "ri-edit-circle-line"
              }></i>
            <h2>{switchForm ? "Create Category" : "Update Category"}</h2>
          </div>

          {switchForm ? (
            <form
              ref={createForm}
              className="cat-form"
              onSubmit={(e) => e.preventDefault()}>
              <div className="cat-form-row">
                <div className="cat-form-group">
                  <label>
                    <i className="ri-price-tag-3-line"></i>
                    Category Name
                  </label>
                  <input
                    type="text"
                    name="categoryName"
                    placeholder="e.g., Veg Rice, Indian Non-veg"
                    required
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                  />
                </div>
                <div className="cat-form-group cat-sn-group">
                  <label>
                    <i className="ri-hashtag"></i>
                    S.N
                  </label>
                  <input
                    type="number"
                    name="sn"
                    placeholder="1"
                    min="1"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`cat-submit-btn ${loading ? "loading" : ""}`}
                onClick={createCategory}
                disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="ri-add-line"></i>
                    Create Category
                  </>
                )}
              </button>
            </form>
          ) : (
            <form
              ref={updateForm}
              className="cat-form"
              onSubmit={(e) => e.preventDefault()}>
              <div className="cat-form-row">
                <div className="cat-form-group">
                  <label>
                    <i className="ri-price-tag-3-line"></i>
                    Category Name
                  </label>
                  <input
                    type="text"
                    name="categoryName"
                    placeholder="Update category name"
                    required
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
                  />
                </div>
                <div className="cat-form-group cat-sn-group">
                  <label>
                    <i className="ri-hashtag"></i>
                    S.N
                  </label>
                  <input
                    type="number"
                    name="sn"
                    placeholder="1"
                    min="1"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="cat-form-actions">
                <button
                  type="button"
                  className="cat-cancel-btn"
                  onClick={() => {
                    setSwitchForm(true);
                    setUpdateName("");
                    setSerialNumber("");
                    setCategoryId("");
                  }}>
                  <i className="ri-close-line"></i>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`cat-submit-btn ${loading ? "loading" : ""}`}
                  onClick={() => handleUpdate(categoryId)}
                  disabled={loading}>
                  {loading ? (
                    <>
                      <span className="btn-spinner"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="ri-check-line"></i>
                      Update Category
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Categories List */}
        <div className="cat-list-section">
          <div className="cat-list-header">
            <h2>
              <i className="ri-list-check-2"></i>
              All Categories
            </h2>
            <span className="cat-count">{categories.length} categories</span>
          </div>

          {categories.length === 0 ? (
            <div className="cat-empty">
              <i className="ri-inbox-line"></i>
              <p>No categories yet. Create your first one!</p>
            </div>
          ) : (
            <div className="cat-list">
              {categories.map((category, i) => (
                <div key={category._id} className="cat-item">
                  <div className="cat-item-info">
                    <div className="cat-item-number">
                      {category.sn || i + 1}
                    </div>
                    <div className="cat-item-name">{category.name}</div>
                  </div>
                  <div className="cat-item-actions">
                    <button
                      className="cat-btn-update"
                      onClick={() => {
                        setSwitchForm(false);
                        setUpdateName(category.name);
                        setCategoryId(category._id);
                        setSerialNumber(category.sn);
                      }}>
                      <i className="ri-edit-line"></i>
                      <span>Edit</span>
                    </button>
                    <button
                      className="cat-btn-delete"
                      onClick={() => deleteCategory(category._id)}
                      disabled={loading}>
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

export default Categories;
