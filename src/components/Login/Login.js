import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { login } from '../../api/apiCalls';

import Input from '../Input/Input';
import Alert from '../Alert/Alert';
import Button from '../Button/Button';
import { useDispatch } from 'react-redux';
import { actions } from '../../redux/actions';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiProgress, setApiProgress] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (email || password) {
      setError('');
    }
  }, [email, password]);

  useEffect(() => {
    if (ready) {
      navigate(`/`);
    }
  }, [ready, navigate]);

  const submit = async (e) => {
    e.preventDefault();

    setApiProgress(true);
    setError('');
    setReady(false);

    try {
      const response = await login({ email, password });
      setReady(true);
      dispatch(actions.loginSuccess(response.data.id));
      // setAuth({ isLoggedIn: true, id: response.data.id });
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
          <h1 className="text-center" data-testid="header">
            {t('login')}
          </h1>
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
          <Button
            disabled={!email || !password || apiProgress}
            onClick={submit}
            label="login"
            apiProgress={apiProgress}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
