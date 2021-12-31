export const storage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    const storedState = localStorage.getItem(key);

    if (!storedState) {
      return null;
    } else {
      try {
        return JSON.parse(storedState);
      } catch (e) {
        return storedState;
      }
    }
  },
  clearItem: () => localStorage.clear(),
};
