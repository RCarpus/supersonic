import { combineReducers } from "redux";

import {
    SET_USER_DATA,
    DUMMY_ACTION
} from '../actions/actions';

function userData(state = null, action) {
  switch (action.type) {
    case SET_USER_DATA:
      return action.value;
    default:
      return state;
  }
}

// Remove after adding more real reducers
function dummyAction(state = [], action) {
  switch (action.type) {
    case DUMMY_ACTION:
      return action.value;
    default:
      return state;
  }
}

const supersonicReducers = combineReducers({
  userData,
  dummyAction // remove after adding more
});

export default supersonicReducers;