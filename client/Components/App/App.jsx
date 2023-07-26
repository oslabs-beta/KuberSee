import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import NotFound from '../../Pages/NotFound/NotFound.jsx';
import HomePage from '../../Pages/Home/Homepage.jsx';
import LoginPage from '../../Pages/Login/LoginPage.jsx';
import SignupPage from '../../Pages/Signup/SignupPage.jsx';
import NavBar from '../NavBar/NavBar.jsx';
import io from 'socket.io-client'

const socket = io.connect("http://localhost:3000");

const App = () => {
  // const location = useLocation();
  useEffect(() => {
    socket.emit('stats', null);
  }, []);
  const showNavBar = location.pathname === '/' || location.pathname === '/signup';
  return (
    // <BrowserRouter>
    // <BrowserRouter>
    <div>
      <Routes>
        <Route path='/' element={<NavBar />}>
          <Route path='home' element={<HomePage socket={socket} />} />
          <Route path='signup' element={<SignupPage />} />
          <Route path='*' element={<LoginPage />} />
        </Route>
      </Routes>
      </div>
    // </BrowserRouter>


    // <div>
    //   {showNavBar && <NavBar />}
    //   <Routes>
    //     <Route path='/' element={<LoginPage />} />
    //     <Route path='home' element={<HomePage socket={socket} />} />
    //     <Route path='signup' element={<SignupPage />} />
    //     <Route path='*' element={<NotFound />} />
    //   </Routes>
    // </div>

    // </BrowserRouter>
    // </BrowserRouter>
  );
};

export default App;
