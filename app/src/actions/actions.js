// action types
export const SET_USER_DATA = 'SET_USER_DATA';
export const DUMMY_ACTION = 'DUMMY_ACTION';

// action creators
export function setUserData(value) {
  return {
    type: SET_USER_DATA, value:
    {
      Username: value.Username,
      Email: value.Email,
      Stats: value.Stats,
      Settings: value.Settings
    }
  };
}

// remove this after adding more real actions.
// this is only here to help illustrate the combined reducer.
export function dummyAction(value) {
  return { type: DUMMY_ACTION, value };
}