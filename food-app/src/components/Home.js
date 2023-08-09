import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import jdata from '../mockup_Data/db.json'
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../redux/features/foodItems/foodSlice';
import Navbar from './Navbar';
import Menu from './Menu';
import { ThemeProvider } from '@mui/material';
import { theme } from './Theme';
import Footer from './Footer';
const Home = () => {
  const dispatch = useDispatch();
  const[arr,setArr]=useState([])
  const navigate=useNavigate()
  useEffect(()=>{
    fetchData();
    const auth=sessionStorage.getItem("Auth_Token")
    const google_auth=sessionStorage.getItem("google_token")
    if(auth || google_auth)
    {
      navigate("/")
    }
    else{
      navigate('/login')
    }
   
  },[])
  const fetchData=()=>{
    dispatch(getData(jdata))
  }
 
  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar/>
        <Menu/>   
        <Footer/>
      </ThemeProvider>
    </>
  )
}

export default Home