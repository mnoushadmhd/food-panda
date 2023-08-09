import Form from "./components/common/Form";
import './App.css'
import {
  createBrowserRouter,
  Route,
  Router,
  RouterProvider,
  Routes,
  useNavigate,
} from "react-router-dom";
import { app } from './firebase/firebase-config';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useSelector } from "react-redux";
import Home from "./components/Home";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyCart from "./components/MyCart";




function App() {
const {user}=useSelector((store)=>store.users)
const navigate = useNavigate();
useEffect(()=>{
  const auth=sessionStorage.getItem("Auth_token")
  if(auth){
    navigate('/')
  }
},[])
const toastConfig1 = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  containerId: "toastContainer1"
};

const toastConfig2 = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  containerId: "toastContainer2"
};
const handleAction=(type)=>{  
  const authentication = getAuth();
  let email= user.userEmail
  let password=user.userPassword
  if(type === 'register'){
    createUserWithEmailAndPassword(authentication, email, password).then((res)=>{
      navigate('/')
      sessionStorage.setItem('Auth_Token', res._tokenResponse.refreshToken)
    }).catch((error) => {
      toast.error('Please check your credentials to register', {
        containerId: "customId1"
      });
      
    })
  }
  if(type === 'login'){
    signInWithEmailAndPassword(authentication,email,password).then((res)=>{
      navigate('/')
      sessionStorage.setItem('Auth_Token', res._tokenResponse.refreshToken)
    }).catch((error) => {
      toast.error('Please check your credentials to login', {
        containerId: "customId2"
      });
    })
   
  }
}

  return (
    <>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route  path="/login" element={<Form toastConfig1={toastConfig1} toastConfig2={toastConfig2} title="Login" handleAction={()=>handleAction("login")}/>} />
        <Route  path="/register" element={<Form title="Register" handleAction={()=>handleAction("register")}/>} />
        <Route  path="/cart" element={<MyCart/>} />
      </Routes>
    </>
  );
}

export default App;
