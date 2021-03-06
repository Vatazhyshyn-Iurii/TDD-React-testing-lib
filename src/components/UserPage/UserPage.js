import React, { useEffect, useState } from 'react';
import { fetchUser } from '../../api/apiCalls';
import { useParams } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import ProfileCard from '../ProfileCard/ProfileCard';
import Alert from '../Alert/Alert';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [error, seError] = useState(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    setLoading(true);
    seError(null);
    fetchUser(params.id)
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        seError(error?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  return (
    <div data-testid="user-page">
      {loading && <Spinner />}
      {user && <ProfileCard user={user} />}
      {error && <Alert type="danger" text={error} />}
    </div>
  );
};

export default UserPage;
