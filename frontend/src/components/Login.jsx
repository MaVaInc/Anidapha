// src/components/Login.jsx

import React, { useState, useEffect } from 'react';
import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHeroData } from '../store/heroSlice';
import { fetchInventoryData } from '../store/inventorySlice';
import { fetchDailyReward, clearDailyReward } from '../store/dailyRewardSlice';
import ItemCardInventory from './ItemCardInventory';

const Login = ({ setIsAuthenticated }) => {
  const tg = window.Telegram.WebApp;
  const dispatch = useDispatch();

  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const dailyRewardRedux = useSelector((state) => state.dailyReward.reward);
  const dailyRewardStatus = useSelector((state) => state.dailyReward.status);

  useEffect(() => {
    tg.expand();
    const isDebug = !tg.initData || tg.initData === '';
    const apiUrl = isDebug ? 'http://localhost:8000/api' : '/api';

    if (isDebug || (tg.initDataUnsafe && tg.initDataUnsafe.user)) {
      fetch(`${apiUrl}/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData: tg.initData }),
      })
        .then(response => response.json())
        .then(data => {
          setWelcomeMessage(data.welcome_message);
          if (!data.registered) {
            setUsername(data.suggested_username);
          } else {
            localStorage.setItem('token', data.access_token);
            setIsRegistered(true);
            setIsAuthenticated(true);
            dispatch(fetchHeroData());
            dispatch(fetchInventoryData());
            dispatch(fetchDailyReward());
          }
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [tg.initData, setIsAuthenticated, dispatch]);

  useEffect(() => {
    if (dailyRewardRedux) {
      alert(`Вы получили: ${dailyRewardRedux.name}`);
      // Очистка награды после отображения
      dispatch(clearDailyReward());
    }
  }, [dailyRewardRedux, dispatch]);

  const handleUsernameSubmit = () => {
    const apiUrl = !tg.initData || tg.initData === '' ? 'http://localhost:8000/api' : '/api';

    fetch(`${apiUrl}/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData: tg.initData }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          setIsAuthenticated(true);

          const token = data.access_token;
          fetch(`${apiUrl}/set_username/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ username }),
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert(`Вы получили: ${data.seed}`);
                setIsRegistered(true);
                dispatch(fetchHeroData());
                dispatch(fetchInventoryData());
                dispatch(fetchDailyReward());
              } else {
                alert('Error saving username');
              }
            })
            .catch(error => console.error('Error:', error));
        } else {
          console.error('Authentication failed');
        }
      })
      .catch(error => console.error('Error authenticating user:', error));
  };

  return (
    <div className="login-screen">
      <h1>{welcomeMessage}</h1>
      {!isRegistered && (
        <div className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose your nickname"
            className="login-input"
          />
          <button onClick={handleUsernameSubmit} className="login-button">
            Save Nickname
          </button>
        </div>
      )}
      {dailyRewardRedux && (
        <ItemCardInventory
          data={{ item: dailyRewardRedux }}
          onClose={() => {}}
        />
      )}
    </div>
  );
};

export default Login;
