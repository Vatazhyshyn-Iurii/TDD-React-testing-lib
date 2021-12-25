import React from 'react';
import classNames from 'classnames';

const Input = ({
  id,
  label,
  onChange,
  errorMessage,
  name,
  value,
  placeholder,
  type = 'text',
  setErrors,
}) => {
  const inputClassname = classNames('form-control', errorMessage && 'is-invalid');
  const errorMessageClassname = classNames(errorMessage && 'invalid-feedback');

  const handleChange = (e) => {
    onChange(e.target.value);

    if (id === 'name') {
      setErrors((prev) => ({
        ...prev,
        username: '',
      }));
    } else if (id === 'email') {
      setErrors((prev) => ({
        ...prev,
        email: '',
      }));
    } else if (id === 'password') {
      setErrors((prev) => ({
        ...prev,
        password: '',
      }));
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={inputClassname}
        type={type}
        placeholder={placeholder}
        data-testid={id}
        name={name}
        value={value}
        onChange={(e) => handleChange(e)}
      />
      {errorMessage && (
        <span data-testid={`${id}-span`} className={errorMessageClassname}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default Input;
