import { io } from 'socket.io-client';

const userId = localStorage.getItem('userId'); // Retrieve the logged-in user's ID from localStorage

const socket = io(import.meta.env.VITE_SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,  // Ensure autoConnect is false so you can manually connect later
    query: {
        userId: userId || "",  // Pass the userId in the connection query
    },
});

export default socket;
