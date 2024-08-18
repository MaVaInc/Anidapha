import React, { useState, useEffect } from 'react';
import './Login.css';
import {saveHeroData} from "../db/HeroDB";  // Не забудьте создать и подключить файл CSS для стилей

const Login = ({ setIsAuthenticated }) => {
    const tg = window.Telegram.WebApp;
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [username, setUsername] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [userData, setUserData] = useState(null); // Добавляем состояние для данных пользователя

    useEffect(() => {
        const isDebug = !tg.initData || tg.initData === '';
        const apiUrl = isDebug ? 'http://localhost:8000/api' : '/api';

        if (isDebug || (tg.initDataUnsafe && tg.initDataUnsafe.user)) {
            const userId = isDebug ? 'debug-user' : tg.initDataUnsafe.user.id;

            // Проверяем регистрацию пользователя и получаем данные
            fetch(`${apiUrl}/auth/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ initData: tg.initData }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to authenticate');
                }
                return response.json();
            })
            .then(data => {
                console.log('Server response:', data); // Выводим весь ответ сервера для отладки
                setWelcomeMessage(data.welcome_message);
                if (!data.registered) {
                    setUsername(data.suggested_username);
                } else {
                    if (data.access_token) {
                        console.log('Received token:', data.access_token); // Для отладки
                        localStorage.setItem('token', data.access_token);
                        setIsRegistered(true);
                        setIsAuthenticated(true); // Пользователь уже зарегистрирован

                        // Делаем запрос на получение данных пользователя
                        fetchUserData(data.access_token, apiUrl);
                    } else {
                        console.error('No access token found in response');
                    }
                }
            })
            .catch(error => console.error('Error fetching data:', error));
        }
    }, [tg.initData, setIsAuthenticated]);

    // Функция для получения данных пользователя
    const fetchUserData = (token, apiUrl) => {
       fetch(`${apiUrl}/user_data`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    redirect: 'follow' // Автоматически следовать перенаправлению
})
.then(response => response.json())
.then(data => {
    console.log('User data:', data);
    setUserData(data);
    saveHeroData(data)
})
.catch(error => console.error('Error fetching user data:', error));

    };

    const handleUsernameSubmit = () => {
        const token = localStorage.getItem('token');
        const apiUrl = !tg.initData || tg.initData === '' ? 'http://localhost:8000/api' : '/api';

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
                alert(`Username saved: ${data.username}`);
                setIsRegistered(true);
                setIsAuthenticated(true);  // Пользователь залогинился после сохранения ника

                // Обновляем данные пользователя после сохранения ника
                fetchUserData(token, apiUrl);
            } else {
                alert('Error saving username');
            }
        })
        .catch(error => console.error('Error:', error));
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
                    <p>Email: {userData.email}</p>
                    {/* Добавьте другие данные пользователя по необходимости */}
                </div>
            )}
        </div>
    );
};

export default Login;
