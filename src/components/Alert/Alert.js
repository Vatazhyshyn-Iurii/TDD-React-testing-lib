import React from 'react';
import classNames from 'classnames';

const Alert = ({ children, type, text, position }) => {
  const alertClassName = classNames('alert', `alert-${type}`, position && `text-${position}`);

  return (
    <div className={alertClassName}>
      {text}
      {children}
    </div>
  );
};

Alert.defaultProps = {
  type: 'success',
};

export default Alert;
