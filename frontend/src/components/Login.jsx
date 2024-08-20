import React, { useState, useEffect } from 'react';
import './Login.css';
import {saveHeroData, saveInventory} from '../db/HeroDB';
import { initSwipeBehavior } from '@telegram-apps/sdk';

const Login = ({ setIsAuthenticated }) => {
    const tg = window.Telegram.WebApp;

    // Инициализация поведения свайпа
    useEffect(() => {
        const [swipeBehavior] = initSwipeBehavior();
        swipeBehavior.disableVerticalSwipe();  // Отключаем вертикальный свайп
    }, []);

    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [username, setUsername] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userInventory, setInventory] = useState(null);

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
                    fetchUserData(localStorage.getItem('token'), apiUrl);
                    fetchUserInventory(localStorage.getItem('token'), apiUrl);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
        }
    }, [tg.initData, setIsAuthenticated]);

    const fetchUserData = (token, apiUrl) => {
        fetch(`${apiUrl}/user_data/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            setUserData(data);
            saveHeroData(data);
        })
        .catch(error => console.error('Error fetching user data:', error));
    };
    const fetchUserInventory = (token, apiUrl) => {
        fetch(`${apiUrl}/inventory/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('data')
            console.log(data)
            setInventory(data);
            saveInventory(data);
        })
        .catch(error => console.error('Error fetching user data:', error));
    };
const handleUsernameSubmit = () => {
    const apiUrl = !tg.initData || tg.initData === '' ? 'http://localhost:8000/api' : '/api';

    // Аутентификация перед отправкой данных
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

            // Теперь выполняем основную логику после аутентификации
            const token = data.access_token
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
                    alert(`Вы получили : ${data.seed} `);
                    setIsRegistered(true);
                    fetchUserData(token, apiUrl);
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
            {userData && (
                <div className="user-data">
                    <h2>Welcome, {userData.username}</h2>
                    {/* Вы можете добавить больше данных пользователя здесь */}
                </div>
            )}
        </div>
    );
};

export default Login;
