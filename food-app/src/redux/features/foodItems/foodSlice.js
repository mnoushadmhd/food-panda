import { createSlice } from "@reduxjs/toolkit"
import { current } from '@reduxjs/toolkit'

const initialState={
    allData:{},
    cart:[]
}
const foodSlice=createSlice({
    name:'food',
    initialState,
    reducers:{
        getData:(state,action)=>{
            state.allData={...action.payload}  
        },
        AddCart:(state,action)=>{       
            state.cart=action.payload
        }
    }
})
export const{AddCart,getData}=foodSlice.actions
export default foodSlice.reducer