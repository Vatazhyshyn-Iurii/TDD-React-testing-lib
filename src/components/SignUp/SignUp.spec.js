import React from 'react';
import { act, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from './SignUp';
import axios from 'axios';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import i18n from '../../i18/i18n';
import en from '../../i18/en.json';
import ua from '../../i18/ua.json';
import LanguageSelector from '../LanguageSelector/LanguageSelector';

let requestBody = null;
let counter = 0;
let acceptLanguageHeader;
const server = setupServer(
  rest.post('/api/1.0/users', (request, response, context) => {
    requestBody = request.body;
    counter += 1;
    acceptLanguageHeader = request.headers.get('Accept-Language');

    return response(context.status(200));
  })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

describe('Sign Up page', () => {
  describe('Layout', () => {
    it('has header', () => {
      render(<SignUp />);
      const header = screen.queryByRole('heading', { name: 'Sign Up' });

      expect(header).toBeInTheDocument();
    });

    it('has username input', () => {
      render(<SignUp />);
      const input = screen.getByPlaceholderText('John');

      expect(input).toBeInTheDocument();
    });

    it('has email input with querySelector method', () => {
      const { container } = render(<SignUp />);
      const input = container.querySelector('input[type="email"]');

      expect(input).toBeInTheDocument();
    });

    it('has email input with label', () => {
      render(<SignUp />);
      const input = screen.getByLabelText('Email');

      expect(input).toBeInTheDocument();
    });

    it('has password input', () => {
      render(<SignUp />);
      const input = screen.getByLabelText('Password');

      expect(input).toBeInTheDocument();
    });

    it('password input has password type', () => {
      render(<SignUp />);
      const input = screen.getByLabelText('Password');

      expect(input.type).toBe('password');
    });

    it('has password repeat input', () => {
      render(<SignUp />);
      const input = screen.getByLabelText('Password repeat');

      expect(input).toBeInTheDocument();
    });

    it('password repeat input has password type', () => {
      render(<SignUp />);
      const input = screen.getByLabelText('Password repeat');

      expect(input.type).toBe('password');
    });

    it('has header sign up button', () => {
      render(<SignUp />);
      const header = screen.queryByTestId('signUp-button');

      expect(header).toBeInTheDocument();
    });

    it('button initialize with disable status', () => {
      render(<SignUp />);
      const submitButton = screen.queryByTestId('signUp-button');

      expect(submitButton).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    let submitButton;
    let passwordInput;
    let repeatPasswordInput;
    let userNameInput;
    let emailInput;

    const setUp = () => {
      render(<SignUp />);

      userNameInput = screen.getByTestId('name');
      emailInput = screen.getByTestId('email');
      passwordInput = screen.getByTestId('password');
      repeatPasswordInput = screen.getByTestId('repeat-password');
      submitButton = screen.queryByTestId('signUp-button');

      userEvent.type(userNameInput, 'user1');
      userEvent.type(emailInput, 'user@mail.com');
      userEvent.type(passwordInput, 'p4ssword');
      userEvent.type(repeatPasswordInput, 'p4ssword');
    };

    it('enables the button when "password" and "repeat password" are the same value', () => {
      render(<SignUp />);

      const passwordInput = screen.getByTestId('password');
      const repeatPasswordInput = screen.getByTestId('repeat-password');
      const submitButton = screen.queryByTestId('signUp-button');

      userEvent.type(passwordInput, 'p4ssword');
      userEvent.type(repeatPasswordInput, 'p4ssword');

      expect(submitButton).toBeEnabled();
    });

    it('sends username email and password to backend after clicking to the button', async () => {
      setUp();

      // const mockFn = jest.fn();
      //
      // // for axios
      // // axios.post = mockFn;
      //
      // // for fetch
      // window.fetch = mockFn;

      userEvent.click(submitButton);

      await screen.findByText('Please check your email to activate your account');

      // const firstCallOfMockFunction = mockFn.mock.calls[0];
      // // for axios
      // // const body = firstCallOfMockFunction[1];
      // // for fetch
      // const body = JSON.parse(firstCallOfMockFunction[1].body);

      // expect(body).toEqual({
      //   username: 'user1',
      //   email: 'user@mail.com',
      //   password: 'p4ssword',
      // });
      expect(requestBody).toEqual({
        username: 'user1',
        email: 'user@mail.com',
        password: 'p4ssword',
      });
    });

    it('disables button when there is ongoing Api call', async () => {
      setUp();

      userEvent.click(submitButton);
      userEvent.click(submitButton);

      await screen.findByText('Please check your email to activate your account');

      expect(counter).toBe(1);
    });

    it('displays spinner after clicking submit button', async () => {
      setUp();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      userEvent.click(submitButton);

      expect(screen.queryByTestId('spinner')).toBeInTheDocument();
      await screen.findByText('Please check your email to activate your account');
    });

    it('displays account activation notification after successful sigh up request', async () => {
      setUp();
      const message = 'Please check your email to activate your account';
      expect(screen.queryByText(message)).not.toBeInTheDocument();
      userEvent.click(submitButton);
      const notificationText = await screen.findByText(message);
      expect(notificationText).toBeInTheDocument();
    });

    it('hide sign up form after successful sigh up request', async () => {
      setUp();
      const form = screen.getByTestId('signUp-form');
      userEvent.click(submitButton);
      // await waitFor(() => {
      //   expect(form).not.toBeInTheDocument();
      // });
      await waitForElementToBeRemoved(form);
    });

    it('displays an error message for username', async () => {
      server.use(
        rest.post('/api/1.0/users', (request, response, context) => {
          return response(
            context.status(400),
            context.json({
              validationErrors: { username: 'Username cannot be null' },
            })
          );
        })
      );
      setUp();
      userEvent.click(submitButton);

      const validationError = await screen.findByText('Username cannot be null');
      expect(validationError).toBeInTheDocument();
    });

    const generateValidationError = (field, message) => {
      return rest.post('/api/1.0/users', (request, response, context) => {
        return response(
          context.status(400),
          context.json({ validationErrors: { [field]: message } })
        );
      });
    };

    it.each`
      field         | message
      ${'username'} | ${'Username cannot be null'}
      ${'email'}    | ${'E-mail cannot be null'}
      ${'password'} | ${'Password must be at least 6 characters'}
    `('displays $message for $field', async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      setUp();
      userEvent.click(submitButton);

      await screen.findByText(message);
      const spinner = screen.queryByRole('status');
      expect(spinner).not.toBeInTheDocument();
    });

    it('hide spinner and enable button after response receives', async () => {
      server.use(generateValidationError('username', 'Username cannot be null'));
      setUp();
      userEvent.click(submitButton);

      await screen.findByText('Username cannot be null');
      const spinner = screen.queryByRole('status');
      expect(spinner).not.toBeInTheDocument();
    });
    it('displays an error message for email', async () => {
      server.use(generateValidationError('email', 'E-mail cannot be null'));
      setUp();
      userEvent.click(submitButton);

      const validationError = await screen.findByText('E-mail cannot be null');
      expect(validationError).toBeInTheDocument();
    });
    it('displays mismatch message for password repeat input', async () => {
      server.use(generateValidationError('email', 'E-mail cannot be null'));
      setUp();
      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(repeatPasswordInput, 'AnotherP4ssword');

      const validationError = screen.queryByText('Passport mismatch');
      expect(validationError).toBeInTheDocument();
    });

    it.each`
      field         | message                                     | label
      ${'username'} | ${'Username cannot be null'}                | ${'User name'}
      ${'email'}    | ${'E-mail cannot be null'}                  | ${'Email'}
      ${'password'} | ${'Password must be at least 6 characters'} | ${'Password'}
    `('clears validation error $field is updated', async ({ field, message, label }) => {
      server.use(generateValidationError(field, message));
      setUp();
      userEvent.click(submitButton);

      const validationError = await screen.findByText(message);
      userEvent.type(screen.getByLabelText(label), 'updated');

      expect(validationError).not.toBeInTheDocument();
    });
  });

  describe('Internationalization', () => {
    let languageToggle;
    let passwordInput;
    let passwordRepeatInput;

    const setUp = () => {
      render(
        <>
          <SignUp />
          <LanguageSelector />
        </>
      );

      languageToggle = screen.queryByTestId('change-language');
      passwordInput = screen.getByLabelText(en.password);
      passwordRepeatInput = screen.getByLabelText(en.passwordRepeat);
    };

    it('Initially displays all texts in English', () => {
      setUp();

      expect(screen.queryByRole('heading', { name: en.signUp })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: en.signUp })).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it('Displays all texts in Ukraine', () => {
      setUp();
      userEvent.click(languageToggle);

      expect(screen.queryByRole('heading', { name: ua.signUp })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: ua.signUp })).toBeInTheDocument();
      expect(screen.getByLabelText(ua.username)).toBeInTheDocument();
      expect(screen.getByLabelText(ua.email)).toBeInTheDocument();
      expect(screen.getByLabelText(ua.password)).toBeInTheDocument();
      expect(screen.getByLabelText(ua.passwordRepeat)).toBeInTheDocument();
    });

    it('Displays all texts in English', () => {
      setUp();
      userEvent.click(languageToggle);
      userEvent.click(languageToggle);

      expect(screen.queryByRole('heading', { name: en.signUp })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: en.signUp })).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it('displays password mismatch validation in Ukraine', () => {
      setUp();
      userEvent.click(languageToggle);
      passwordInput = screen.getByLabelText(ua.password);
      passwordRepeatInput = screen.getByLabelText(ua.passwordRepeat);

      userEvent.type(passwordInput, 'p4ss');
      userEvent.type(passwordRepeatInput, 'p');
      const validationMessageInUkraine = screen.getByText(ua.passwordMismatchValidation);

      expect(validationMessageInUkraine).toBeInTheDocument();
    });

    it('sends accept language header as "en" for outgoing request', async () => {
      setUp();
      const submitButton = screen.queryByTestId('signUp-button');
      const form = screen.queryByTestId('signUp-form');
      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'P4ssword');
      userEvent.click(submitButton);
      await waitForElementToBeRemoved(form);

      expect(acceptLanguageHeader).toBe('en');
    });

    it('sends accept language header as "ua" for outgoing request after electing that language', async () => {
      setUp();
      const submitButton = screen.queryByTestId('signUp-button');
      const form = screen.queryByTestId('signUp-form');
      userEvent.click(languageToggle);
      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'P4ssword');
      userEvent.click(submitButton);
      await waitForElementToBeRemoved(form);

      expect(acceptLanguageHeader).toBe('ua');
    });
  });
});
