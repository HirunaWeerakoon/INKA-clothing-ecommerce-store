import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { searchProducts } from '../../services/productService';
import './SearchResultsPage.css';

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await searchProducts(query);
        if (mounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error searching products:', error);
        if (mounted) {
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [query]);

  return (
    <section className="search-results-page">
      <header className="search-results-header">
        <h1>Search Results</h1>
        {query ? (
          <p>
            Showing {products.length} matching product{products.length === 1 ? '' : 's'} for "{query}"
          </p>
        ) : (
          <p>Showing all products. Type a keyword from the search icon in the header to filter.</p>
        )}
      </header>

      {loading ? (
        <div className="search-results-status">Searching products...</div>
      ) : products.length === 0 ? (
        <div className="search-results-status">No matching products found.</div>
      ) : (
        <div className="search-results-grid">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default SearchResultsPage;
