import React, { useState } from 'react';

import './withHover.css';
import classNames from 'classnames';

const withHover = (WrappedComponent) => ({ ...props }) => {
  const [mouseOn, setMouseOn] = useState(false);
  const withHoverClassname = classNames(mouseOn ? 'with-hover-active' : 'with-hover');

  const onMouseOver = () => {
    setMouseOn(true);
  };

  const onMouseLeave = () => {
    setMouseOn(false);
  };

  return (
    <div className={withHoverClassname} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <WrappedComponent {...props} />
    </div>
  );
};

export default withHover;
