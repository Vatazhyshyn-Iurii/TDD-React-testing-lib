import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import SignUp from './components/SignUp/SignUp';
import LanguageSelector from './components/LanguageSelector/LanguageSelector';
import ActivationPage from './components/ActivationPage/ActivationPage';
import Login from './components/Login/Login';
import UserPage from './components/UserPage/UserPage';

import logo from './assets/hoaxify.png';
import HomePage from './components/HomePage/HomePage';

function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/" title="Home">
            <img src={logo} alt="hoaxify logo" width="60" data-testid="logo" />
            Hoaxify
          </Link>
          <ul className="navbar-nav">
            <Link className="nav-link" to="/signup" title="Sign Up">
              {t('signUp')}
            </Link>
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </ul>
        </div>
      </nav>
      <div className="container pt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="users/:id" element={<UserPage />} />
          <Route path="activate/:token" element={<ActivationPage />} />
        </Routes>

        <LanguageSelector />
      </div>
    </BrowserRouter>
  );
}

export default App;
