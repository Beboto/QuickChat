import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection,getDocs } from 'firebase/firestore'
import MyProfile from '../Components/MyProfile';
import { useSelector } from 'react-redux';
import Chats from '../Components/Chats';
import UserProfile from '../Components/UserProfile';
function ChatView() {
  const [users,setUser] = useState([]);
  const [selecteduserId,setSelecteduserId] = useState(null);
  const userInfo = useSelector((state)=> state.user.user);
  const[seacrhQ,setSearchQ] = useState('');
  useEffect(()=>{
    const fetchUser = async()=>{
      try{
        const userCollection = collection(db,'users');
        const userData = await getDocs(userCollection);
        const userList = userData.docs.map(doc=>({id:doc.id,...doc.data()}));
        const filterdUser = userList.filter(user => user.id !== userInfo);
        setUser(filterdUser);
      }
      catch(err){
        console.log(err);
      }
    }
    fetchUser();
  },[])

  //-------------handle user Selection------------
  const handleUserSelection=(selecteduserId)=>{
    setSelecteduserId(selecteduserId);
  }
  //-----------------------
  //---------Handling Search-----------
  const handleSearchChange =(e)=>{
    setSearchQ(e.target.value);
  }
  const filterdUsers = users.filter(user=>user.displayname.toLowerCase().includes(seacrhQ.toLowerCase()));


  return (
    <div className='flex justify-center items-center h-[100vh] bg-slate-900'>
      <div className='bg-slate-900 flex overflow-hidden h-[550px] w-[780px] justify-around rounded-lg ring-1 ring-white'>
        <div className='flex bg-[#111520] h-[100vh] w-20'>
          <MyProfile/>
        </div>
        <div className='bg-[#141826] w-full flex flex-col justify-between items-center'>
        <div className='bg-[#141826] w-full flex flex-col justify-between items-start'>
          <input type='text' placeholder='Search Users..' value={seacrhQ} onChange={handleSearchChange}
          className='w-[100%] p-2  bg-gray-900 text-white'/>
        </div>
          <div className='w-full h-16 bg-[#141826]'></div>
          <div className='flex justify-between items-center h-full w-full'>
            <div className='flex flex-col gap-2 justify-start items-center h-full overflow-y-auto scroll-m-0 w-56 bg-[#111624]'>
              {/* this is the userList showing in render */}
              <ul className='w-full flex flex-col p-2 justify-start gap-2 h-[100%] items-center'>
                {
                  filterdUsers.map((item)=>(
                    <li 
                    style={{backgroundColor:item.id === selecteduserId? '#FF2D63':'#1A1F2D'}}
                    className='flex gap-2 justify-start items-center h-12 w-[100%] px-3 cursor-pointer rounded-md'
                      onClick={()=>handleUserSelection(item.id)}
                    >
                      <img src={item.profilepic} className='h-7 w-7 rounded-full object-cover' />
                      <p className='text-white opacity-80'>{item.displayname}</p>
                    </li>
                  ))
                }
              </ul>
              {/*---------------------------------------------------------------------------*/}
            </div>
            <div className='flex h-full w-full bg-[#1A1F2D]'>
              {/*pass the props through chats component*/}
              {selecteduserId && <Chats selecteduserid = {selecteduserId} currentuserid ={userInfo}/>}
            </div>
          </div>
        </div>
        <div className='bg-[#111520] w-56 p-10'>
          <h1>
            {selecteduserId && <UserProfile userprofileid={selecteduserId} />}
          </h1>
          <div></div>
          <h4></h4>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default ChatView
