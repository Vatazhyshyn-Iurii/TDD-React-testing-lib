import { LOGIN_SUCCESS } from './actions';
import { storage } from '../state/storage';

const initialState = {
  id: '',
  isLoggedIn: false,
};

const storedState = storage.getItem('auth');

export const authReducer = (
  state = storedState?.authReducer || initialState,
  { type, payload }
) => {
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isLoggedIn: true,
      };
    default:
      return state;
  }
};
