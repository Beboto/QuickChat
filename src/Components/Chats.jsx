import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection,doc,setDoc,getDoc,updateDoc,arrayUnion,onSnapshot,Timestamp } from 'firebase/firestore';
function Chats({ selecteduserid, currentuserid }) {

  const[message,setMessage] = useState('');
  const[messages,setMessages] = useState([]);
  const[loading,setLoading] = useState(true);
  
  //------making a chatId where all the chat gonna store of two users-------
  const chatId = [selecteduserid,currentuserid].sort().join('-');

  useEffect(()=>{
    if(!chatId) return; //-----don't do anything when the chat id is not available
    const chatDocref = doc(db,'chats', chatId);
    const unsubscribe = onSnapshot(chatDocref,(docSnapshot)=>{setLoading(false)
      //--------set loading to false when the data is received
      if(docSnapshot.exists()){
        const data = docSnapshot.data();
        setMessages(data.messages || []); // it just mean messages has to alaways array

      }
      else{
        console.log('no chat found');
        setMessages([]);// while there are no chat just clear the messages array
      }
    }, (error) =>{
      console.log(error);
      setLoading(false);
    });
    return ()=> unsubscribe();
  },[chatId]) //-so like update this useEffect when the chatId changes


  //------Funtion to handle send messages------------
  const sendMessage =async()=>{
    if(message.trim() === '') return;
    if(!chatId) return;

    const chatDocref = doc(db,'chats',chatId);
    try{
      const docSnapshot = await getDoc(chatDocref);
      //-------this is if document is already exist-----
      const newMessage = {
        text: message,
        senderId: currentuserid,
        timestamp: Timestamp.now(),
      };
      if(docSnapshot.exists()){
        //--------Update the document with the new messages
        await updateDoc(chatDocref,{
          messages: arrayUnion(newMessage),
        });
      }
      else{
        //--------creating a new document if document is not exist--
        await setDoc(chatDocref,{messages:[newMessage],});
      }
      setMessage('');
    }
    catch(err){
      console.log(err);
    }
  };


  return(
    <div className='flex flex-col w-full p-4 h-[95%]'>
      <div className='flex flex-col overflow-y-auto h-full'>
        {loading?(
          <div className='flex items-center justify-center h-full text-gray-500'>Loading...</div>
        ): messages.length === 0?
        <div className='flex items-center justify-center h-full text-gray-500'>
          No chats are there
        </div>:(messages.map((msg,index)=>(
          <div className={`p-2 m-1 rounded ${msg.senderId === currentuserid? 'bg-blue-500 text-white':'bg-gray-300 text-black'}`}>
            {msg.text}
          </div>
        )))}
      </div>
      <div className='flex mt-2'>
        <input
        type='text'
        value={message}
        onChange={(e)=>setMessage(e.target.value)} 
        placeholder='Type your message...'
        className='flex-1 p-2 border border-gray-400 rounded'
       
        />
        <button onClick={sendMessage}
        className='ml-2 p-2 bg-blue-500 text-white rounded'>Send</button>
      </div>
    </div>
  )
}
export default Chats;
