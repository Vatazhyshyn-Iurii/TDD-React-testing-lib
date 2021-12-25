import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

let acceptLanguageHeader;
const server = setupServer(
  rest.post('/api/1.0/users/token/:token', (request, response, context) => {
    acceptLanguageHeader = request.headers.get('Accept-Language');

    return response(context.status(200));
  }),
  rest.get('/api/1.0/users', (request, response, context) => {
    return response(
      context.status(200),
      context.json({
        content: [
          {
            id: 1,
            username: 'user-in-the-list',
            email: 'user1@mail.com',
            image: null,
          },
        ],
        page: 0,
        size: 0,
        totalPages: 0,
      })
    );
  }),
  rest.get('/api/1.0/users/:id', (req, res, cts) => {
    const id = parseInt(req.params.id);
    return res(cts.json({ id, username: `user${id}`, email: `user${id}@gmail.com`, image: null }));
  })
);

beforeEach(() => {
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

describe('Routing', () => {
  const setup = (path) => {
    window.history.pushState({}, '', path);
    render(<App />);
  };

  it.each`
    path               | pageTestId
    ${'/'}             | ${'home-page'}
    ${'/signup'}       | ${'sign-up-page'}
    ${'/login'}        | ${'login-page'}
    ${'/users/1'}      | ${'user-page'}
    ${'/users/2'}      | ${'user-page'}
    ${'/activate/123'} | ${'activation-page'}
    ${'/activate/456'} | ${'activation-page'}
  `('displays $pageTestId at the route $path', async ({ path, pageTestId }) => {
    setup(path);
    const component = await screen.queryByTestId(pageTestId);

    expect(component).toBeInTheDocument();
  });

  it.each`
    path               | pageTestId
    ${'/'}             | ${'sign-up-page'}
    ${'/'}             | ${'login-page'}
    ${'/'}             | ${'user-page'}
    ${'/'}             | ${'activation-page'}
    ${'/signup'}       | ${'home-page'}
    ${'/signup'}       | ${'login-page'}
    ${'/signup'}       | ${'user-page'}
    ${'/signup'}       | ${'activation-page'}
    ${'/login'}        | ${'sign-up-page'}
    ${'/login'}        | ${'home-page'}
    ${'/login'}        | ${'user-page'}
    ${'/login'}        | ${'activation-page'}
    ${'/activate/123'} | ${'sign-up-page'}
    ${'/activate/123'} | ${'home-page'}
    ${'/activate/123'} | ${'user-page'}
  `('does not display pageTestId at the route $path', ({ path, pageTestId }) => {
    setup(path);
    const component = screen.queryByTestId(pageTestId);

    expect(component).not.toBeInTheDocument();
  });

  it.each`
    targetPage
    ${'Home'}
    ${'Sign Up'}
    ${'Login'}
  `('has a link to $targetPage on NavBar', ({ targetPage }) => {
    setup('/');
    const link = screen.queryByRole('link', { name: targetPage });

    expect(link).toBeInTheDocument();
  });

  it.each`
    initialPath  | linkTarget   | visiblePage
    ${'/'}       | ${'Sign Up'} | ${'sign-up-page'}
    ${'/signup'} | ${'Home'}    | ${'home-page'}
    ${'/signup'} | ${'Login'}   | ${'login-page'}
  `(
    'displays $linkTarget page after clicking $linkTarget link',
    ({ initialPath, linkTarget, visiblePage }) => {
      setup(initialPath);
      const link = screen.queryByRole('link', { name: linkTarget });
      userEvent.click(link);
      const component = screen.queryByTestId(visiblePage);

      expect(component).toBeInTheDocument();
    }
  );

  it('displays home page when clicking brand logo', () => {
    setup('/login');
    const link = screen.queryByTestId('logo');
    userEvent.click(link);
    const component = screen.queryByTestId('home-page');

    expect(component).toBeInTheDocument();
  });

  it('navigates to user Page after clicking the username on user list', async () => {
    setup('/');
    const user = await screen.findByText('user-in-the-list');
    userEvent.click(user);
    const page = await screen.queryByTestId('user-page');

    expect(page).toBeInTheDocument();
  });
});

console.error = () => {};
