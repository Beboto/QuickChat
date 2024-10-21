import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { doc,getDoc } from 'firebase/firestore'
function UserProfile({userprofileid}) {
  const[userInfo,setUserInfo] = useState(null);
  const[loading,setLoading] = useState(true);

  useEffect(()=>{
    const fetchUserData =async()=>{

            if(!userprofileid) return;
            try{
                const userRef = doc(db,'users',userprofileid);
                const docsnashot = await getDoc(userRef);
                if(docsnashot.exists()){
                    setUserInfo(docsnashot.data());
                }
                else{
                    console.log('nothing to show here');
                }
            }
            catch(error){
                console.log(error);
            }
            finally{
                setLoading(false);
            }
    }
    fetchUserData();
  },[userprofileid])

    return (
    <div className='flex h-full w-full flex-col justify-center items-center'>
    {
        loading &&(<div>Loading...</div>)
    }
      <img src={userInfo?.profilepic} className='w-20 h-20 rounded-full ring-1 ring-white'/>
      <h2 className='text-white text-md'>{userInfo?.displayname}</h2>
      <h5 className='text-gray-500 font-thin text-[13px]'>{userInfo?.email}</h5>
    </div>
  )
}

export default UserProfile
