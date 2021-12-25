import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { login } from '../../api/apiCalls';

import Input from '../Input/Input';
import Spinner from '../Spinner/Spinner';
import Alert from '../Alert/Alert';

const Login = ({ t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiProgress, setApiProgress] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (email || password) {
      setError('');
    }
  }, [email, password]);

  const submit = async (e) => {
    e.preventDefault();

    setApiProgress(true);
    setError('');

    try {
      await login({ email, password });
    } catch (error) {
      if (error.response.status === 401) {
        setError(error.response.data.message);
      }
    } finally {
      setApiProgress(false);
    }
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
            onChange={setEmail}
            type="email"
          />
          <Input
            name="Password"
            id="password"
            value={password}
            label={t('password')}
            placeholder="password"
            onChange={setPassword}
            type="password"
          />
        </div>
        {error && <Alert type="danger" text={error} />}
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
