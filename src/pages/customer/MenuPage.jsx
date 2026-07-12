import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetCategoriesQuery, useGetFoodsQuery } from '../../store/slices/apiSlice';
import FoodCard from '../../components/customer/FoodCard';
import { Spinner, Pagination, EmptyState } from '../../components/common';
import styles from './MenuPage.module.css';

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(null);
  const [page, setPage] = useState(0);

  const { data: catData } = useGetCategoriesQuery();
  const { data, isLoading } = useGetFoodsQuery({
    page, size: 12, categoryId: selectedCat, search: query,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setPage(0);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <h1 className={styles.pageTitle}>Our Menu</h1>
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>

      <div className={styles.layout}>
        {/* Sidebar filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterTitle}>Categories</div>
          <button
            className={`${styles.catBtn} ${!selectedCat ? styles.catActive : ''}`}
            onClick={() => { setSelectedCat(null); setPage(0); }}
          >
            🍽️ All items
          </button>
          {catData?.content?.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.catBtn} ${selectedCat === cat.id ? styles.catActive : ''}`}
              onClick={() => { setSelectedCat(cat.id); setPage(0); }}
            >
              {cat.name}
            </button>
          ))}
        </aside>

        {/* Food grid */}
        <div className={styles.main}>
          <div className={styles.resultsBar}>
            <span className={styles.resultCount}>
              {data?.totalElements ?? 0} items
              {query && <> for "<strong>{query}</strong>"</>}
            </span>
          </div>
          {isLoading ? (
            <Spinner />
          ) : data?.content?.length === 0 ? (
            <EmptyState icon="🔍" message="No food items found. Try a different search." />
          ) : (
            <>
              <div className={styles.foodGrid}>
                {data.content.map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={data?.totalPages}
                onChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
