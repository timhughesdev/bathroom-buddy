import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadGoogleMaps from './components/WithGoogleMaps';
import MainPage from './components/MainPage';
// import LoginPage from './components/LoginPage';
// import SignUpPage from './components/SignUpPage';
import './App.css';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar/>
      <LoadGoogleMaps>
        <Routes>
          <Route path='/' element={<MainPage />} />
          {/* <Route path='/login' element={<LoginPage />} /> */}
          {/* <Route path='/signup' element={<SignUpPage />} /> */}
        </Routes>
      </LoadGoogleMaps>
    </Router>
  );
};

export default App;
