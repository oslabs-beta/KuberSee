import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div data-theme='night'>
      <>
        <nav>
          <ul className='flex justify-evenly items-center navbar bg-base-100 '>
            <li
              className='text-gray-300 hover:bg-gray-700 hover:text-white
                          rounded-md px-3 py-2 text-sm font-medium'
            >
              <Link to='/home'>Home</Link>
            </li>
            <li
              className='text-gray-300 hover:bg-gray-700 hover:text-white
                          rounded-md px-3 py-2 text-sm font-medium'
            >
              <Link to='/'>Login</Link>
            </li>
            <li
              className='text-gray-300 hover:bg-gray-700 hover:text-white
                          rounded-md px-3 py-2 text-sm font-medium'
            >
              <Link to='/signup'>Sign up</Link>
            </li>
          </ul>
        </nav>
        <Outlet />
      </>
    </div>
  );
};

export default NavBar;
