import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../../../services/categoryService';
import './CategorySection.css';

// Fallback static categories when backend has no data yet
const FALLBACK_CATEGORIES = [
  { categoryId: 1, categoryName: 'T-SHIRTS',    imageUrl: null },
  { categoryId: 2, categoryName: 'DENIMS',      imageUrl: null },
  { categoryId: 3, categoryName: 'TOTE BAGS',   imageUrl: null },
  { categoryId: 4, categoryName: 'ACCESSORIES', imageUrl: null },
];

function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getAllCategories()
      .then((data) => {
        setCategories(data.length > 0 ? data : FALLBACK_CATEGORIES);
      })
      .catch(() => setCategories(FALLBACK_CATEGORIES))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="category-section">
      <h2 className="category-section__title">SHOP BY CATEGORY</h2>

      {loading ? (
        <div className="category-section__grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="category-card category-card--skeleton" />
          ))}
        </div>
      ) : (
        <div className="category-section__grid">
          {categories.map((cat) => (
            <Link
              to={`/shop?category=${cat.categoryId}`}
              key={cat.categoryId}
              className="category-card"
            >
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.categoryName}
                  className="category-card__img"
                />
              ) : (
                <div className="category-card__placeholder" aria-hidden="true" />
              )}
              <span className="category-card__label">{cat.categoryName}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default CategorySection;
