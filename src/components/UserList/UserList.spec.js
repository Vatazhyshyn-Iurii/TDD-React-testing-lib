import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { BrowserRouter } from 'react-router-dom';

import UserList from './UserList';
import LanguageSelector from '../LanguageSelector/LanguageSelector';

import en from '../../i18/en.json';
import ua from '../../i18/ua.json';

const users = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@mail.com',
    image: null,
  },
  {
    id: 2,
    username: 'user2',
    email: 'user2@mail.com',
    image: null,
  },
  {
    id: 3,
    username: 'user3',
    email: 'user3@mail.com',
    image: null,
  },
  {
    id: 4,
    username: 'user4',
    email: 'user1@mail.com',
    image: null,
  },
  {
    id: 5,
    username: 'user5',
    email: 'user2@mail.com',
    image: null,
  },
  {
    id: 6,
    username: 'user6',
    email: 'user3@mail.com',
    image: null,
  },
  {
    id: 7,
    username: 'user7',
    email: 'user3@mail.com',
    image: null,
  },
  {
    id: 8,
    username: 'user8',
    email: 'user8@mail.com',
    image: null,
  },
  {
    id: 9,
    username: 'user9',
    email: 'user9@mail.com',
    image: null,
  },
  {
    id: 10,
    username: 'user10',
    email: 'user10@mail.com',
    image: null,
  },
  {
    id: 11,
    username: 'user11',
    email: 'user11@mail.com',
    image: null,
  },
];

const getPage = (page, size, list) => {
  const start = page * size;
  const end = start + size;
  const totalPages = Math.ceil(list.length / size);

  return {
    content: list.slice(start, end),
    page,
    size,
    totalPages,
  };
};

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const server = setupServer(
  rest.get('/api/1.0/users', (request, response, context) => {
    let page = Number.parseInt(request.url.searchParams.get('page'));
    let size = Number.parseInt(request.url.searchParams.get('size'));

    if (!page) page = 0;
    if (!size) size = 5;

    return response(context.status(200), context.json(getPage(page, size, users)));
  })
);

const setup = () => {
  render(
    <BrowserRouter>
      <UserList />
      <LanguageSelector />
    </BrowserRouter>
  );
};

beforeEach(() => server.resetHandlers());

beforeAll(() => server.listen());

afterAll(() => server.close());

describe('UserList component', () => {
  describe('interactions', () => {
    it('displays three users in the list', async () => {
      setup();
      const users = await screen.findAllByText(/user/);

      expect(users.length).toBe(5);
    });

    it('displays the next page link', async () => {
      setup();
      await screen.findByText(/user1/);
      const nextBtn = screen.queryByTestId('nextPage-button');

      expect(nextBtn).toBeInTheDocument();
    });

    it('displays the next page after clicking next page button', async () => {
      setup();
      await screen.findByText(/user1/);
      const nextBtn = screen.queryByTestId('nextPage-button');
      userEvent.click(nextBtn);
      const firstUserOnNextPage = await screen.findByText(/user6/);

      expect(firstUserOnNextPage).toBeInTheDocument();
    });

    it('makes disabled the next page button on the last page', async () => {
      setup();
      await screen.findByText(/user1/);
      const nextBtn = screen.queryByTestId('nextPage-button');
      userEvent.click(nextBtn);
      await screen.findByText(/user6/);
      userEvent.click(nextBtn);
      await screen.findByText(/user11/);

      expect(nextBtn).toBeDisabled();
    });

    it('makes disabled the previous page button on the first page', async () => {
      render(<UserList />);
      await screen.findByText(/user1/);
      const prevBtn = screen.queryByTestId('prevPage-button');

      expect(prevBtn).toBeDisabled();
    });

    xit('displays the previous button in the next page', async () => {
      act(() => {
        setup();
      });
      await screen.findByText(/user1/);
      const prevBtn = await screen.queryByTestId('prevPage-button');
      act(() => {
        userEvent.click(screen.queryByTestId('nextPage-button'));
      });
      expect(prevBtn.getAttribute('disabled')).toBe('');
    });

    it('display spinner during the api call is in progress', async () => {
      setup();
      const spinner = screen.getByTestId('spinner');
      await screen.findByText(/user1/);

      expect(spinner).not.toBeInTheDocument();
    });
  });

  describe('Internationalization', () => {
    beforeEach(() => {
      server.use(
        rest.get('/api/1.0/users', (request, response, context) => {
          return response(context.status(200), context.json(getPage(1, 3, users)));
        })
      );
    });

    it('initially displays header and navigation links in english', async () => {
      setup();
      await screen.findByText(/user4/);

      expect(screen.getByText(en.users)).toBeInTheDocument();
      expect(screen.getByText(en.prevPage)).toBeInTheDocument();
      expect(screen.getByText(en.nextPage)).toBeInTheDocument();
    });

    it('initially displays header and navigation links in ukraine after clicking on change language button', async () => {
      setup();
      await screen.findByText(/user4/);
      userEvent.click(screen.queryByTestId('change-language'));

      expect(screen.getByText(ua.users)).toBeInTheDocument();
      expect(screen.getByText(ua.prevPage)).toBeInTheDocument();
      expect(screen.getByText(ua.nextPage)).toBeInTheDocument();
    });
  });
});
