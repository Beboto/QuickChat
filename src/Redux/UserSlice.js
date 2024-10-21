import { createSlice } from "@reduxjs/toolkit";

//-define the initial state---------

const initialState = {user:null};

//----------create some actions reducers----------
const userSlice = createSlice(
{
    name:'user',
    initialState,
    reducers:{
        //--------login or signup action------
        loginUser:(state,action) =>{
            state.user = action.payload;
        },
        logoutUser:(state,action) =>{
            state.user = null;
        }
    },
});

//------export the reducers and slice---------
export const {loginUser, logoutUser} = userSlice.actions;
export default userSlice.reducer;