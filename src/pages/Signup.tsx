import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('male');
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
            });

            if (response.ok) {
                navigate('/login');  // Redirect to login page after successful signup
            } else {
                alert('Signup failed');
            }
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
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
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <button
                    onClick={handleSignup}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Sign Up
                </button>
                <p className="mt-4 text-center">
                    Already have an account? <a href="/login" className="text-blue-500">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
