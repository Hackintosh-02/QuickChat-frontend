import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../socket';

interface Message {
    senderId: string;
    message: string;
}

interface User {
    _id: string;
    username: string;
    profilePic: string;
}

const ChatWindow: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        socket.on('newMessage', (message) => {
            console.log('New message received via Socket.IO:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('newMessage');
            console.log('Socket listener cleaned up');
        };
    }, [userId]);

    useEffect(() => {
        socket.connect();
        console.log('Attempting to connect socket:', socket);

        socket.on('connect', () => {
            console.log('Socket.IO connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
        });

        return () => {
            socket.off('newMessage');
            socket.disconnect(); // Ensure disconnection on unmount
            console.log('Socket disconnected and listener cleaned up');
        };
    }, [userId]);

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem('userId');
        setLoggedInUserId(userIdFromStorage);

        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setSelectedUser(data);
                } else {
                    console.error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                } else {
                    console.error('Failed to fetch messages');
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        if (userId) {
            fetchMessages();
        }
    }, [userId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const message = {
            senderId: loggedInUserId || '',
            message: newMessage,
        };

        console.log('Sending message:', message);

        socket.emit('sendMessage', {
            senderId: loggedInUserId,
            receiverId: userId,
            message: newMessage,
        });

        console.log('Message emitted via Socket.IO');

        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/send/${userId}`, {
                method: 'POST',
                headers: {  
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: newMessage }),
                credentials: 'include',
            });

            if (!response.ok) {
                console.error('Failed to save the message');
            } else {
                console.log('Message saved to the database');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
            {selectedUser && (
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div className='flex justify-center items-center text-blue-500'>
                        <img src={selectedUser.profilePic} alt={selectedUser.username} className="h-12 w-12 rounded-full mr-4" />
                        <h2 className="text-3xl font-semibold">{selectedUser.username}</h2>
                    </div>
                </div>
            )}
            <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow my-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg mb-2 max-w-md ${msg.senderId === loggedInUserId ? 'bg-blue-500 text-white self-end ml-auto' : 'bg-gray-300 self-start mr-auto'
                            }`}
                    >
                        {msg.message}
                    </div>
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-l p-2"
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
