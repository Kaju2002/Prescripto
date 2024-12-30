import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate()
  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Account created successfully");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Login successful");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(()=>{

    if(token){

      navigate('/')
    }
  },[token])

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={onSubmitHandler}>
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-md shadow-lg">
          <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
          <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book appointments</p>
          {
            state === "Sign Up" && (
              <div className='w-full'>
                <p>Full Name</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
            )
          }
          <div className='w-full'>
            <p>Email</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className='w-full'>
            <p>Password</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>
            {state === 'Sign Up' ? "Create Account" : "Login"}
          </button>
          {
            state === "Sign Up"
              ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary cursor-pointer'>Login here</span></p>
              : <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-primary cursor-pointer'>Click here</span></p>
          }
        </div>
      </form>
    </div>
  );
};

export default Login;