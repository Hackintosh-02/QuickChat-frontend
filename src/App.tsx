import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    // console.log("Checking authentication...");
    // console.log("User ID in localStorage:", userId);

    if (userId) {
      setIsAuthenticated(true);
      // console.log("User is authenticated");
    } else {
      setIsAuthenticated(false);
      // console.log("User is not authenticated");
    }
    setLoading(false);
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
        <div className="flex flex-1">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleAuthentication} />} />
            <Route path="/signup" element={<Signup />} />
            {isAuthenticated ? (
              <>
                <Route
                  path="/chat/:userId"
                  element={
                    <div className="flex flex-1">
                      <Sidebar />
                      <ChatWindow />
                    </div>
                  }
                />
                <Route path="/chat" element={<Sidebar />} />
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
