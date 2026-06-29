import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { getAllCategories, saveAllCategories } from "../../hooks/useIndexedDB";

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
  const tableBody = useRef();

  const { backendUrl } = useConfig();

  const user = JSON.parse(localStorage.getItem("user"));

  const [categories, setCategories] = useState([]);

  const [switchForm, setSwitchForm] = useState(true);

  const [createName, setCreateName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async () => {
    try {
      setLoading(false);

      const { data } = await createCategoryApi(
        createName,
        serialNumber || 1,
        backendUrl,
      );

      if (data?.success) {
        const {
          data: { categories },
        } = await getCategoriesApi(backendUrl);

        await saveAllCategories(categories);

        setCreateName("");
        setSerialNumber("");
        fetchCategories();
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(false);

      const { data } = await deleteCategoryApi(id, backendUrl);

      if (data?.success) {
        const {
          data: { categories },
        } = await getCategoriesApi(backendUrl);

        await saveAllCategories(categories);

        setLoading(true);
        fetchCategories();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      setLoading(false);

      const { data } = await updateCategoryApi(
        id,
        updateName,
        serialNumber || 1,
        backendUrl,
      );

      if (data?.success) {
        const {
          data: { categories },
        } = await getCategoriesApi(backendUrl);

        await saveAllCategories(categories);

        setLoading(true);
        setUpdateName("");
        setSerialNumber("");
        setCategoryId("");
        setSwitchForm(true);
        fetchCategories();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="admin-categories-page">
      {user ? (
        user?.role < 2 ? (
          <h2 className="text-2xl">
            You are not authorized to visit this page!
          </h2>
        ) : (
          <div className="container">
            <h1 className="text-[18px] font-[600]">Manage Categories</h1>
            <br />
            {switchForm ? (
              <form ref={createForm} id="create-form" className="md:w-[500px]">
                <input
                  type="text"
                  id="create-name"
                  name="categoryName"
                  placeholder="Create new category"
                  required
                  value={createName}
                  onChange={(e) => {
                    setCreateName(e.target.value);
                  }}
                />
                <input
                  type="number"
                  id="create-serial"
                  name="sn"
                  placeholder="Serial Number"
                  required
                  value={serialNumber}
                  onChange={(e) => {
                    setSerialNumber(e.target.value);
                  }}
                />
                {loading ? (
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      createCategory();
                    }}>
                    Create
                  </button>
                ) : (
                  <span className="loader"></span>
                )}
              </form>
            ) : (
              <form ref={updateForm} id="update-form" className="md:w-[500px]">
                <input
                  type="text"
                  id="category-name"
                  name="categoryName"
                  placeholder="Update category"
                  required
                  value={updateName}
                  onChange={(e) => {
                    setUpdateName(e.target.value);
                  }}
                />
                <input
                  type="number"
                  id="create-serial"
                  name="sn"
                  placeholder="Serial Number"
                  required
                  value={serialNumber}
                  onChange={(e) => {
                    setSerialNumber(e.target.value);
                  }}
                />
                {loading ? (
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpdate(categoryId);
                    }}>
                    Update
                  </button>
                ) : (
                  <span className="loader"></span>
                )}
              </form>
            )}
            <h2>All Categories</h2>
            <table id="categories-table">
              <thead>
                <tr>
                  <th>S.N</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody ref={tableBody}>
                {categories?.map((category, i) => (
                  <tr key={category._id}>
                    <td>{category.sn}.</td>
                    <td>{category.name}</td>
                    <td className="actions">
                      <button
                        className="update"
                        onClick={(e) => {
                          setSwitchForm(false);
                          setUpdateName(category.name);
                          setCategoryId(category._id);
                          setSerialNumber(category.sn);
                        }}>
                        Update
                      </button>
                      {loading ? (
                        <button
                          className="delete"
                          onClick={(e) => {
                            deleteCategory(category._id);
                          }}>
                          Delete
                        </button>
                      ) : (
                        <span className="loader"></span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <h2 className="text-2xl">You are not authorized to visit this page!</h2>
      )}
    </div>
  );
};

export default Categories;
