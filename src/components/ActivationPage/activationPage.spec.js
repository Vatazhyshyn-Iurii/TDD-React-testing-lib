import React from 'react';
import { render, screen } from '@testing-library/react';
import ActivationPage from './ActivationPage';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

let counter = 0;
let acceptLanguageHeader;
const server = setupServer(
  rest.post('/api/1.0/users/token/:token', (request, response, context) => {
    counter += 1;

    if (request.params.token === '5678') {
      return response(context.status(400));
    }

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

describe('Activation Page', () => {
  const setup = (token) => {
    // const match = { params: { token: token } };
    render(<ActivationPage token={token} />);
  };

  it('displays activation success message when token is valid', async () => {
    setup('456');
    const message = await screen.findByText('Account is activated');

    expect(message).toBeInTheDocument();
  });

  it('sends activation request to backend', async () => {
    setup('456');
    await screen.findByText('Account is activated');

    expect(counter).toBe(1);
  });

  it('displays activation failure message when token is invalid', async () => {
    setup('5678');
    const message = await screen.findByText('Activation failure');

    expect(message).toBeInTheDocument();
  });

  it('sends activation request after the token is changed', async () => {
    let token = '1234';
    const { rerender } = render(<ActivationPage token={token} />);
    await screen.findByText('Account is activated');
    token = '5678';
    rerender(<ActivationPage token={token} />);
    await screen.findByText('Activation failure');

    expect(counter).toBe(2);
  });

  it('displays spinner during activation call', async () => {
    setup('5678');
    const spinner = await screen.queryByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    await screen.findByText('Activation failure');
    expect(spinner).not.toBeInTheDocument();
  });

  it('displays spinner after the second api call to the changed token', async () => {
    let token = '1234';
    const { rerender } = render(<ActivationPage token={token} />);
    await screen.findByText('Account is activated');
    token = '5678';
    rerender(<ActivationPage token={token} />);

    const spinner = await screen.queryByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    await screen.findByText('Activation failure');
    expect(spinner).not.toBeInTheDocument();
  });
});
