import React from 'react';
import { shallow } from '../../setupTests';
import AbsenceViewer from '.';
import VacationLegend from '../Date/Legend/vacation';
import SickLegend from '../Date/Legend/sick';
import LeaveLegend from '../Date/Legend/leave';

describe('<AbsenceViewer/>', () => {
    const testData = {
        absenceList: [{
            id: 'test1',
            type: 'vacation',
            employeeData: {
                name: "Test Vacation"
            }
        }]
    };
    const wrapper = shallow(<AbsenceViewer />);

    it('should mount AbsenceViewer component', () => {
        expect(wrapper).not.toBeNull();
    })

    it('should render VacationLegend component', () => {
        wrapper.setProps({
            userSelectedData: testData
        });
        expect(wrapper.find(VacationLegend)).toHaveLength(1);
        const vacationWrapper = wrapper.find(VacationLegend);
        expect(vacationWrapper.exists).toBeTruthy();
        expect(vacationWrapper.dive().find("#vacationLegend").text()).toEqual("Test Vacation is on vacation");
    })

    it('should render VacationLegend, SickLegend, LeaveLegend component', () => {
        const updatedTestData = {
            absenceList: testData.absenceList.concat([
                {
                    id: 'test2',
                    type: 'sickness',
                    employeeData: {
                        name: "Test Sick"
                    }
                },
                {
                    id: 'test3',
                    type: 'none',
                    employeeData: {
                        name: "Test Leave"
                    }
                }
            ])
        };
        wrapper.setProps({
            userSelectedData: updatedTestData
        });
        expect(wrapper.find(VacationLegend)).toHaveLength(1);
        expect(wrapper.find(VacationLegend).dive().find("#vacationLegend").text()).toEqual("Test Vacation is on vacation");
        expect(wrapper.find(SickLegend)).toHaveLength(1);
        expect(wrapper.find(SickLegend).dive().find("#sickLegend").text()).toEqual("Test Sick is sick");
        expect(wrapper.find(LeaveLegend)).toHaveLength(1);
        expect(wrapper.find(LeaveLegend).dive().find("#leaveLegend").text()).toEqual("Test Leave is on leave");
    })

})