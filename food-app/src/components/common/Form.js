import { Box, Button, TextField } from '@mui/material'
import {useDispatch,useSelector } from 'react-redux'
import React, { useState } from 'react'
import Cbutton, { GoogleButton } from './Button'
import { userData } from '../../redux/features/users/userSlice'
import { ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const Form = ({title,handleAction,toastConfig1,toastConfig2}) => {
    const dispatch=useDispatch()
    const navigate = useNavigate();
    const changeHandler=(e)=>{
        const{name,value}=e.target
        dispatch(userData({[name]:value}))
    }
    const submitForm=()=>{
        console.log("first",user)
    }
    const googleSignin=()=>{
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        const auth = getAuth();
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            sessionStorage.setItem("google_token",token)
            const user = result.user;
            navigate('/')
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
    }
    const {user}=useSelector((store)=>store.users)
    const{userPassword,userEmail}=user
  return (
    <>
                <ToastContainer
                    enableMultiContainer
                    position="top-center"
                    draggable
                    pauseOnHover
                    containerId={"customId1"}
                />
              <ToastContainer
                enableMultiContainer
                position="top-center"
                draggable
                pauseOnHover
                containerId={"customId2"}
              />

      

        <FormContainer>
            <Box>
                <img style={{height:"150px",width:"150px"}} src={require('../../images/foodpanda_icon.png')}/>
            </Box>

            <div className="heading-container">
                <h3>
                   {title} Form
                </h3>
            </div>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                    textAlign:"center"
                }}
                noValidate
                autoComplete="off"
            >
                <TextField name="userEmail" value={userEmail} id="email" label="Enter the Email" variant="outlined" onChange={changeHandler} />
                <TextField type="password" name="userPassword" value={userPassword} id="password" label="Enter the Password" variant="outlined" onChange={changeHandler} />
            </Box>
            <Cbutton  title={title} user={user} handleAction={handleAction} />
            <GoogleButton googleSignin={googleSignin}/>

            <Box>
                <p style={{textAlign:"center"}}>                   
                    {title==="Login"?"New to Food Panda?":"Already have an account?"}
                    &nbsp;
                    {title==="Login"?<Link to="/register"><Button variant="text">Create an account</Button></Link>:<Link to="/login"><Button variant="text">Login here</Button></Link>}
                </p>
            </Box>
        </FormContainer>
    </>
  )
}

export default Form

const FormContainer=styled(Box)({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        rowGap: "20px",
        position: "absolute",
        top:"30%",
        left: "50%",
        transform: "translate(-50%,-30%)"
  })
