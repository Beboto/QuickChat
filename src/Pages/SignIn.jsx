import React, { useState } from 'react'
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { loginUser } from '../Redux/UserSlice';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const[loading,setLoading] = useState('LogIn');
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const[errormessage,setErrormessage] = useState(null);
    const siginWithEmail =async()=>{
        try{
            setLoading('loading...');
            const userRes = await signInWithEmailAndPassword(auth,email,password);
            dispatch(loginUser(userRes.user.uid));
            navigate('/chats');
        }
        catch(err)
        {
            setErrormessage(err.code);
            setLoading('Login');
        }
    }
  return (
    <div className='flex flex-col justify-center items-center'>
        <p className='translate-y-[150px] z-50 absolute text-red-700'>{errormessage}</p>
        <div className='component'>
        <div className='p-2 flex flex-col justify-around items-center right-1 ring-slate-400 rounded-md bg-[#1A1F2D] h-[250px] w-64'>
            <h1 className='text-md font-semibold text-gray-100'>Already have account?</h1>
            <div className='flex flex-col gap-2 w-[80%]'>
                <input type='email' placeholder='email' className='inputFeild' 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input type='password' placeholder='password' className='inputFeild'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
            </div>
            <div>
                <button className='button-violet w-full' onClick={siginWithEmail}>{loading}</button>
                <p className='text-white text-[13px] leading-5 w-full text-center'>No account previously?<p className='text-blue-500 underline cursor-pointer' onClick={()=>navigate('/')} >SignUp</p></p>
            </div>
        </div>
        </div>
    </div>
  )
}

export default SignIn
