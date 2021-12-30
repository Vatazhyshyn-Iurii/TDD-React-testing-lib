import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import Store from '../redux/store';

const AllTheProviders = ({ children }) => {
  return <Provider store={Store()}>{children}</Provider>;
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
