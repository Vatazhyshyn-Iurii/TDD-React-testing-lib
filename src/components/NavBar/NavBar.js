import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/hoaxify.png';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

const NavBar = ({ logged, reducer }) => {
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/" title="Home">
          <img src={logo} alt="hoaxify logo" width="60" data-testid="logo" />
          Hoaxify
        </Link>
        <ul className="navbar-nav">
          {reducer.isLoggedIn || logged ? (
            <Link className="nav-link" to={`/users/${reducer.id || 5}`} data-testid="profile-link">
              My profile
            </Link>
          ) : (
            <>
              <Link className="nav-link" to="/signup" title="Sign Up" data-testid="signup-link">
                {t('signUp')}
              </Link>
              <Link className="nav-link" to="/login" data-testid="login-link">
                Login
              </Link>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default connect((reducer) => ({ ...reducer }), {})(NavBar);
