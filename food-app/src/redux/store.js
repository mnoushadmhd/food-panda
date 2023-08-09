import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/users/userSlice"
import foodReducer from "./features/foodItems/foodSlice"
export const store= configureStore({
    reducer:{
        users:userReducer,
        food:foodReducer
    }
})