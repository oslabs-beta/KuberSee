import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from '../../Pages/NotFound/NotFound.jsx';
import HomePage from '../../Pages/Home/HomePage';
import LoginPage from '../../Pages/Login/LoginPage.jsx';
import SignupPage from '../../Pages/Signup/SignupPage.jsx';
import NavBar from '../NavBar/NavBar.jsx';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3000');

const App = () => {
  useEffect(() => {
    socket.emit('stats', null);
  }, []);

  return (
    <div>
      <Routes>
        <Route path='/' element={<NavBar />}>
          <Route index element={<LoginPage />} />
          <Route path='home' element={<HomePage socket={socket} />} />
          <Route path='signup' element={<SignupPage />} />
          <Route path='*' element={<LoginPage />} />
        </Route>
      </Routes>
      </div>
  );
};

export default App;
