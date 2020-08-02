import * as actionTypes from './actionTypes';
import * as helper from './utility';

/**
 * Reducer to handle all the dispatched action from Calendar
 * @param  state, current application state
 * @param  action, type of action and request params
 */
export const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.POPULATE_CALENDAR:
            return helper.populateCalendar(state, action);
        case actionTypes.UPDATE_AND_POPULATE_CALENDAR:
            return helper.updateCalendar(state, action)
        case actionTypes.FILTER_AND_POPULATE_CALENDAR:
            return helper.filterAndUpdateCalendar(state, action);
        case actionTypes.SET_ERROR:
            return helper.setError(state, action);
        default:
            return state;
    }
};

