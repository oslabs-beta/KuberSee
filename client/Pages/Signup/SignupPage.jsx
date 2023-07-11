import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
// import { Express } from 'express';
// import { Component } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function SignupPage() {
  //hook to handle input boxes
  //save us from using onClick on every input field
  const useInput = (init) => {
    const [value, setValue] = useState(init);
    const onChange = (e) => {
      setValue(e.target.value);
    };
    return [value, onChange];
  };

  //stae for our input fields;
  const [userName, setUserName] = useInput('');
  const [password, setPassword] = useInput('');

  //state for checking any errors
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  //to handle when the form is being submitted
  const saveUser = (e) => {
    e.preventDefault();
    if (userName === '' || password === '') SetError(true);
    else {
      setSubmitted(true);
      setError(false);
    }
    const body = {
      userName,
      password,
    };
    fetch('api/auth/signup', {
      method: 'POST',
      headers: {
        'content-type': 'Application/JSON',
      },
      body: JSON.stringify(body),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      })
      .then((data) => {
        console.log(data);
        // Redirect to the home page after successful signup
        Navigate('/home');
      })
      .catch((err) => console.log('saveUser fetch /api/signup: ERROR: ', err));
  };
  //message when form is properly submitted
  const success = () => {
    return (
      <div
        className='success'
        style={{
          display: submitted ? '' : 'none',
        }}
      >
        <h1>user {userName} successfully registered!</h1>
      </div>
    );
  };
  //message when form is incorrect.
  const errorMessage = () => {
    return (
      <div
        className='error'
        style={{
          display: submitted ? '' : 'none',
        }}
      >
        <h1>Please enter all the fields</h1>
      </div>
    );
  };

  return (
    <div className='signUpForm'>
      <h1>Register</h1>
      <form>
        <label className='label'> UserName</label>
        <input
          name='user'
          placeholder='username'
          value={userName}
          onChange={setUserName}
        />
        <input
          name='userPassword'
          placeholder='password'
          value={password}
          onChange={setPassword}
        />
        <button onClick={saveUser} type='button' className='signUpBtn'>
          Sign Up
        </button>
      </form>
    </div>
  );
}
