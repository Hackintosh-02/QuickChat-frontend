    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';

    interface LoginProps {
        onLogin: (authStatus: boolean) => void;
    }

    const Login: React.FC<LoginProps> = ({ onLogin }) => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const navigate = useNavigate();

        const handleLogin = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include',  // Include credentials to send cookies
                });

                if (response.ok) {
                    const data = await response.json();  // Parse the response body as JSON
                    // console.log('Login response:', data);

                    if (data._id) {
                        localStorage.setItem('userId', data._id);  // Store the user ID in localStorage
                        // console.log('Login Successful, User ID stored');

                        onLogin(true);  // Update the authentication state in App
                        // console.log('Navigating to chat');
                        navigate('/chat');  // Redirect to chat area
                    } else {
                        console.error('Login successful but missing user ID');
                    }
                } else {
                    alert('Invalid credentials');
                }
            } catch (error) {
                console.error('Error logging in:', error);
            }
        };

        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-6 rounded shadow-md w-80">
                    <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-500 text-white p-2 rounded"
                    >
                        Login
                    </button>
                    <p className="mt-4 text-center">
                        Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
                    </p>
                </div>
            </div>
        );
    };

    export default Login;
