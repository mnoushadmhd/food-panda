import { createSlice } from "@reduxjs/toolkit";
const initialState={
 user:{userEmail:"" ,userPassword:""},
 allData:{}
}
const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        userData:(state,action)=>{
            state.user={...state.user,...action.payload}
        },
        signIn:(state,action)=>{
            console.log(state)
        },
        createUser:(state,action)=>{
            console.log(state)
        },
        getData:(state,action)=>{
            state.allData={...action.payload}
        }
    }
    
})
export const{signIn,createUser,userData,getData}=userSlice.actions
export default userSlice.reducer