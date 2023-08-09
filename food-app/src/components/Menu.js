import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Divider, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/system';
import { ThemeProvider } from '@emotion/react';
import { theme } from './Theme';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '../redux/store';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import  {AddCart, getData} from '../redux/features/foodItems/foodSlice';
import CartSlab from './CartSlab';

const Menu = () => {
const[bool,setBool]=useState(false)
const{allData,cart}=useSelector((store)=>store.food)
const dispatch=useDispatch()
const AddItem=(item,price,id,foodType)=>{
    const newItem={itemname:item,price:price,id:id,nos:1}
    let newCart=[]
    let newItems=[]  
    if(cart.length && cart.some(item => item.id === id)){
        newCart=cart.map((res,i)=>{
            if(res.id===id){
                return {itemname:res.itemname,price:res.price + price,id:res.id,nos:res.nos + 1,food:foodType}
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
useEffect(() => {
//    
  });
  return (
    <>
        <Container maxWidth="xl">
            <Box marginTop={2} marginBottom={2}>
                <Typography gutterBottom variant="h3" component="div">
                        Non-Veg
                </Typography>
                <Divider />
            </Box>
            <Grid container spacing={2}>
                {
                    allData.nonveg?
                    allData.nonveg.map((res,i)=>{
                        return(
                            <Grid key={res.id} item  xs={12} sm={6} md={4}>
                                <MyCard>
                                    <Box>
                                    <CardMedia
                                        sx={{ height: 140 }}
                                        image={res.image}
                                        title="green iguana"
                                    />
                                    <CardContent>
                                        <Typography sx={{display:"flex",justifyContent:"space-between"}} gutterBottom variant="h5" component="div">
                                        {res.itemname}  <Typography variant="h5" component="span" sx={{color:"red"}}>&#8377;{res.price}</Typography>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                        {res.description}
                                        </Typography>
                                    </CardContent>
                                    </Box>
                                    <CardActions>
                                    {
                                                res.nos===0?
                                                <AddButton onClick={()=>AddItem(res.itemname,res.price,res.id,"nonveg")} size="medium">
                                                        Add
                                                </AddButton>:
                                                <AddButton size="medium" disableRipple>
                                                    <ButtonWrapper>
                                                        <AddRemoveBtn onClick={()=>removeItem(res.itemname,res.price,res.id,"nonveg")}><RemoveIcon color="greyShade" variant="light" fontSize="small"/></AddRemoveBtn>
                                                        <Typography  variant="p">{res.nos}</Typography>
                                                        <AddRemoveBtn onClick={()=>AddItem(res.itemname,res.price,res.id,"nonveg")}><AddIcon color="slimeGreen" fontSize="small"/></AddRemoveBtn>                                                    
                                                    </ButtonWrapper>
                                                 </AddButton>
                                    }
                                    </CardActions>
                                </MyCard>       
                            </Grid>  
                        )
                    }):""
                }    
            </Grid>
            <Box marginTop={2} marginBottom={2}>
                <Typography gutterBottom variant="h3" component="div">
                        Veg
                </Typography>
                <Divider />
            </Box>
            <Grid container spacing={2}>
                {
                    allData.veg?
                    allData.veg.map((res,i)=>{
                        return(
                            <Grid key={res.id} item  xs={12} sm={6} md={4}>
                                <MyCard>
                                    <CardMedia
                                        sx={{ height: 140 }}
                                        image={res.image}
                                        title="green iguana"
                                    />
                                    <CardContent>
                                        <Typography sx={{display:"flex",justifyContent:"space-between"}} gutterBottom variant="h5" component="div">
                                        {res.itemname}  <Typography variant="h5" component="span" sx={{color:"red"}}>&#8377;{res.price}</Typography>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                        {res.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                    {
                                                res.nos===0?
                                                <AddButton onClick={()=>AddItem(res.itemname,res.price,res.id,"veg")} size="medium">
                                                        Add
                                                </AddButton>:
                                                <AddButton size="medium" disableRipple>
                                                    <ButtonWrapper>
                                                        <AddRemoveBtn onClick={()=>removeItem(res.itemname,res.price,res.id,"veg")}><RemoveIcon color="greyShade" variant="light" fontSize="small"/></AddRemoveBtn>
                                                        <Typography  variant="p">{res.nos}</Typography>
                                                        <AddRemoveBtn onClick={()=>AddItem(res.itemname,res.price,res.id,"veg")}><AddIcon color="slimeGreen" fontSize="small"/></AddRemoveBtn>                                                    
                                                    </ButtonWrapper>
                                                 </AddButton>
                                    }
                                    </CardActions>
                                </MyCard>       
                            </Grid>  
                        )
                    }):""
                }    
            </Grid>
            <Box marginTop={2} marginBottom={2}>
                <Typography gutterBottom variant="h3" component="div">
                        Soft Drinks
                </Typography>
                <Divider />
            </Box>
            <Grid container spacing={2}>
                {
                    allData.softdrinks?
                    allData.softdrinks.map((res,i)=>{
                        return(
                            <Grid key={res.id} item  xs={12} sm={6} md={4}>
                                <MyCard>
                                    <CardMedia
                                        sx={{ height: 140 }}
                                        image={res.image}
                                        title="green iguana"
                                    />
                                    <CardContent>
                                        <Typography sx={{display:"flex",justifyContent:"space-between"}} gutterBottom variant="h5" component="div">
                                        {res.itemname} <Typography variant="h5" component="span" sx={{color:"red"}}>&#8377;{res.price}</Typography>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                        {res.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                    {
                                                res.nos===0?
                                                <AddButton onClick={()=>AddItem(res.itemname,res.price,res.id,"softdrinks")} size="medium">
                                                        Add
                                                </AddButton>:
                                                <AddButton size="medium" disableRipple>
                                                    <ButtonWrapper>
                                                        <AddRemoveBtn onClick={()=>removeItem(res.itemname,res.price,res.id,"softdrinks")}><RemoveIcon color="greyShade" variant="light" fontSize="small"/></AddRemoveBtn>
                                                        <Typography  variant="p">{res.nos}</Typography>
                                                        <AddRemoveBtn onClick={()=>AddItem(res.itemname,res.price,res.id,"softdrinks")}><AddIcon color="slimeGreen" fontSize="small"/></AddRemoveBtn>                                                    
                                                    </ButtonWrapper>
                                                 </AddButton>
                                    }

                                    </CardActions>
                                </MyCard>       
                            </Grid>  
                        )
                    }):""
                }    
            </Grid>
            <Box sx={{backgroundColor:"#f1f1f6",padding:"40px 20px",marginTop:"30px"}}>
                <Typography sx={{color:"#a9abb2",fontWeight:"bold"}}>
                    Food Panda 
                </Typography>
                <Typography sx={{color:"#a9abb2",fontSize:"12px"}}>
                    (Santa Cruz)
                </Typography>
                <Typography sx={{color:"#a9abb2",fontSize:"12px"}}>
                Indulge in a culinary journey that tantalizes your taste buds and delights your senses. At Food Panda, we take pride in crafting unforgettable dining experiences. From our exquisite dishes prepared with the finest ingredients to our warm and attentive service, we strive to create moments of pure culinary delight. Join us and savor a symphony of flavors, in an inviting ambience that embraces you like family. Experience the art of dining at its finest.
                </Typography>
            </Box>
            <CartSlab/>
        </Container>   
    </>
  )
}
const MyCard = styled(Card)({
    height:"100%",
    display:"flex",
    flexDirection:"column",
    justifyContent:"space-between",
    transition:" all 1s",
    '&:hover': {
     boxShadow: "0 3px 8px #e9e9eb",
     transform:'scale(1.03)'
    },
  });
  const AddButton=styled(Button)({
    width:"110px",
    boxShadow: "0 3px 8px #e9e9eb",
    borderRadius: "4px",
    border:"1px solid rgb(212, 213, 217)",
    height:"45px"
  })
  const AddContainer=styled('div')({

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
    width:"100%"
  })
  const ItemCount=styled('p')({
    fontSize:"14px"
  })
  

export default Menu