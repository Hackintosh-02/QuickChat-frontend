import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import socket from '../socket'; // Ensure your socket instance is imported

interface User {
    _id: string;
    fullName: string;
    username: string;
    profilePic: string;
}

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [activeUsers, setActiveUsers] = useState<string[]>([]);  // State to keep track of active users
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();

        // Listen for active users list from the server
        socket.on('activeUsers', (activeUsersList) => {
            setActiveUsers(activeUsersList);
        });

        return () => {
            socket.off('activeUsers');
        };
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`bg-white border-r border-gray-200 flex flex-col ${isSidebarOpen ? 'w-1/4' : 'w-0'} md:w-1/4 h-[calc(100vh-64px)] transition-all duration-300`}>
            <button 
                className="md:hidden bg-blue-500 text-white p-2 rounded mb-4"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? 'Close' : 'Open'} Sidebar
            </button>
            {isSidebarOpen && (
                <>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
                    />
                    <div className="overflow-y-auto flex-1">
                        <ul>
                            {filteredUsers.map(user => (
                                <li key={user._id} className="mb-4 relative">
                                    <Link
                                        to={`/chat/${user._id}`}
                                        className="flex items-center p-2 rounded hover:bg-gray-100 relative"
                                    >
                                        <div className="relative">
                                            <img 
                                                src={user.profilePic} 
                                                alt={user.username} 
                                                className="h-10 w-10 rounded-full mr-2"
                                            />
                                            {activeUsers.includes(user._id) && (
                                                <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                                            )}
                                        </div>
                                        <span>{user.username}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;
