import { useEffect, useRef, useState } from "react";
import { getAllCategories, saveAllCategories } from "../hooks/useIndexedDB";
import { getCategoriesApi } from "../apis/categoryApis";
import { useConfig } from "../contexts/ConfigContext";

const CategoriesContainer = ({ setCategory }) => {
  const { backendUrl } = useConfig();

  const [categories, setCategories] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const categoriesRef = useRef(null);
  const scrollRef = useRef(null);

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

  const handleCategoryClick = (index, catName) => {
    setActiveIndex(index);
    setCategory(catName);
  };

  return categories?.length === 0 ? (
    <div className="categories-loading">
      <span className="cat-skeleton"></span>
      <span className="cat-skeleton"></span>
      <span className="cat-skeleton"></span>
    </div>
  ) : (
    <div ref={categoriesRef} className="categories-wrapper">
      <div ref={scrollRef} className="categories-scroll">
        <button
          className={`category-pill ${activeIndex === 0 ? "active" : ""}`}
          onClick={() => handleCategoryClick(0, "")}>
          All
        </button>
        {categories?.map((c, idx) => (
          <button
            key={c._id}
            className={`category-pill ${activeIndex === idx + 1 ? "active" : ""}`}
            onClick={() => handleCategoryClick(idx + 1, c.name)}>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesContainer;
