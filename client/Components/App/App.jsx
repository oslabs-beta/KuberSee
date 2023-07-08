import React from "react";
import HomePage from "../../Pages/Home/Homepage.jsx";
import LoginPage from '../../Pages/Login/LoginPage.jsx';
import SignupPage from "../../Pages/Signup/Signuppage.jsx";
import NavBar from "../NavBar/NavBar.jsx";
export const App = () => {

  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        hello
      </h1>
      <LoginPage/>
    </div>

  )
};
