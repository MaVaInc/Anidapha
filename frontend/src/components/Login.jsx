import React, { useState, useEffect } from 'react';
import './Login.css';  // Не забудьте создать и подключить файл CSS для стилей
import axios from 'axios'; // Добавьте этот импорт
const Login = ({ setIsAuthenticated }) => {
    const tg = window.Telegram.WebApp;
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [username, setUsername] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
const handleLogin = async () => {
    try {
        const response = await axios.post('/api/auth', { /* данные для логина */ });
        const { access_token, refresh_token } = response.data;

        if (access_token && refresh_token) {
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            // Перенаправление на страницу фермы или главную страницу
            console.log("Tokens successfully saved.");
            console.log(access_token);
            console.log(refresh_token);
        } else {
            console.error("Токены отсутствуют в ответе сервера");
        }
    } catch (error) {
        console.error("Ошибка входа", error);
    }
};


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
            .then(response => response.json())
            .then(data => {
                setWelcomeMessage(data.welcome_message);

                if (!data.registered) {
                    setUsername(data.suggested_username);
                } else {
                    localStorage.setItem('access_token', data.access_token);
                    setIsRegistered(true);
                    setIsAuthenticated(true);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
        }
    }, [tg.initData, setIsAuthenticated]);

    const handleUsernameSubmit = () => {
        const access_token = localStorage.getItem('access_token');
        const apiUrl = !tg.initData || tg.initData === '' ? 'http://localhost:8000/api' : '/api';

        fetch(`${apiUrl}/set_username/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify({ username }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Username saved: ${data.username}`);
                setIsRegistered(true);
                setIsAuthenticated(true);  // Пользователь залогинился после сохранения ника
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
        </div>
    );
};

export default Login;
