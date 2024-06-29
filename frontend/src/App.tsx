import React from 'react';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';

import Navbar from './components/Navbar';
import LoadGoogleMaps from './components/WithGoogleMaps';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function Logout(){
  localStorage.clear()
  return <Navigate to='/login' />
}

// prevent old access tokens from interfering with register

function RegisterAndLogout() {
  localStorage.clear()
  return <SignUpPage />
}

const App: React.FC = () => {
  return (
    <>
    <Router>
    <Navbar/>
      <LoadGoogleMaps>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<RegisterAndLogout />} />
          <Route path='/logout' element={<Logout />} />
          <Route 
            path='/' 
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } 
          />

          <Route path='*' element={<NotFoundPage/>} />

        </Routes>
      </LoadGoogleMaps>
    </Router>
    </>
  );
};

export default App;
