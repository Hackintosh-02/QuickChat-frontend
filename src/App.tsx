import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import socket from './socket';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);

    socket.on('activeUsers', (activeUsersList) => {
      console.log('Received active users:', activeUsersList); // Add this to debug
      setActiveUsers(activeUsersList);
    });
    return () => {
      socket.off('activeUsers');
    };
  }, []);

  const handleAuthentication = (authStatus: boolean) => {
    setIsAuthenticated(authStatus);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {isAuthenticated && <Header />}
        <div className="flex justify-center">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleAuthentication} />} />
            <Route path="/signup" element={<Signup />} />
            {isAuthenticated ? (
              <>
                <Route
                  path="/chat/:userId"
                  element={
                    <div className="flex flex-1">
                      <Sidebar isSidebarOpen={true} setIsSidebarOpen={() => { }} />
                      <ChatWindow activeUsers={activeUsers} />
                    </div>
                  }
                />
                <Route path="/chat" element={<Sidebar isSidebarOpen={true} setIsSidebarOpen={() => { }} />} />
                <Route path="/" element={<Navigate to="/chat" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
