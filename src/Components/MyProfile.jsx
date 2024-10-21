import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDoc,doc } from 'firebase/firestore';
import { db } from '../firebase';
import { IoMdLogOut } from "react-icons/io";
import { logoutUser } from '../Redux/UserSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function MyProfile() {
  const [image,setImage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state)=>state.user.user);

  useEffect(()=>{
    if(userInfo) return;
    else if(userInfo == null)
    {
      navigate('/');
    }

  },[userInfo])

  const logout=()=>{
    dispatch(logoutUser());
  }
  useEffect(()=>{
      const useridgen=async()=>{
        const userDocRef = doc(db,'users',userInfo);
        const userDoc = await getDoc(userDocRef);
        if(userDoc.exists())
        {
          const userData = userDoc.data();
          setImage(userData.profilepic);
        }
      }
      useridgen();

  },[])
  return (
    <div className='h-full w-full flex flex-col items-center flex-start p-2'>
      <img src={image} className='h-8 w-8 rounded-full ring-2 ring-white object-cover'/>
      <p className='text-white'>Me</p>
      <button onClick={logout} className='translate-y-8 flex p-2 justify-center items-center bg-slate-100 rounded ring-1 ring-white'>
        <IoMdLogOut/>
      </button>
    </div>
  )
}

export default MyProfile
