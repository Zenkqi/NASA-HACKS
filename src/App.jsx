import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/pages/Home.jsx';
import SignUp from './components/pages/SignUp.jsx';
import AboutMe from './components/pages/AboutMe.jsx';
import Projects from './components/pages/Projects.jsx';

function App() {
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' exact element={<Home/>}></Route>
        <Route path='/Home' exact element={<Home/>}></Route>
        <Route path='/AboutMe' exact element={<AboutMe/>}></Route>
        <Route path='/Projects' exact element={<Projects/>}></Route>
        <Route path='/sign-up' exact element={<SignUp/>}></Route>
      </Routes>
    </Router>
    </>
      
  );
}

export default App;
