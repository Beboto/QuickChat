import React, { useState,useRef, useEffect } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth,storage,db } from '../firebase';
import { setDoc,doc } from 'firebase/firestore';
import { ref,uploadBytesResumable,getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
//-----------redux part---------
import { useDispatch } from 'react-redux';
import { loginUser } from '../Redux/UserSlice';

function SignUp() {
    const dispatch = useDispatch();
    const imageRef = useRef(null);
    const[profilePic,setProfilepic] = useState();
    const[userId,setUserId] = useState('');
    const[name,setName] = useState('');
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const[image,setImage]=useState();
    const[downloadbleImageLink,setImageLink] = useState('');
    //-------------initialzing navigation through navigate--------
    const navigate = useNavigate();
    //-------signupbuttontext useState-------------
    const[signuptext,setSignuptext] = useState('Sign up');
    //-----save name email and profile photo link to firestore------
    const handleImageUpload=(img)=>{
        if(!img) return;
        const storageRef = ref(storage,`profiles/ ${Date.now()}_${Math.random().toString(36).substring(2,15)}_${img.name}}`);
        const imageUpload = uploadBytesResumable(storageRef,img);
        imageUpload.on('state_changed', (item)=>{
            const progress = (item.bytesTransferred/item.totalBytes)*100;

            if(Math.round(progress)==100){
                if(imageRef.current){
                    imageRef.current.style.opacity = 1;
                }
            }

        },(error)=>{
            console.log(error.code);
        },
        async()=>{
            try{
                const imageurl= await getDownloadURL(imageUpload.snapshot.ref);
                setImageLink(imageurl);
              

            }
            catch(error){
                console.log(error);
            }
        }
    )
    }
    //-----create user in userlist in firebase auth---signup
    const handleSignup=async()=>{
        try{
            setSignuptext('Loading...');
            const userRes=await createUserWithEmailAndPassword(auth,email,password);
            await updateUserData(userRes.user.uid);
            dispatch(loginUser(userRes.user.uid));
            setName('');
            setEmail('');
            setPassword('');
            //----------navigate to chatview page
            navigate('/chats');
        }
        catch(err)
        {
            console.log(err.code);
        }
    } 

    //--------------display the image immediately--------
    const handleFile = (e) =>{
        if(e.target.files[0]){
            handleImageUpload(e.target.files[0]);
            setProfilepic(URL.createObjectURL(e.target.files[0]));            
        }
    }
    //---------------------Upload all the information of users in Firestore Database-
    const updateUserData=async(id)=>{
        try{
            await setDoc(doc(db,'users',id),{
                displayname:name,
                email:email,
                profilepic: downloadbleImageLink,
            })
        }
        catch(err)
        {
            console.log(err)
        }
    }

  return (
    <div className='component'>
        <div className='cardViewLogin'>
            <div className='ring-2 ring-[#9A00FF] h-14 w-14 rounded-[100%] bg-[#10131C]'>
                <input type='file' id='inputProfilepic' className='hidden' onChange={handleFile} accept='image/*'/>
                <label htmlFor='inputProfilepic'
                className='cursor-pointer flex items-center justify-center h-full w-full'>
                    {profilePic ? (
                        <img src={profilePic} ref={imageRef} className='rounded-full h-full w-full object-cover opacity-40' />
                    ):(
                        <span className='opacity-45 text-white font-bold'>+</span>
                    )}
                </label>
            
            </div>
            <div className='flex justify-center items-center flex-col gap-2'>
                <input type='text'
                value={name} onChange={(e)=>setName(e.target.value)}
                placeholder='name' className='inputFeild'/>
                <input type='email'
                value={email} onChange={(e)=>setEmail(e.target.value)}
                placeholder='email' className='inputFeild'/>
                <input type='password'
                value={password} onChange={(e)=>setPassword(e.target.value)}
                placeholder='password' className='inputFeild'/>
            </div>
            <div className='flex flex-col gap-1'>
                <button className='button-violet' onClick={()=>handleSignup()}>{signuptext}</button>
                <p className='text-white text-[13px] leading-5 w-full'>Already have an account? <p className='text-blue-500 underline cursor-pointer' onClick={()=>navigate('/signin')} >Login</p></p>
            </div>
        </div>
        <div>
        </div>
    </div>
  )
}

export default SignUp
