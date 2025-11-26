import CONSTANTS from "../constants/constants";

// create a method to setItem in local storage
export const setTokenInLocalStorage = (token: any) => {
  localStorage.setItem(CONSTANTS.token_key.name, token);
};

// create a method to getitem from local storage
export const getTokenFromLocalStorage = () => {
  return localStorage.getItem(CONSTANTS.token_key.name);
};
