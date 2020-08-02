import React from 'react';
import { shallow, mockData } from '../../setupTests';
import Filter from ".";
import { reducer as calendarReducer } from "../../containers/Calendar/reducers";
import * as AppConstants from '../../config/appConstants';
import * as actionTypes from '../../containers/Calendar/actionTypes';


const Initial_State = {
    months: [],
    years: [],
    filteredDates: [],
    originalDates: [],
    selectedMonth: '',
    selectedYear: '',
    selectedFilter: {
        filterBy: ''
    },
    customStartDate: null,
    customEndDate: null
};

describe('<Filter/>', () => {

    const wrapper = shallow(<Filter />);
    const onFilterChange = () => {
        expect(calendarReducer(Initial_State, { type: actionTypes.FILTER_AND_POPULATE_CALENDAR, filterBy: 'sickness', dateRangeQueryParams: null })).not.toEqual(Initial_State);
    }

    it('should mount Filter component', () => {
        expect(wrapper).not.toBeNull();
        expect(calendarReducer(Initial_State, { type: actionTypes.POPULATE_CALENDAR, data: mockData, dateRangeQueryParams: null })).not.toEqual(Initial_State);
    })

    it('should have dropdown for filter options', () => {
        expect(wrapper.find("select").exists).toBeTruthy();
        expect(wrapper.find("select").text()).toContain('All Employees');
    })

    it('should trigger on change event', () => {
        wrapper.setProps({
            onFilterChange: onFilterChange
        })
        expect(wrapper.find("select").exists).toBeTruthy();
        wrapper.find("select").simulate('change');
    })
    
})