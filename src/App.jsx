import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from "./firebase/firebase";
import styled from 'styled-components';
import {Routes, Route} from "react-router-dom"

import Navigation from './components/Navigation';
import Home from "./pages/Home"
import AddPerson from './pages/AddPerson';
import UpdatePerson from './pages/UpdatePerson';
import Person from './pages/Person'
import Signup from './pages/Signup';
import Login from "./pages/Login"
import ForgotPassword from './pages/ForgotPassword';
import MyProfile from './pages/MyProfile';



function App() {

  return (
    <>
<Navigation/>


<Routes>
    <Route path="/"  element={<Home/>} />
    <Route path="/add"  element={<AddPerson/>} />
    <Route path="/updateperson/:id"  element={<UpdatePerson/>} />
    <Route path="/person/:id"  element={<Person/>} />
    <Route path="/signup" element={<Signup/>} />
    <Route path="/login" element={<Login />} />
    <Route path="/forgotpassword" element={<ForgotPassword />} />
    <Route path="/myprofile" element={<MyProfile/> } />




</Routes>



    </>
  )
}

export default App

