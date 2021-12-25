import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchUsers } from '../../api/apiCalls';

import Spinner from '../Spinner/Spinner';
import Alert from '../Alert/Alert';
import UserItem from '../UserItem/UserItem';

import './userList.css';

const UserList = () => {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState(null);
  const [pageData, setPageData] = useState({ page: 0, size: 0, totalPages: 0 });

  const { t } = useTranslation();

  const fetchUsersData = (page = 0, size = 5) => {
    setStatus('loading');
    fetchUsers(page, size)
      .then(({ data }) => {
        setContent(data.content);
        setPageData({ page: data.page, size: data.size, totalPages: data.totalPages });
        setStatus('null');
      })
      .catch((e) => setStatus('error'));
  };

  useEffect(() => {
    fetchUsersData();

    return () => {
      setContent(null);
    };
  }, []);

  const loadPrevPage = (page) => {
    fetchUsersData(page);
  };

  const loadNextPage = (page) => {
    fetchUsersData(page);
  };

  return (
    <div className="card">
      {status === 'loading' ? (
        <div className="d-flex justify-content-center mt-2 mb-2">
          <Spinner />
        </div>
      ) : status === 'error' ? (
        <Alert type="danger" text="Something went wrong." />
      ) : content ? (
        <div className="card-header text-center">
          <h3>{t('users')}</h3>
          <ul className="list-group list-group-flush">
            {content.map(({ id, username }) => (
              <UserItem id={id} key={id} name={username} />
            ))}
          </ul>
        </div>
      ) : null}
      <div className="card-footer text-center">
        <button
          className="btn btn-outline-secondary"
          data-testid="prev-page-btn"
          disabled={pageData.page === 0 || status === 'loading'}
          onClick={() => loadPrevPage(pageData.page - 1)}
        >
          {t('prevPage')}
        </button>
        <button
          className="btn btn-outline-secondary"
          data-testid="next-page-btn"
          disabled={pageData.page === pageData.totalPages - 1 || status === 'loading'}
          onClick={() => loadNextPage(pageData.page + 1)}
        >
          {t('nextPage')}
        </button>
      </div>
    </div>
  );
};

export default UserList;
