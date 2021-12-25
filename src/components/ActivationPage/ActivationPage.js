import React, { useCallback, useEffect, useState } from 'react';
import { activate } from '../../api/apiCalls';
import { useParams } from 'react-router-dom';
import Alert from '../Alert/Alert';
import Spinner from '../Spinner/Spinner';

const ActivationPage = ({ token }) => {
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const activateRequest = useCallback(async () => {
    setLoading(true);
    try {
      await activate(token || params.token);
      setResult('success');
    } catch (e) {
      setResult('failure');
    } finally {
      setLoading(false);
    }
  }, [params.token, token]);

  useEffect(() => {
    activateRequest();
  }, [activateRequest]);

  return (
    <div data-testid="activation-page">
      {loading && (
        <Alert type="secondary" position="center">
          <Spinner />
        </Alert>
      )}
      {result === 'success' && <Alert text="Account is activated" />}
      {result === 'failure' && <Alert type="danger" text="Activation failure" />}
    </div>
  );
};

export default ActivationPage;
