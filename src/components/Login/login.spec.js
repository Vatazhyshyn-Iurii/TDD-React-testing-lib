import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { act, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import Login from './Login';
import React from 'react';
import userEvent from '@testing-library/user-event';

let requestBody;
let count;
const server = setupServer(
  rest.post('/api/1.0/auth', (request, response, context) => {
    requestBody = request.body;
    return response(context.status(401), context.json({ message: 'Incorrect credentials' }));
  })
);

beforeEach(() => {
  server.resetHandlers();
  count = 0;
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

  describe('Interactions', () => {
    let loginButton;
    let passwordInput;
    let emailInput;

    const setUp = () => {
      render(<Login />);

      emailInput = screen.getByTestId('email');
      passwordInput = screen.getByTestId('password');
      loginButton = screen.queryByTestId('login-button');
      count++;
      userEvent.type(emailInput, 'user1@gmail.com');
      userEvent.type(passwordInput, 'p4ssword');
    };

    it('enables login button when email and password inputs are filled', async () => {
      setUp();

      expect(loginButton).toBeEnabled();
    });

    it('displays spinner during the api call', async () => {
      act(() => {
        setUp();
      });
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      act(() => {
        userEvent.click(loginButton);
      });
      const spinner = await screen.getByTestId('spinner');
      await waitForElementToBeRemoved(spinner);
    });

    it('sends email and password to the backend after clicking the login button', async () => {
      setUp();
      userEvent.click(loginButton);
      const spinner = await screen.getByTestId('spinner');
      await waitForElementToBeRemoved(spinner);

      expect(requestBody).toEqual({ email: 'user1@gmail.com', password: 'p4ssword' });
    });

    it('disables login button when there is an api call', async () => {
      setUp();
      userEvent.click(loginButton);
      userEvent.click(loginButton);
      const spinner = await screen.getByTestId('spinner');
      await waitForElementToBeRemoved(spinner);
      expect(count).toBe(1);
    });

    it('disables authentication fail message', async () => {
      setUp();
      userEvent.click(loginButton);
      const spinner = await screen.getByTestId('spinner');
      await waitForElementToBeRemoved(spinner);
      const message = await screen.findByText('Incorrect credentials');
      expect(message).toBeInTheDocument();
    });

    it('clears authentication fail message after email or input was changed', async () => {
      setUp();
      userEvent.click(loginButton);
      const message = await screen.findByText('Incorrect credentials');
      expect(message).toBeInTheDocument();
      userEvent.type(emailInput, 'some@gmail.com');
      expect(message).not.toBeInTheDocument();
    });

    it('clears authentication fail message after password input was changed', async () => {
      setUp();
      userEvent.click(loginButton);
      const message = await screen.findByText('Incorrect credentials');
      expect(message).toBeInTheDocument();
      userEvent.type(passwordInput, 'somePass');
      expect(message).not.toBeInTheDocument();
    });
  });
});
