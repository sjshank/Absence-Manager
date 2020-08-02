import React from 'react';
import { shallow } from '../../setupTests';
import DatePickerItem from "./DatePickerItem";
import DatePicker from ".";
import * as AppConstants from '../../config/appConstants';

describe('<DatePicker/>', () => {

    const wrapper = shallow(<DatePicker />);
    const monthDatePickerTest = {
        options: AppConstants.MONTHS
    };

    const yearDatePickerTest = {
        options: ['2015', '2016', '2017', '2018']
    }

    it('should mount DatePicker component', () => {
        expect(wrapper).not.toBeNull();
    })

    it('should render DatePickerItem Component for month', () => {
        wrapper.setProps({
            options: monthDatePickerTest.options
        })
        expect(wrapper.find(DatePickerItem).exists()).toBeTruthy();
        expect(wrapper.find(DatePickerItem).length).toBeGreaterThan(10);
    })

    it('should render DatePickerItem Component for year', () => {
        wrapper.setProps({
            options: yearDatePickerTest.options
        })
        expect(wrapper.find(DatePickerItem).exists()).toBeTruthy();
        expect(wrapper.find(DatePickerItem).length).toEqual(4);
        //expect(wrapper.find(DatePickerItem).length).toBeGreaterThan(10);
    })

})