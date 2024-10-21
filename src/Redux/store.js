import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";

//create a reducer store here--
const store = configureStore({
    reducer:{
        user:UserSlice,
    }
});
export default store;