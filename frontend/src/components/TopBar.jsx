import React, { useEffect } from 'react';
import './TopBar.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHeroData } from '../store/heroSlice';

const TopBar = () => {
  const dispatch = useDispatch();
  const hero = useSelector((state) => state.hero.data);
  const heroStatus = useSelector((state) => state.hero.status);

  useEffect(() => {
    if (heroStatus === 'idle') {
      dispatch(fetchHeroData());
    }
  }, [dispatch, heroStatus]);

  if (!hero) return <p>Loading...</p>;

  return (
    <header className="top-bar">
      <div className="coin">
        <img src="/images/dogs_ico.png" alt="Dogs" className="coin-img" />
        <span>{hero.dogs_balance}</span>
      </div>
    </header>
  );
};

export default TopBar;
