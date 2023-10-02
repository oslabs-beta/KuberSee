import React, { useState, MouseEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/KuberSee-t.png'

//Creating a SALT when signing up
// const salt = bcrypt.genSaltSync(10)

export default function SignupPage() {
  //hook to handle input boxes
  //save us from using onClick on every input field
  const useInput = (init: string) => {
    const [value, setValue] = useState(init);
    const onChange = (e: React.ChangeEvent<HTMLElement>) => {
      const { target } = e;
      setValue((target as HTMLInputElement).value);
    };
    return [value, onChange] as const;
  };
  //instantiate usenavigate
  const navigate = useNavigate();

  //state for our input fields;
  const [username, setUsername] = useInput('');
  const [password, setPassword] = useInput('');

  //state for checking any errors
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState({});
  //to handle when the form is being submitted
  const saveUser = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (username === '' || password === '') setError(true);
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
      navigate('/home');
      const data = await res.json();
      console.log(data, 'success');
    } catch (error) {
      console.log('saveUser fetch /api/signup: ERROR: ', error);
    }
  };
  //message when form is properly submitted
  return (
    <div data-theme='night'>

      <div
        className='signUpForm h-screen flex items-center justify-around mx-10'
      >
        <img className="w-80" src={Logo} />
        <div className='flex-col'>
          <h1 className=' mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl text-white '>
            Sign Up
          </h1>
          <form className='space-y-4'>
            <div className='mb-4'>
              <label className='text-base label-text label'>
                {' '}
                Create a username:
              </label>
            </div>
            <div className='mb-6'>
              <input
                className='w-full input input-bordered input-primary'
                name='user'
                placeholder='username'
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUsername(e);
                }}
              />
              <label className='text-base label-text label'>
                {' '}
                Create a password:
              </label>
            </div>
            <input
              type='password'
              className='w-full input input-bordered input-primary'
              name='userPassword'
              placeholder='password'
              value={password}
              onChange={setPassword}
            />
            <div className='flex items-center justify-between'>
              <button className='btn btn-block btn-primary' onClick={saveUser}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
