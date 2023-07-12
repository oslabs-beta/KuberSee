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
  //instantiate usenavigate
  const navigate = useNavigate();

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
        navigate('/home');
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
    <div
      className='signUpForm'
      class='h-screen flex items-center justify-center'
    >
      <h1 class='mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
        Create an account.
      </h1>
      <form class='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <div class='mb-4'>
          <label
            className='label'
            class='block text-gray-700 text-sm font-bold mb-2'
          >
            {' '}
            Create a username:
          </label>
        </div>
        <div class='mb-6'>
          <input
            class='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            name='user'
            placeholder='username'
            value={userName}
            onChange={setUserName}
          />
          <label
            className='label'
            class='block text-gray-700 text-sm font-bold mb-2'
          >
            {' '}
            Create a password:
          </label>
        </div>
        <input
          class='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          name='userPassword'
          placeholder='password'
          value={password}
          onChange={setPassword}
        />
        <div class='flex items-center justify-between'>
          <button
            class='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            onClick={saveUser}
            type='button'
            className='signUpBtn'
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
