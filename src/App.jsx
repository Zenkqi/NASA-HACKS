import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/pages/Home.jsx';
import Learn from './components/pages/Learn.jsx';

function App() {
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' exact element={<Home/>}></Route>
        <Route path='/Home' exact element={<Home/>}></Route>
        <Route path='/learn-more' exact element={<Learn/>}></Route>
      </Routes>
    </Router>
    </>
      
  );
}

export default App;
