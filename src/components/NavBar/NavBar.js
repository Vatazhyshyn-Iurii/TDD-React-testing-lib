import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/hoaxify.png';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../App';

const NavBar = ({ logged }) => {
  const auth = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/" title="Home">
          <img src={logo} alt="hoaxify logo" width="60" data-testid="logo" />
          Hoaxify
        </Link>
        <ul className="navbar-nav">
          {auth.isLoggedIn || logged ? (
            <Link className="nav-link" to={`/users/${auth.id || 5}`} data-testid="profile-link">
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

export default NavBar;
