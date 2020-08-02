import React from 'react';
import { shallow } from '../../setupTests';
import AbsenceViewer from '../AbsenceViewer';
import Date from ".";

describe('<Date/>', () => {
    const testData = {
        dateIndex: 4,
        absenceList: [{
            id: 'test1',
            type: 'vacation',
            employeeData: {
                name: "Test Vacation"
            }
        },
        {
            id: 'test2',
            type: 'sickness',
            employeeData: {
                name: "Test Sick"
            }
        },
        {
            id: 'test3',
            type: 'any',
            employeeData: {
                name: "Test Leave"
            }
        }],

    };
    const wrapper = shallow(<Date />);
    wrapper.setProps({
        dateObject: testData
    })

    const showAllAbsenceData = (data) => {
        console.log("Test data recieved on stimulate");
    }

    it('should mount Date component', () => {
        expect(wrapper).not.toBeNull();
    })

    it('should display numeric date', () => {
        expect(wrapper.find('#dateIndex').text()).toEqual("4");
    })

    it('should render AbsenceViewer Component', () => {
        expect(wrapper.find(AbsenceViewer).exists()).toBeTruthy();
        expect(wrapper.find(AbsenceViewer)).toHaveLength(1);
    })

    it('should show Chevron Down font icon to open modal.', () => {
        wrapper.setProps({
            showAllAbsenceData: showAllAbsenceData
        })
        expect(wrapper.find("#chevronDownIcon").exists()).toBeTruthy();
        wrapper.find("#chevronDownIcon").simulate('click');
    })
})