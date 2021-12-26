import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Spinner from '../Spinner/Spinner';

const Button = ({ classname, disabled, onClick, apiProgress, type, label }) => {
  const buttonClassName = classNames('btn', 'mb-3', type && `btn-${type}`, classname && classname);
  const { t } = useTranslation();

  return (
    <button
      className={buttonClassName}
      data-testid={`${label}-button`}
      disabled={disabled}
      onClick={onClick}
    >
      {apiProgress && <Spinner size="small" />}
      {t(label)}
    </button>
  );
};

Button.defaultProps = {
  onClick: () => {},
  type: 'primary',
  label: '',
};

Button.propTypes = {
  classname: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  apiProgress: PropTypes.bool,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Button;
