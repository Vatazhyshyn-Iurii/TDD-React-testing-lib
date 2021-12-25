import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { signUp } from '../../api/apiCalls';

import Input from '../Input/Input';
import Spinner from '../Spinner/Spinner';

const Login = ({ t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiProgress, setApiProgress] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const submit = async (e) => {
    e.preventDefault();

    setApiProgress(true);
    setErrors({
      email: '',
      password: '',
    });
    try {
      await signUp({ email, password });
    } catch (error) {
      if (error.response.status === 400) {
        const { email, username, password } = error.response.data.validationErrors;
        setErrors({ username, email, password });
        setApiProgress(false);
      }
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="login-page">
      <form className="card" data-testid="login-form">
        <div className="card-header">
          <h1 className="text-center">{t('login')}</h1>
        </div>
        <div className="card-body">
          <Input
            name="Email"
            id="email"
            value={email}
            label={t('email')}
            placeholder="somemail@gmail.com"
            errorMessage={errors.email}
            onChange={setEmail}
            type="email"
            setErrors={setErrors}
          />
          <Input
            name="Password"
            id="password"
            value={password}
            label={t('password')}
            placeholder="password"
            errorMessage={errors.password}
            onChange={setPassword}
            type="password"
            setErrors={setErrors}
          />
        </div>
        <div className="text-center">
          <button
            className="btn btn-primary mb-3"
            data-testid="login-button"
            disabled={!email || !password || apiProgress}
            onClick={submit}
          >
            {apiProgress && <Spinner size="small" />}
            {t('login')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default withTranslation()(Login);
