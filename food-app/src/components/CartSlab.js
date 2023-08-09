import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Link } from 'react-router-dom'
import Paper from '@mui/material/Paper';
import {Button, Container, Typography } from '@mui/material'
import { useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import styled from '@emotion/styled';


export default function FixedBottomNavigation() {
const{allData,cart}=useSelector((store)=>store.food)
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  useEffect(() => {
    let total = cart.reduce((accumulator, item) => accumulator + item.price, 0);
    let newString = `${cart.length} Item ₹ ${total}`;
    setCartDetail(newString) 
  }, [cart]);
const[cartDetail,setCartDetail]=useState("")
  return (

        <Box sx={{ pb: 7 }} ref={ref}  style={{position:"relative"}} >
            {cart.length?
                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,width:"100%" }} elevation={3} style={{backgroundColor:"#65E765"}}>
                            <Container maxWidth="xl">
                                <BottomNavigation
                              
                                value={value}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                                style={{backgroundColor:"#65E765",display:"flex",justifyContent:"space-between"}}
                                >
                                  <ButtonWrapper>
                                    <CurrencyRupeeIcon sx={{color:"#fff"}} />
                                    <Typography sx={{fontSize:"14px",color:"#fff"}}>{cartDetail}</Typography>
                                  </ButtonWrapper>
                                  <Link to="/cart" style={{textDecoration:"none"}}>
                                    <ButtonWrapper >
                                      <ShoppingCartIcon sx={{color:"#fff"}} />
                                      <Typography sx={{fontSize:"14px",color:"#fff"}}>View Cart</Typography>
                                    </ButtonWrapper>
                                  </Link>                              
                                </BottomNavigation>
                            </Container>
                        </Paper>:""    
        }
        </Box>


  );
}

const ButtonWrapper=styled(Button)({
  display:"flex",
  flexDirection:"column",
  justifyContent:"space-between",
  alignItems:"center",
  padding:"5px 20px"
})