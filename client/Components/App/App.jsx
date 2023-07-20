import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from '../../Pages/NotFound/NotFound.jsx';
import HomePage from '../../Pages/Home/Homepage.jsx';
import LoginPage from '../../Pages/Login/LoginPage.jsx';
import SignupPage from '../../Pages/Signup/SignupPage.jsx';
import NavBar from '../NavBar/NavBar.jsx';
import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001")

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<NavBar />}>
          <Route index element={<LoginPage />} />
          <Route path='home' element={<HomePage socket={socket} />} />
          <Route path='signup' element={<SignupPage />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
