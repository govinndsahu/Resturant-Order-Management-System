import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { getAllCategories, saveAllCategories } from "../hooks/useIndexedDB";
import { getCategoriesApi } from "../apis/categoryApis";
import { useConfig } from "../contexts/ConfigContext";

const CategoriesContainer = ({ setCategory }) => {
  const { backendUrl } = useConfig();

  const [categories, setCategories] = useState("");
  const categoriesRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const cached = await getAllCategories();

      if (cached?.length > 0) {
        setCategories(cached);
        return;
      }

      const { data } = await getCategoriesApi(backendUrl);

      if (data?.success) {
        setCategories(data?.categories);
        await saveAllCategories(data?.categories);
      } else {
        console.log("Server Problem");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const activeCategory = (e) => {
    const categories = categoriesRef.current.querySelectorAll(".category");
    categories.forEach((category) => {
      category.classList.remove("active-category");
    });
    e.target.classList.add("active-category");
  };

  return categories?.length === 0 ? (
    <h1>No categories found.</h1>
  ) : (
    <div
      ref={categoriesRef}
      className="categories-container w-full flex items-center gap-[50px] fixed top-16 h-15 lg:h-20 left-0 z-1 ">
      <button
        className="active-category category"
        onClick={(e) => {
          setCategory("");
          activeCategory(e);
        }}>
        All
      </button>
      {categories?.map((c) => (
        <button
          key={c._id}
          className="category text-nowrap"
          onClick={(e) => {
            setCategory(c.name);
            activeCategory(e);
          }}>
          {c.name}
        </button>
      ))}
    </div>
  );
};

export default CategoriesContainer;
