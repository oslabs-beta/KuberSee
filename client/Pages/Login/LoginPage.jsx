import React from 'react';

export default function LoginPage() {
  const login = async (e) => {
    e.preventDefault();
    let user = document.getElementById('loginUsername').value;
    let pass = document.getElementById('loginPassword').value;

    console.log(user, pass);
    const info = {
      username: user,
      password: pass,
    };
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(info),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  return (
    <html data-theme='night'>
      <div class='h-screen flex items-center justify-around mx-10'>
        <h1 class='mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
          Sign in.
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
            <a
              href='signup'
              class='text-blue-600 hover:text-blue-800 hover:underline'
            >
              Signup
            </a>
          </span>
        </form>
      </div>
    </html>
  );
}
