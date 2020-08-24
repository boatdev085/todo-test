import { initialState } from "./type";
import { SET_TYPE, ADD_VALUE, SET_REDO, ADD_MANUAL } from "./action";

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TYPE:
      return {
        ...state,
        filterType: action.payload.filterType,
        forFilter: action.payload.forFilter,
      };
    case SET_REDO:
      return { ...state, redo: action.payload.redo };
    case ADD_VALUE:
      return { ...state, value: action.payload.value };
    case ADD_MANUAL:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export default reducer;
