import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate()
    const logout = () => {
        navigate('*')
    }
    return (
        <div>
        <button className='btn btn-block btn-primary' onClick={logout}>Logout</button>
      </div>
    )
}