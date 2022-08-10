import { ERROR } from './types';

export const errorHandler = err => dispatch => {
  const message = err.response?.data?.error || err.message || err;

  setTimeout(() => {
    dispatch(throwError(null));
  }, 10000);
  dispatch({ type: ERROR, payload: message });
};

export const throwError = message => {
  return { type: ERROR, payload: message };
};
