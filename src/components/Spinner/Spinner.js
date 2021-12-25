import React from 'react';
import classNames from 'classnames';

const Spinner = ({ size }) => {
  const spinnerClassName = classNames('spinner-border', size === 'small' && 'spinner-border-sm');

  return <span className={spinnerClassName} data-testid="spinner" />;
};

export default Spinner;
