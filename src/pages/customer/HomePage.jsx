import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery, useGetFoodsQuery } from '../../store/slices/apiSlice';
import FoodCard from '../../components/customer/FoodCard';
import { Spinner } from '../../components/common';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);

  const { data: catData } = useGetCategoriesQuery();
  const { data: foodData, isLoading } = useGetFoodsQuery({
    size: 8,
    categoryId: selectedCat,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/menu?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>🔥 Free delivery today</span>
          <h1 className={styles.heroTitle}>
            Hungry? <em>Order</em><br />in minutes.
          </h1>
          <p className={styles.heroSub}>Fresh food from top restaurants, delivered fast to your door.</p>
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search burgers, pizza, sushi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className={styles.heroDecor}>🍔</div>
      </section>

      <div className={styles.content}>
        {/* Categories */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <div className={styles.sectionLabel}>Browse</div>
              <h2 className={styles.sectionTitle}>What are you craving?</h2>
            </div>
            <Link to="/menu" className={styles.viewAll}>View all →</Link>
          </div>
          <div className={styles.catPills}>
            <button
              className={`${styles.pill} ${!selectedCat ? styles.pillActive : ''}`}
              onClick={() => setSelectedCat(null)}
            >
              🍽️ All
            </button>
            {catData?.content?.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.pill} ${selectedCat === cat.id ? styles.pillActive : ''}`}
                onClick={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Food Grid */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Popular items</h2>
          </div>
          {isLoading ? (
            <Spinner />
          ) : (
            <div className={styles.foodGrid}>
              {foodData?.content?.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
          <div className={styles.viewMoreWrap}>
            <Link to="/menu" className={styles.viewMoreBtn}>
              See full menu →
            </Link>
          </div>
        </section>

        {/* Promo Banner */}
        <section className={styles.promoBanner}>
          <div>
            <h3>Your first order is special 🎉</h3>
            <p>Use code <strong>FLAVR10</strong> for 10% off your first order</p>
          </div>
          <Link to="/menu" className={styles.promoBtn}>Order Now</Link>
        </section>
      </div>
    </div>
  );
}
