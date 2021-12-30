import React, { useState, createContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SignUp from './components/SignUp/SignUp';
import LanguageSelector from './components/LanguageSelector/LanguageSelector';
import ActivationPage from './components/ActivationPage/ActivationPage';
import Login from './components/Login/Login';
import UserPage from './components/UserPage/UserPage';
import HomePage from './components/HomePage/HomePage';
import NavBar from './components/NavBar/NavBar';

export const AuthContext = createContext();

function App({ logged }) {
  const [auth, setAuth] = useState({ id: '', isLoggedIn: false });

  return (
    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <NavBar logged={logged} />
        <div className="container pt-3">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="login" element={<Login setAuth={setAuth} />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="users/:id" element={<UserPage />} />
            <Route path="activate/:token" element={<ActivationPage />} />
          </Routes>
          <LanguageSelector />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
