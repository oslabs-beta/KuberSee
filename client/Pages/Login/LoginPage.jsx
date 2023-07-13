import React from 'react';
import { Link, useNavigate, redirect } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = async (e) => {
    e.preventDefault();
    let user = document.getElementById('loginUsername').value;
    let pass = document.getElementById('loginPassword').value;

    console.log('fetch', user, pass);
    const info = {
      username: user,
      password: pass,
    };

    const res = await fetch('http://localhost:3000/auth/signin', {
      method: 'POST',
      body: JSON.stringify(info),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // console.log(res.json)
    let answers = await res.json();
    if (answers === 'wrong') {
      alert('no user found retry');
    } else {
      navigate('/home');
    }
  };
  return (
    <html data-theme='night'>
      <div class='h-screen flex items-center justify-around mx-10'>
        <h1 class='mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
          Log in.
        </h1>
        <form class='space-y-4'>
          <div>
            <label class='label'>
              <span class='text-base label-text'>Username</span>
            </label>
            <input
              type='text'
              id='loginUsername'
              placeholder='Username'
              class='w-full input input-bordered input-primary'
            />
          </div>
          <div>
            <label class='label'>
              <span class='text-base label-text'>Password</span>
            </label>
            <input
              type='password'
              id='loginPassword'
              placeholder='Enter Password'
              class='w-full input input-bordered input-primary'
            />
          </div>
          <div>
            <button class='btn btn-block btn-primary' onClick={login}>
              Login
            </button>
          </div>
          <span>
            Don't have an account ?
            <Link to='/signup' className='text-blue-600 hover:underline'>
              Sign up
            </Link>
            {/* <a
              href='signup'
              class='text-blue-600 hover:text-blue-800 hover:underline'
            >
              Signup
            </a> */}
          </span>
        </form>
      </div>
    </html>
  );
}
