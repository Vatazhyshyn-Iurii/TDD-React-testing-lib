export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_BEGIN = 'LOGIN_BEGIN';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

// export const loginBegin = ()
export const actions = {
  loginBegin: () => ({ type: LOGIN_BEGIN }),
  loginFailure: (error) => ({ type: LOGIN_FAILURE, payload: error }),
  loginSuccess: (id) => ({
    type: LOGIN_SUCCESS,
    payload: id,
  }),
  login: (id) => ({}),
};
