import React from 'react';
import { act, render, screen, waitFor } from '../../test/setup';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import UserPage from './UserPage';

const server = setupServer();

beforeEach(() => {
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

describe('UserPage', () => {
  const setup = (id) => {
    render(<UserPage id={id} />);
  };

  beforeEach(() => {
    server.use(
      rest.get('/api/1.0/users/:id', async (req, res, ctx) => {
        return res(ctx.json({ id: 1, username: 'user1', email: 'user1@gmail.com', image: null }));
      })
    );
  });

  it('displays user name on page when user is found', async () => {
    setup(1);
    await waitFor(() => {
      expect(screen.queryByText(/user1/)).toBeInTheDocument();
    });
  });

  it('displays displays spinner while api call is in progress', async () => {
    act(() => {
      setup(1);
    });
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    await screen.findByText(/user1/);
    expect(spinner).not.toBeInTheDocument();
  });

  it('displays error message received from backend when user is not found', async () => {
    server.use(
      rest.get('/api/1.0/users/:id', async (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ message: 'User not found' }));
      })
    );
    setup(100);
    await waitFor(() => {
      expect(screen.queryByText('User not found')).toBeInTheDocument();
    });
  });
});
