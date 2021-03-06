import axios from 'axios';
import i18n from '../i18/i18n';

axios.interceptors.request.use((request) => {
  request.headers['Accept-Language'] = i18n.language;

  return request;
});

export const signUp = ({ username, email, password }) =>
  axios.post('/api/1.0/users', { username, email, password });
export const activate = (token) => axios.post(`/api/1.0/users/token/${token}`);
export const fetchUsers = (page, size) => axios.get(`/api/1.0/users`, { params: { page, size } });
export const fetchUser = (id) => axios.get(`/api/1.0/users/${id}`);
export const login = (body) => axios.post(`/api/1.0/auth`, body);
