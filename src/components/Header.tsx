import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Logout initiated");
    
        // Remove the token from localStorage
        localStorage.removeItem('token');
        console.log("Token removed from localStorage");
    
        // Optional: Also remove userId if you are using it to track authentication
        localStorage.removeItem('userId');
        console.log("User ID removed from localStorage");
    
        // Redirect to login page
        navigate('/login');
        console.log("Navigating to login page");
    };
    

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-500">QuickChat</h1>
            </div>
            <button onClick={handleLogout} className="text-blue-500 hover:text-blue-700">
                Logout
            </button>
        </header>
    );
};

export default Header;
