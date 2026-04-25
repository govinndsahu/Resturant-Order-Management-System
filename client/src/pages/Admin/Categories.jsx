import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Categories = () => {
  const createForm = useRef();
  const updateForm = useRef();
  const tableBody = useRef();

  const aid = JSON.parse(localStorage.getItem("user"))?.id;
  const user = JSON.parse(localStorage.getItem("user"));

  const [switchForm, setSwitchForm] = useState(true);
  const [createName, setCreateName] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState(
    JSON.parse(localStorage.getItem("categories")),
  );

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URI}/categories`,
      );
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
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URI}/categories/create`,
        { name: createName },
        {
          withCredentials: true,
        },
      );
      if (data?.success) {
        setCreateName("");
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
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URI}/categories/delete/${id}`,
        {
          withCredentials: true,
        },
      );
      if (data?.success) {
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
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URI}/categories/update/${id}`,
        { name: updateName },
        {
          withCredentials: true,
        },
      );
      if (data?.success) {
        setLoading(true);
        setUpdateName("");
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
                    <td>{i + 1}.</td>
                    <td>{category.name}</td>
                    <td className="actions">
                      <button
                        className="update"
                        onClick={(e) => {
                          setSwitchForm(false);
                          setUpdateName(category.name);
                          setCategoryId(category._id);
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
