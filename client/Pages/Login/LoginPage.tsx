import React, { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/KuberSee-t.png'

type AuthBody = {
  username: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const login = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const user = (document.getElementById('loginUsername') as HTMLInputElement).value;
    const pass = (document.getElementById('loginPassword') as HTMLInputElement).value;

    const info: AuthBody = {
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

    const answers = await res.json();
    if (answers === 'wrong') {
      alert('no user found retry');
    } else {
      navigate('/home');
    }
  };
  return (
    <div data-theme='night'>
      <div className='h-screen flex items-center justify-around mx-10'>
        <img className="w-80" src={Logo} />
        <div className='flex-col'>
          <h1 className='mb-4 mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-800 md:text-5xl lg:text-6xl dark:text-white'>
            Login
          </h1>
          <form className='space-y-4'>
            <div>
              <label className='label'>
                <span className='text-base label-text'>Username</span>
              </label>
              <input
                type='text'
                id='loginUsername'
                placeholder='Username'
                className='w-full input input-bordered input-primary'
              />
            </div>
            <div>
              <label className='label'>
                <span className='text-base label-text'>Password</span>
              </label>
              <input
                type='password'
                id='loginPassword'
                placeholder='Enter Password'
                className='w-full input input-bordered input-primary'
              />
            </div>
            <div>
              <button className='btn btn-block btn-primary' onClick={login}>
                Login
              </button>
            </div>
            <span >
              Don't have an account ?
              <Link to='/signup' className=' mt-6 text-blue-600 hover:underline'>
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
      </div>
    </div>
  );
}
