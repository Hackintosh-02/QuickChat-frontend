import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface User {
    _id: string;
    fullName: string;
    username: string;
    profilePic: string;
}

const Sidebar: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched Users:', data);
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
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
                                <li key={user._id} className="mb-4">
                                    <Link
                                        to={`/chat/${user._id}`}
                                        className="flex items-center p-2 rounded hover:bg-gray-100"
                                    >
                                        <img src={user.profilePic} alt={user.username} className="h-10 w-10 rounded-full mr-2" />
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
