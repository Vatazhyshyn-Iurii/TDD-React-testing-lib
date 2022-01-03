import SecureLS from 'secure-ls';

const serureLs = new SecureLS();

export const storage = {
  setItem: (key, value) => serureLs.set(key, value),
  getItem: (key) => serureLs.get(key),
  clearItem: () => localStorage.clear(),
};
