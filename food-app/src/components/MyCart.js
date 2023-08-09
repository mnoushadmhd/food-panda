import styled from '@emotion/styled'
import { Box, Button, Container, Grid, Input, StepConnector, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import  {AddCart, getData} from '../redux/features/foodItems/foodSlice';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const MyCart = () => {
  const navigate = useNavigate();
  const{allData,cart}=useSelector((store)=>store.food)
  const dispatch=useDispatch()
  const[total,setTotal]=useState(0)
  const AddItem=(item,price,id,foodType)=>{
    console.log("all-data",allData);
    const newItem={itemname:item,price:price,id:id,nos:1}
    let newCart=[]
    let newItems=[]  
    if(cart.length && cart.some(item => item.id === id)){
        newCart=cart.map((res,i)=>{
            if(res.id===id){
                return {itemname:res.itemname,price:res.price + price,id:res.id,nos:res.nos + 1}
            }
            return res
        })
        dispatch(AddCart(newCart))
    }
    else{
     newCart=[...cart,newItem]
     dispatch(AddCart(newCart))
    }
    const updatedObj = {
        nonveg: [...allData.nonveg],
        veg: [...allData.veg],
        softdrinks: [...allData.softdrinks]
    };
    const arr = updatedObj[foodType];
    const itemIndex = arr.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        // Create a new object with the updated "nos" value
        const updatedItem = { ...arr[itemIndex], nos: arr[itemIndex].nos + 1};

        // Create a new array with the updated item
        const updatedArr = [...arr.slice(0, itemIndex), updatedItem, ...arr.slice(itemIndex + 1)];

        // Update the array in the updated object
        updatedObj[foodType] = updatedArr;
        dispatch(getData(updatedObj))
    }
}
const removeItem=(item,price,id,foodType)=>{
    if(cart.some(res => res.id === id && res.nos === 1)){
        let newCart=cart.filter((res,i)=>res.id!=id)
        dispatch(AddCart(newCart))
    }
    else{
        let newCart=cart.map((res,i)=>{
            if(res.id === id){
                return{itemname: res.itemname,price: res.price - price,id: res.id,nos: res.nos - 1}
            }
            return res
        })
        dispatch(AddCart(newCart))
    }
   const updatedObj={
        nonveg: [...allData.nonveg],
        veg: [...allData.veg],
        softdrinks:[...allData.softdrinks]

   }
   const arr=updatedObj[foodType]
   const itemIndex= arr.findIndex((item)=>item.id === id)
   if(arr[itemIndex].nos != 0){
    const updatedItem={...arr[itemIndex],nos:arr[itemIndex].nos - 1}
    const updatedArr = [...arr.slice(0, itemIndex), updatedItem, ...arr.slice(itemIndex + 1)]
    updatedObj[foodType] = updatedArr;
    dispatch(getData(updatedObj))
   }
    
}
useEffect(()=>{
  let total = cart.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.price;
  }, 0);
  setTotal(total);
  if(cart.length === 0){
    navigate('/');
  }
},[cart])
const submit = () => {
  confirmAlert({
    title: 'Confirm to submit',
    message: 'Going back will clear your cart. Are you sure?',
    buttons: [
      {
        label: 'Yes',
        onClick: () =>  {
          dispatch(AddCart([]))
          navigate('/')
        }
      },
      {
        label: 'No',
        onClick: () => true
      }
    ]
  });
};
  return (
    <CartContainer maxWidth="xl">
      <CartBox>
          <Box sx={{display:"flex",justifyContent:"space-between",width:"100%"}}>
              <Box>
                <img style={{height:"100px",width:"100px"}} src={require('../images/foodpanda_icon.png')}/>
                <Typography sx={{fontWeight:"bold"}}>Food Panda</Typography>
              </Box>
              <Box>
                <Button sx={{marginTop:"20px"}} variant="contained" onClick={submit}>Go back</Button>
              </Box>
          </Box>
          <Grid container>
            <Grid item xs={12} sm={12} lg={6}>
            <CartWrapper>
            {
            cart.map((res,i)=>{
              console.log("first",res)
              return(
                <ItemWrapper>
                  <ItemBox>
                    <Typography>{res.itemname}</Typography>
                  </ItemBox>
                  <PriceBox>
                    <Box>
                      <ButtonWrapper>
                          <AddRemoveBtn onClick={()=>removeItem(res.itemname,res.price,res.id,res.food)}><RemoveIcon color="greyShade" variant="light" fontSize="small"/></AddRemoveBtn>
                            <Typography  variant="p">{res.nos}</Typography>
                          <AddRemoveBtn onClick={()=>AddItem(res.itemname,res.price,res.id,res.food)}><AddIcon color="slimeGreen" fontSize="small"/></AddRemoveBtn>                                                    
                      </ButtonWrapper>
                    </Box>
                    <Box>
                      <Typography>&#8377;{res.price}</Typography>
                    </Box>
                  </PriceBox>
                </ItemWrapper>
              )
            })
            }
          </CartWrapper>
          <Box>
          <Input
            placeholder="Any suggestions? We will pass it on..."
            sx={{ '--Input-focused': 1, width: 300,margin:"20px 0px" }}
          />
          </Box>
          <Box>
            <Typography sx={{width:"200px",marginBottom:"20px"}}>Bill Details</Typography>
            <BillBox>
              <Typography sx={{width:"200px",fontSize:"14px",fontWeight:"light",color:"grey"}}>Item Total</Typography>
              <Typography sx={{width:"200px",fontSize:"14px",fontWeight:"light",color:"grey"}}>&#8377; {total}</Typography>
            </BillBox>
            <BillBox>
              <Typography sx={{width:"200px",fontSize:"14px",fontWeight:"light",color:"grey"}}>Delivery Fee</Typography>
              <Typography sx={{width:"200px",fontSize:"14px",fontWeight:"light",color:"grey"}}>&#8377; {total?30:0}</Typography>
            </BillBox>
            <BillBox>
              <Typography sx={{width:"200px",fontSize:"14px",fontWeight:"light",color:"grey"}}>Platform Fee</Typography>
              <Typography sx={{width:"200px",fontSize:"14px",fontWeight:"light",color:"grey"}}>&#8377; {total?3:0}</Typography>
            </BillBox>
            <BillBox>
              <Typography sx={{width:"200px",fontSize:"14px",fontWeight:"light",color:"grey"}}>GST and Charges</Typography>
              <Typography sx={{width:"200px",fontSize:"14px",fontWeight:"light",color:"grey"}}>&#8377; {total?70:0}</Typography>
            </BillBox>
            <StepConnector sx={{marginBottom:"20px"}}></StepConnector>
            <BillBox>
              <Typography sx={{width:"200px",fontWeight:"light",color:"grey"}}>To Pay</Typography>
              <Typography sx={{width:"200px",fontWeight:"bold"}}>&#8377; {total?total+30+3+70:0}</Typography>
            </BillBox>
            <Button sx={{width:"200px",marginTop:"20px"}} variant="outlined">Pay</Button>
            
          </Box>
            </Grid>
            <Grid item lg={6} sx={{display:{xs:"none",lg:"block"},paddingLeft:"10px"}}>
                <img style={{opacity:"0.8",borderRadius:"12px",width:"100%"}} src={require("../images/cart_image.jpg")}/>
            </Grid>
          </Grid>
      </CartBox>
    </CartContainer>
  )
}

export default MyCart
const CartContainer=styled(Container)({
    backgroundColor:"#e9ecee",
    paddingTop:"30px",
    paddingBottom:"30px",
    minHeight:"100vh"

})
const CartWrapper=styled(Box)({
  display:"flex",
  flexDirection:"column",
  alignItems:"flex-start",
  rowGap:"20px",

})
const CartBox=styled(Box)({
    backgroundColor:"#fff",
    padding:"30px 20px",
    display:"flex",
    flexDirection:"column",
    alignItems:"flex-start",
    rowGap:"30px",
    minHeight:"90vh"
})
const ItemBox=styled(Box)({
  width:"200px",
  '@media (max-width: 768px)': {
    width:"170px",
  }
})
const ItemWrapper=styled(Box)({
  display:"flex",
  alignItems:"center",
  columnGap:"20px"
})

const AddRemoveBtn=styled(Button)({
  padding:'5px',
  minWidth:'auto',
  height:"45px"
})
const ButtonWrapper=styled('div')({
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  width:"110px",
  boxShadow: "0 3px 8px #e9e9eb",
  borderRadius: "4px",
  border:"1px solid rgb(212, 213, 217)",
  height:"45px"
})
const BillBox=styled(Box)({
  display:"flex",
  alignItems:"center",
  columnGap:"20px",
  marginBottom:"20px"
})
const PriceBox=styled(Box)({
  display:"flex",
  alignItems:"center",
  columnGap:"20px",
  '@media (max-width: 768px)': {
    flexDirection: "column",
    rowGap:"10px",
  }

})