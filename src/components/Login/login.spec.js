import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { render, screen } from '@testing-library/react';
import Login from './Login';
import React from 'react';

const server = setupServer(
  rest.post('/api/1.0/users', (request, response, context) => {
    return response(context.status(200));
  })
);

beforeEach(() => {
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

describe('Login page', () => {
  describe('Layout', () => {
    it('has header', () => {
      render(<Login />);
      const header = screen.queryByRole('heading', { name: 'Login' });

      expect(header).toBeInTheDocument();
    });

    it('has email input with querySelector method', () => {
      const { container } = render(<Login />);
      const input = container.querySelector('input[type="email"]');

      expect(input).toBeInTheDocument();
    });

    it('has email input with label', () => {
      render(<Login />);
      const input = screen.getByLabelText('Email');

      expect(input).toBeInTheDocument();
    });

    it('has password input', () => {
      render(<Login />);
      const input = screen.getByLabelText('Password');

      expect(input).toBeInTheDocument();
    });

    it('password input has password type', () => {
      render(<Login />);
      const input = screen.getByLabelText('Password');

      expect(input.type).toBe('password');
    });

    it('has header login button', () => {
      render(<Login />);
      const header = screen.queryByTestId('login-button');

      expect(header).toBeInTheDocument();
    });

    it('button initialize with disable status', () => {
      render(<Login />);
      const submitButton = screen.queryByTestId('login-button');

      expect(submitButton).toBeDisabled();
    });
  });
});
