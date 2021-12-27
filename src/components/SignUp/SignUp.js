import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { signUp } from '../../api/apiCalls';

import Input from '../Input/Input';
import Alert from '../Alert/Alert';

import './signUp.css';
import Button from '../Button/Button';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [apiProgress, setApiProgress] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const { t } = useTranslation();

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (password && passwordRepeat) {
      if (password === passwordRepeat) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      if (!errors.username || !errors.email || !errors.password) {
        setDisabled(true);
      }
    }
  }, [password, passwordRepeat, errors]);

  const submit = async (e) => {
    e.preventDefault();

    setApiProgress(true);
    setErrors({
      username: '',
      email: '',
      password: '',
    });
    try {
      await signUp({ username, email, password });
      setSignUpSuccess(true);
    } catch (error) {
      if (error.response.status === 400) {
        const { email, username, password } = error.response.data.validationErrors;
        setErrors({ username, email, password });
        setApiProgress(false);
        setDisabled(false);
      }
    }
    // fetch('/api/1.0/users', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ username, email, password }),
    // });

    setUsername('');
    setEmail('');
    setPassword('');
    setPasswordRepeat('');
  };

  return (
    <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="sign-up-page">
      {!signUpSuccess && (
        <form className="card" data-testid="signUp-form">
          <div className="card-header">
            <h1 className="text-center">{t('signUp')}</h1>
          </div>
          <div className="card-body">
            <Input
              name="Username"
              id="name"
              value={username}
              label={t('username')}
              placeholder="John"
              errorMessage={errors.username}
              onChange={setUsername}
              setErrors={setErrors}
            />
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
            <Input
              name="Password"
              id="repeat-password"
              value={passwordRepeat}
              label={t('passwordRepeat')}
              placeholder="password"
              errorMessage={
                password &&
                passwordRepeat &&
                password !== passwordRepeat &&
                t('passwordMismatchValidation')
              }
              onChange={setPasswordRepeat}
              type="password"
              setErrors={setErrors}
            />
          </div>
          <div className="text-center">
            <Button
              disabled={disabled || apiProgress}
              onClick={submit}
              label="signUp"
              apiProgress={apiProgress}
            />
          </div>
        </form>
      )}
      {signUpSuccess && <Alert text="Please check your email to activate your account" />}
    </div>
  );
};

export default SignUp;
