import React from 'react'
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import {Typography } from '@mui/material'


const Cbutton = ({title,handleAction}) => {

  return (
    <>
    <Button variant="contained" onClick={handleAction}>{title}</Button>
    </>
  )
}
export const GoogleButton=({googleSignin})=>{
  return(
    <Googlebutton variant="contained" onClick={googleSignin}>
      <img style={{height:"40px"}} src={require('../../images/google_icon.png')}  />
     Sign in with google
    </Googlebutton>
  )
}

const Googlebutton=styled(Button)({
  display:"flex",
  columnGap:"15px",
  padding:"5px 10px",
  background:"#fff",
  color:"#a9a9a9",
  textTransform:"capitalize",
  '&:hover':{
    color:"#fff"
  }
})

export default Cbutton