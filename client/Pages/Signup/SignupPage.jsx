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
  const [username, setUserName] = useInput('');
  const [password, setPassword] = useInput('');

  //state for checking any errors
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  //to handle when the form is being submitted
  const saveUser = async (e) => {
    e.preventDefault();
    if (username === '' || password === '') SetError(true);
    else {
      setSubmitted(true);
      setError(false);
    }
    const body = {
      username,
      password,
    };

    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'content-type': 'Application/JSON',
        },
        body: JSON.stringify(body),
      });
      const data = await data.json();
      navigate('/');
    } catch (error) {
      console.log('saveUser fetch /api/signup: ERROR: ', error);
    }
    // .then((resp) => resp.json())
    // .then((data) => {
    //   console.log(data);
    // })
    // .then((data) => {
    //   console.log(data);
    //   // Redirect to the home page after successful signup
    //
    // })
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
        <h1>user {username} successfully registered!</h1>
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
    <html data-theme='night'>
      <div
        className='signUpForm'
        class='h-screen flex items-center justify-center'
      >
        <h1 class='mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
          Create an account.
        </h1>
        <form class='space-y-4'>
          <div class='mb-4'>
            <label className='label' class='text-base label-text'>
              {' '}
              Create a username:
            </label>
          </div>
          <div class='mb-6'>
            <input
              class='w-full input input-bordered input-primary'
              name='user'
              placeholder='username'
              value={username}
              onChange={setUserName}
            />
            <label className='label' class='text-base label-text'>
              {' '}
              Create a password:
            </label>
          </div>
          <input
            type='password'
            class='w-full input input-bordered input-primary'
            name='userPassword'
            placeholder='password'
            value={password}
            onChange={setPassword}
          />
          <div class='flex items-center justify-between'>
            <button class='btn btn-block btn-primary' onClick={saveUser}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </html>
  );
}
