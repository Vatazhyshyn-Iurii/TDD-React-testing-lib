import { LOGIN_SUCCESS } from './actions';

const initialState = {
  id: '',
  isLoggedIn: false,
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        id: payload,
        isLoggedIn: true,
      };
    default:
      return state;
  }
};
